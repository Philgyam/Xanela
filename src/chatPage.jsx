'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Send, Bot, User, Terminal, Sparkles, Loader } from 'lucide-react';

// Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Hooks
const useScrollToBottom = (dependency) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [dependency]);

  return messagesEndRef;
};

// Message Component
const MessageBubble = ({ message, isLastMessage }) => {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start space-x-3 max-w-[85%] ${isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
        <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
          isUser ? 'bg-green-900/20' : 'bg-gray-800/50'
        }`}>
          {isUser ? 
            <User className="w-6 h-6 text-green-400" /> : 
            <Bot className="w-6 h-6 text-gray-400" />
          }
        </div>
        <div className={`px-6 py-4 rounded-xl ${
          isUser 
            ? 'bg-green-900/20 text-gray-100' 
            : 'bg-gray-800/50 text-gray-100'
        }`}>
          <p className="text-lg leading-relaxed whitespace-pre-line">
            {message.text}
            {message.streaming && <span className="animate-pulse text-green-400">|</span>}
          </p>
        </div>
      </div>
    </div>
  );
};

// Main Chat Interface Component
export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useScrollToBottom(messages);

  const createSystemPrompt = useCallback((customPrompt) => {
    return `Provide a comprehensive response about the topic with these formatting guidelines:
1. Use numbered main sections
2. Write each key point on a new line
3. Maintain clear, concise explanations
4. Use a professional, informative tone
5. Provide specific details and examples
6. Ensure each point is clearly separated and readable
remove all hashes and asterisks and hyphens from your responses

Structure the response to:
- Have distinct sections
- Break information into digestible chunks
- Use line breaks for clarity
- Avoid dense paragraphs
- Provide context for each point

Emphasize readability and clear communication of key information.${customPrompt}`;
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!input.trim()) {
      console.error('Input is empty');
      return;
    }

    // Add user message
    const userMessage = { 
      id: Date.now(), 
      text: input.trim(), 
      sender: 'user' 
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Prepare bot message placeholder
      const botMessage = { 
        id: Date.now() + 1, 
        text: '', 
        sender: 'bot',
        streaming: true 
      };
      setMessages(prevMessages => [...prevMessages, botMessage]);

      const response = await fetch('https://xanelabackend.onrender.com/api/botAsk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemPrompt: createSystemPrompt(systemPrompt),
          userQuery: input,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.trim() === '' || line === 'data: [DONE]') continue;
          
          if (line.startsWith('data: ')) {
            try {
              const jsonData = JSON.parse(line.slice(6));
              if (jsonData.content) {
                accumulatedResponse += jsonData.content;
                setMessages(prevMessages => {
                  const updatedMessages = [...prevMessages];
                  const lastMessageIndex = updatedMessages.length - 1;
                  updatedMessages[lastMessageIndex] = {
                    ...updatedMessages[lastMessageIndex],
                    text: accumulatedResponse,
                    streaming: true
                  };
                  return updatedMessages;
                });
              }
            } catch (error) {
              console.error('Stream parsing error:', error);
            }
          }
        }
      }

      // Finalize message
      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages];
        const lastMessageIndex = updatedMessages.length - 1;
        updatedMessages[lastMessageIndex] = {
          ...updatedMessages[lastMessageIndex],
          streaming: false
        };
        return updatedMessages;
      });

    } catch (error) {
      console.error('Request error:', error);
      const errorMessage = { 
        id: Date.now() + 2, 
        text: "Sorry, something went wrong. Please try again.", 
        sender: 'bot' 
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
};

  const handleSavePrompt = () => {
    console.log("Saved System Prompt:", systemPrompt);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 p-4 flex flex-col items-center justify-center">
      {/* System Prompt Section */}
      <div className="w-full max-w-5xl mb-6">
        <div className="bg-black/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <Terminal className="w-6 h-6 text-purple-400" />
            <h2 className="text-purple-400 font-semibold text-xl">System Prompt</h2>
          </div>
          <div className="flex flex-col">
            <Input
              type="text"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="Type bot system prompt here..."
              className="bg-black/60 text-gray-100 placeholder-gray-500 rounded-lg mb-3 h-20 text-lg px-4 border-gray-700"
            />
            <Button 
              onClick={handleSavePrompt} 
              className="bg-green-600 hover:bg-green-700 rounded-lg h-12 text-lg font-medium transition-all duration-200 ease-in-out transform hover:scale-105"
            >
              Save Prompt
            </Button>
          </div>
          <p className="text-gray-400 text-base mt-3">
            This bot is designed to help you with various tasks, provide information, and engage in meaningful conversations.
          </p>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="w-full max-w-5xl bg-black/50 backdrop-blur-lg border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
        {/* Chat Header */}
        <div className="bg-black/60 border-b border-gray-700 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-green-900/20 flex items-center justify-center">
              <Bot className="w-7 h-7 text-green-400" />
            </div>
            <div>
              <h3 className="text-gray-100 font-medium text-xl">AI Assistant</h3>
              <p className="text-gray-400 text-sm">Always here to help</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-yellow-400">Active</span>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="h-[600px] overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
          <div className="flex flex-col space-y-6">
            {messages.map((message, index) => (
              <MessageBubble 
                key={message.id} 
                message={message}
                isLastMessage={index === messages.length - 1}
              />
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-3 bg-gray-800/30 px-6 py-4 rounded-xl">
                  <Loader className="animate-spin w-6 h-6 text-green-400" />
                  <p className="text-gray-300 text-lg">Thinking...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-700 p-6 bg-black/60">
          <form onSubmit={handleSendMessage} className="relative">
            <div className="flex space-x-3">
              <Input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow bg-gray-900/70 border-gray-700 rounded-xl text-lg text-gray-100 placeholder-gray-500 h-14 px-6"
              />
              <Button 
                type="submit" 
                className="bg-green-600 hover:bg-green-700 rounded-xl shadow-lg px-6 h-14 transition-all duration-200 ease-in-out transform hover:scale-105"
              >
                <Send className="h-6 w-6" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}