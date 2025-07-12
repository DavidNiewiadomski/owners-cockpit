import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

// Test service health
async function testService(name, testFn) {
  const start = Date.now();
  try {
    await testFn();
    return {
      service: name,
      status: 'healthy',
      responseTime: Date.now() - start
    };
  } catch (error) {
    return {
      service: name,
      status: 'unhealthy',
      responseTime: Date.now() - start,
      error: error.message
    };
  }
}

// Health check endpoint
router.get('/', async (req, res) => {
  const startTime = Date.now();
  const services = [];
  
  // Test OpenAI
  if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('your-')) {
    services.push(await testService('OpenAI', async () => {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` }
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
    }));
  } else {
    services.push({
      service: 'OpenAI',
      status: 'degraded',
      responseTime: 0,
      error: 'API key not configured'
    });
  }
  
  // Test Anthropic
  if (process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_API_KEY.includes('your-')) {
    services.push({
      service: 'Anthropic',
      status: 'healthy',
      responseTime: 0,
      note: 'API key configured'
    });
  } else {
    services.push({
      service: 'Anthropic',
      status: 'degraded',
      responseTime: 0,
      error: 'API key not configured'
    });
  }
  
  // Test Google Gemini
  if (process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('your-')) {
    services.push({
      service: 'Google Gemini',
      status: 'healthy',
      responseTime: 0,
      note: 'API key configured'
    });
  } else {
    services.push({
      service: 'Google Gemini',
      status: 'degraded',
      responseTime: 0,
      error: 'API key not configured'
    });
  }
  
  // Test ElevenLabs
  if (process.env.ELEVENLABS_API_KEY && !process.env.ELEVENLABS_API_KEY.includes('your-')) {
    services.push(await testService('ElevenLabs', async () => {
      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY }
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
    }));
  } else {
    services.push({
      service: 'ElevenLabs',
      status: 'degraded',
      responseTime: 0,
      error: 'API key not configured'
    });
  }
  
  // Calculate overall health
  const unhealthyCount = services.filter(s => s.status === 'unhealthy').length;
  const degradedCount = services.filter(s => s.status === 'degraded').length;
  
  let overall = 'healthy';
  if (unhealthyCount > 2 || (unhealthyCount === 0 && degradedCount === services.length)) {
    overall = 'unhealthy';
  } else if (unhealthyCount > 0 || degradedCount > 2) {
    overall = 'degraded';
  }
  
  res.json({
    timestamp: new Date().toISOString(),
    overall,
    services,
    totalResponseTime: Date.now() - startTime,
    environment: process.env.NODE_ENV || 'development',
    note: 'This is the local AI proxy server health check'
  });
});

export { router as healthCheckRouter };