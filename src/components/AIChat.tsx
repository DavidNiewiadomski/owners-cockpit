import React, { useState, useEffect, KeyboardEvent } from 'react';
import { conversationalAI } from '../services/conversationalAI';
import { elevenLabsVoiceService } from '../services/elevenLabsVoice';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initAI = async () => {
      await conversationalAI.initialize({
        openai: process.env.OPENAI_API_KEY,
        elevenlabs: process.env.ELEVENLABS_API_KEY
      });
    };
    initAI();
  }, []);

  const handleSend = async () => {
    if (loading || !input.trim()) return;
    setLoading(true);

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const response = await conversationalAI.processConversation({
        message: input,
        projectId: 'currentProject'
      });
      const assistantMessage = { role: 'assistant', content: response.message };
      setMessages(prev => [...prev, assistantMessage]);

      if (response.audioUrl) {
        await elevenLabsVoiceService.playAudio(response.audioUrl);
      }
    } catch (error) {
      console.error('Error during AI processing:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-chat">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={msg.role}>
            {msg.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') handleSend();
        }}
      />
      <button onClick={handleSend} disabled={loading}>Send</button>
    </div>
  );
};

export default AIChat;

