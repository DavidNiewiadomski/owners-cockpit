const AWS = require('aws-sdk');
const https = require('https');
const fs = require('fs');

// Initialize AWS services
const s3 = new AWS.S3();

// Doc-extractor service endpoint
const DOC_EXTRACTOR_ENDPOINT = process.env.DOC_EXTRACTOR_ENDPOINT || 'http://localhost:8000';

/**
 * AWS Lambda handler for S3 ObjectCreated events
 * Triggers document extraction when files are uploaded to RFP folders
 */
exports.handler = async (event) => {
    console.log('Lambda triggered with event:', JSON.stringify(event, null, 2));
    
    const results = [];
    
    for (const record of event.Records) {
        try {
            // Parse S3 event
            const bucket = record.s3.bucket.name;
            const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
            
            console.log(`Processing file: ${key} from bucket: ${bucket}`);
            
            // Extract rfp_id and submission_id from S3 key path
            // Expected format: rfp_submissions/{rfp_id}/{submission_id}/{filename}
            const pathParts = key.split('/');
            if (pathParts.length < 4 || pathParts[0] !== 'rfp_submissions') {
                console.log(`Skipping file ${key} - not in expected rfp_submissions folder structure`);
                continue;
            }
            
            const rfp_id = pathParts[1];
            const submission_id = pathParts[2];
            const filename = pathParts[3];
            
            // Check if file is PDF or XLSX
            const fileExtension = filename.toLowerCase().split('.').pop();
            if (!['pdf', 'xlsx'].includes(fileExtension)) {
                console.log(`Skipping file ${filename} - not a supported format (PDF or XLSX)`);
                continue;
            }
            
            // Download file from S3
            console.log(`Downloading file from S3: ${key}`);
            const fileData = await s3.getObject({ Bucket: bucket, Key: key }).promise();
            
            // Generate file ID for tracking
            const file_id = `${rfp_id}_${submission_id}_${Date.now()}`;
            
            // Call doc-extractor service
            const extractionResult = await callDocExtractor({
                file_data: fileData.Body,
                file_id: file_id,
                submission_id: submission_id,
                filename: filename,
                content_type: fileData.ContentType
            });
            
            results.push({
                file: key,
                submission_id: submission_id,
                file_id: file_id,
                success: extractionResult.success,
                line_items_count: extractionResult.line_items_count,
                alternates_count: extractionResult.alternates_count,
                unit_prices_count: extractionResult.unit_prices_count,
                base_bid_total: extractionResult.base_bid_total
            });
            
            console.log(`Successfully processed ${filename}:`, extractionResult);
            
        } catch (error) {
            console.error(`Error processing record:`, error);
            results.push({
                file: record.s3.object.key,
                success: false,
                error: error.message
            });
        }
    }
    
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: `Processed ${event.Records.length} files`,
            results: results
        })
    };
};

/**
 * Call the doc-extractor service to process the uploaded file
 */
async function callDocExtractor({ file_data, file_id, submission_id, filename, content_type }) {
    return new Promise((resolve, reject) => {
        // Create form data boundary
        const boundary = '----formdata-' + Math.random().toString(36);
        
        // Build form data
        let formData = '';
        
        // Add file_id field
        formData += `--${boundary}\r\n`;
        formData += `Content-Disposition: form-data; name="file_id"\r\n\r\n`;
        formData += `${file_id}\r\n`;
        
        // Add submission_id field
        formData += `--${boundary}\r\n`;
        formData += `Content-Disposition: form-data; name="submission_id"\r\n\r\n`;
        formData += `${submission_id}\r\n`;
        
        // Add file field
        formData += `--${boundary}\r\n`;
        formData += `Content-Disposition: form-data; name="file"; filename="${filename}"\r\n`;
        formData += `Content-Type: ${content_type || 'application/octet-stream'}\r\n\r\n`;
        
        // Convert form data to buffer and add file data
        const formDataPrefix = Buffer.from(formData, 'utf8');
        const formDataSuffix = Buffer.from(`\r\n--${boundary}--\r\n`, 'utf8');
        const requestBody = Buffer.concat([formDataPrefix, file_data, formDataSuffix]);
        
        // Parse endpoint URL
        const url = new URL(`${DOC_EXTRACTOR_ENDPOINT}/extract`);
        
        const options = {
            hostname: url.hostname,
            port: url.port || (url.protocol === 'https:' ? 443 : 80),
            path: url.pathname,
            method: 'POST',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${boundary}`,
                'Content-Length': requestBody.length
            },
            timeout: 300000 // 5 minute timeout
        };
        
        const client = url.protocol === 'https:' ? https : require('http');
        
        console.log(`Calling doc-extractor at ${DOC_EXTRACTOR_ENDPOINT}/extract`);
        
        const req = client.request(options, (res) => {
            let responseData = '';
            
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            
            res.on('end', () => {
                try {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        const result = JSON.parse(responseData);
                        resolve(result);
                    } else {
                        reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
                    }
                } catch (error) {
                    reject(new Error(`Failed to parse response: ${error.message}`));
                }
            });
        });
        
        req.on('error', (error) => {
            reject(error);
        });
        
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });
        
        // Send the request
        req.write(requestBody);
        req.end();
    });
}
