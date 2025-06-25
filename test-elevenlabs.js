// Test ElevenLabs Integration
// Run with: node test-elevenlabs.js

import fetch from 'node-fetch';

const ELEVENLABS_API_KEY = 'sk_6e90e97fd95ca8607850cbadcf8caff9055b5cdb8ee0b360';
const ELEVENLABS_VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // Bella - Professional

async function testElevenLabsAPI() {
  console.log('🧪 Testing ElevenLabs API Integration...\n');

  try {
    // Test 1: Get available voices
    console.log('1️⃣ Testing API connection and fetching voices...');
    const voicesResponse = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY
      }
    });

    if (!voicesResponse.ok) {
      throw new Error(`Voices API failed: ${voicesResponse.status} ${voicesResponse.statusText}`);
    }

    const voicesData = await voicesResponse.json();
    console.log(`✅ Successfully fetched ${voicesData.voices.length} voices`);
    
    // List available voices
    console.log('\n📋 Available Voices:');
    voicesData.voices.slice(0, 5).forEach((voice, index) => {
      console.log(`   ${index + 1}. ${voice.name} (${voice.voice_id}) - ${voice.description || 'No description'}`);
    });

    // Test 2: Generate speech from text
    console.log('\n2️⃣ Testing text-to-speech generation...');
    const testText = 'Hello! I am your AI construction assistant. I can help you manage your projects, analyze budgets, and coordinate with your team using natural voice conversations.';
    
    const ttsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        text: testText,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
          style: 0.2,
          use_speaker_boost: true
        }
      })
    });

    if (!ttsResponse.ok) {
      throw new Error(`TTS API failed: ${ttsResponse.status} ${ttsResponse.statusText}`);
    }

    const audioBuffer = await ttsResponse.buffer();
    console.log(`✅ Successfully generated ${audioBuffer.length} bytes of audio`);

    // Test 3: Check API usage/quota
    console.log('\n3️⃣ Checking API usage and quota...');
    const userResponse = await fetch('https://api.elevenlabs.io/v1/user', {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY
      }
    });

    if (userResponse.ok) {
      const userData = await userResponse.json();
      console.log(`✅ Account info: ${userData.subscription?.tier || 'Free'} tier`);
      
      if (userData.subscription?.character_count !== undefined) {
        const used = userData.subscription.character_count;
        const limit = userData.subscription.character_limit;
        console.log(`📊 Character usage: ${used.toLocaleString()}/${limit.toLocaleString()} (${((used/limit)*100).toFixed(1)}%)`);
      }
    }

    console.log('\n🎉 All tests passed! ElevenLabs integration is working correctly.');
    console.log('\n📝 Integration Summary:');
    console.log('   ✅ API authentication successful');
    console.log('   ✅ Voice models accessible');
    console.log('   ✅ Text-to-speech generation working');
    console.log('   ✅ Professional voice (Bella) configured');
    console.log('\n🚀 Your Premium AI Chat is ready for voice interactions!');

  } catch (error) {
    console.error('\n❌ ElevenLabs API Test Failed:');
    console.error(`   Error: ${error.message}`);
    console.error('\n🔧 Troubleshooting steps:');
    console.error('   1. Verify API key is correct');
    console.error('   2. Check internet connection');
    console.error('   3. Ensure ElevenLabs account is active');
    console.error('   4. Check API rate limits');
  }
}

// Run the test
testElevenLabsAPI();
