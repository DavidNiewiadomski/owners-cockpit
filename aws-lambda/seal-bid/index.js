const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

exports.handler = async (event) => {
  console.log('S3 ObjectCreated event received:', JSON.stringify(event, null, 2));
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    // Process each S3 record
    for (const record of event.Records) {
      if (record.eventSource === 'aws:s3' && record.eventName.startsWith('ObjectCreated')) {
        const bucket = record.s3.bucket.name;
        const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
        const etag = record.s3.object.eTag;
        const size = record.s3.object.size;
        
        console.log(`Processing object: ${bucket}/${key}`);
        
        // Parse S3 key to extract metadata
        // Expected format: rfp/{rfp_id}/{date}/{vendor_id}/{submission_type}/{filename}
        const keyParts = key.split('/');
        if (keyParts.length < 5 || keyParts[0] !== 'rfp') {
          console.log(`Skipping object with unexpected key format: ${key}`);
          continue;
        }
        
        const rfpId = keyParts[1];
        const vendorId = keyParts[3];
        const submissionType = keyParts[4];
        const fileName = keyParts.slice(5).join('/'); // Handle nested paths
        
        // Find the corresponding bid_submission record
        const { data: submissions, error: findError } = await supabase
          .from('bid_submissions')
          .select('*')
          .eq('s3_key', key)
          .limit(1);
        
        if (findError) {
          console.error('Error finding submission:', findError);
          continue;
        }
        
        let submissionId;
        
        if (submissions.length === 0) {
          // Create new bid_submission record if it doesn't exist
          console.log(`Creating new bid_submission record for ${key}`);
          
          // First, find the vendor_submission record
          const { data: vendorSubmissions, error: vsError } = await supabase
            .from('vendor_submission')
            .select('id')
            .eq('rfp_id', rfpId)
            .eq('vendor_id', vendorId)
            .limit(1);
          
          if (vsError || vendorSubmissions.length === 0) {
            console.error('Vendor submission not found:', vsError || 'No records');
            continue;
          }
          
          const { data: newSubmission, error: createError } = await supabase
            .from('bid_submissions')
            .insert({
              rfp_id: rfpId,
              vendor_submission_id: vendorSubmissions[0].id,
              submission_type: submissionType,
              s3_bucket: bucket,
              s3_key: key,
              s3_etag: etag,
              file_name: fileName,
              file_size: size,
              sealed: true,
              sealed_at: new Date().toISOString(),
              upload_completed_at: new Date().toISOString(),
              upload_metadata: {
                lambda_processed: true,
                processed_at: new Date().toISOString(),
                s3_event_name: record.eventName
              }
            })
            .select('id')
            .single();
          
          if (createError) {
            console.error('Error creating bid_submission:', createError);
            continue;
          }
          
          submissionId = newSubmission.id;
        } else {
          // Update existing record to mark as sealed
          submissionId = submissions[0].id;
          
          const { error: updateError } = await supabase
            .from('bid_submissions')
            .update({
              s3_etag: etag,
              file_size: size,
              sealed: true,
              sealed_at: new Date().toISOString(),
              upload_completed_at: new Date().toISOString(),
              upload_metadata: {
                ...submissions[0].upload_metadata,
                lambda_processed: true,
                processed_at: new Date().toISOString(),
                s3_event_name: record.eventName
              }
            })
            .eq('id', submissionId);
          
          if (updateError) {
            console.error('Error updating bid_submission:', updateError);
            continue;
          }
        }
        
        // Mark the presigned upload token as used
        const { error: tokenError } = await supabase
          .from('presigned_upload_tokens')
          .update({
            used: true,
            used_at: new Date().toISOString()
          })
          .eq('s3_key', key)
          .eq('used', false);
        
        if (tokenError) {
          console.warn('Error updating presigned token (may not exist):', tokenError);
        }
        
        // Log the sealing action
        await supabase.rpc('log_submission_access', {
          p_submission_id: submissionId,
          p_action: 'sealed_by_lambda',
          p_user_id: null,
          p_metadata: {
            s3_bucket: bucket,
            s3_key: key,
            s3_etag: etag,
            file_size: size,
            event_name: record.eventName,
            processed_at: new Date().toISOString()
          }
        });
        
        console.log(`Successfully sealed bid submission: ${submissionId}`);
        
        // Optional: Send notification (SNS, email, etc.)
        // This could integrate with your existing notification system
        await sendSealedNotification(rfpId, vendorId, submissionType);
      }
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Successfully processed S3 events',
        processedRecords: event.Records.length
      })
    };
    
  } catch (error) {
    console.error('Lambda execution error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message
      })
    };
  }
};

async function sendSealedNotification(rfpId, vendorId, submissionType) {
  try {
    // This could integrate with SNS, SES, or your notification system
    console.log(`Sending sealed notification: RFP ${rfpId}, Vendor ${vendorId}, Type ${submissionType}`);
    
    // Example: Call your notification Edge Function
    const notificationPayload = {
      event_type: 'bid.submission.sealed',
      rfp_id: rfpId,
      vendor_id: vendorId,
      submission_type: submissionType,
      timestamp: new Date().toISOString()
    };
    
    // You could make an HTTP request to your Supabase Edge Function here
    // or publish to SNS/SQS for async processing
    
  } catch (error) {
    console.warn('Failed to send sealed notification:', error);
    // Don't fail the Lambda if notification fails
  }
}
