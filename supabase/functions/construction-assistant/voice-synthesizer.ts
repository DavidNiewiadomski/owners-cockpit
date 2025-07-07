// Voice synthesis using ElevenLabs API
export class VoiceSynthesizer {
  private voiceId = 'pNInz6obpgDQGcFmaJgB' // Default voice ID
  private modelId = 'eleven_monolingual_v1'

  async synthesize(text: string): Promise<string | undefined> {
    const elevenLabsApiKey = Deno.env.get('ELEVENLABS_API_KEY')
    if (!elevenLabsApiKey || elevenLabsApiKey === 'your_elevenlabs_api_key_here') {
      console.warn('ElevenLabs API key not available or is placeholder')
      return undefined
    }

    try {
      // Truncate text if too long (ElevenLabs has limits)
      const truncatedText = text.length > 2500 ? text.substring(0, 2500) + '...' : text

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${this.voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': elevenLabsApiKey
        },
        body: JSON.stringify({
          text: truncatedText,
          model_id: this.modelId,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Voice synthesis failed: ${response.status} ${response.statusText} - ${errorText}`)
      }

      // Get the audio blob
      const audioArrayBuffer = await response.arrayBuffer()
      
      // Convert to base64 for storage/transmission
      const audioBase64 = btoa(String.fromCharCode(...new Uint8Array(audioArrayBuffer)))
      
      // Return a data URL that can be used directly
      return `data:audio/mpeg;base64,${audioBase64}`
      
    } catch (error) {
      console.error('Voice synthesis error:', error)
      return undefined
    }
  }

  // Test method to verify voice synthesis is working
  async testSynthesis(): Promise<boolean> {
    try {
      const result = await this.synthesize('Hello, this is a test of the voice synthesis system.')
      return result !== undefined
    } catch (error) {
      console.error('Voice synthesis test failed:', error)
      return false
    }
  }
}

