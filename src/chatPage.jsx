'use client'

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Terminal, Sparkles, Loader } from 'lucide-react';
import { useAuthStore } from './store';
import axios from 'axios';

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const messagesEndRef = useRef(null);
  const { botQuery } = useAuthStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (input.trim()) {
      const userMessage = { id: Date.now(), text: input.trim(), sender: 'user' };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInput('');
      setLoading(true); // Set loading to true

      console.log('System Prompt:', systemPrompt);
      console.log('User Query:', input.trim());

      try {
        const response = await axios.post('https://xanelabackend.onrender.com/api/botAsk', {
          systemPrompt: systemPrompt,
          userQuery: input,
        });

        console.log('Response:', response.data); // Log the full response

        const botMessage = { id: Date.now() + 1, text: response.data.response, sender: 'bot' };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
        
      } catch (error) {
        console.error('Error during request:', error.response ? error.response.data : error.message);
        const errorMessage = { id: Date.now() + 1, text: "Sorry, something went wrong. Please try again.", sender: 'bot' };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      } finally {
        setLoading(false); // Set loading to false after receiving response or error
      }
    } else {
      console.error('Input is empty');
    }
  };

  const handleSavePrompt = () => {
    console.log("Saved System Prompt:", systemPrompt);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 flex flex-col items-center justify-center">
      {/* System Prompt Card */}
      <div className="w-full max-w-4xl mb-6">
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-4 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <h2 className="text-emerald-400 font-semibold">System Prompt</h2>
          </div>
          <div className="flex flex-col">
            <Input
              type="text"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="Type bot system prompt here..."
              className="bg-gray-700 text-gray-100 placeholder-gray-400 rounded-lg mb-2 h-16"
            />
            <Button onClick={handleSavePrompt} className="bg-emerald-500 hover:bg-emerald-600 rounded-lg h-10">
              Save
            </Button>
          </div>
          <p className="text-gray-300 text-sm mt-2">
            This bot is designed to help you with various tasks, provide information, and engage in meaningful conversations.
          </p>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="w-full max-w-4xl bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-lg overflow-hidden">
        {/* Chat Header */}
        <div className="bg-gray-800/50 border-b border-gray-700/50 p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-white font-medium">AI Assistant</h3>
              <p className="text-gray-400 text-xs">Always here to help</p>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-amber-400">Active</span>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="h-[500px] overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          <div className="flex flex-col space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${message.sender === 'user' ? 'bg-indigo-500/20' : 'bg-emerald-500/20'}`}>
                    {message.sender === 'user' ? <User className="w-4 h-4 text-indigo-400" /> : <Bot className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <div className={`px-4 py-2 rounded-lg ${message.sender === 'user' ? 'bg-indigo-500/10 text-indigo-100' : 'bg-gray-700/50 text-gray-100'}`}>
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              </div>
            ))}
            {loading && ( // Show loader when waiting for response
              <div className="flex justify-start">
                <div className="flex items-center space-x-2">
                  <Loader className="animate-spin w-5 h-5 text-gray-400" />
                  <p className="text-gray-400">Waiting for response...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-700/50 p-4 bg-gray-800/50">
          <form onSubmit={handleSendMessage}>
            <div className="flex space-x-2">
              <Input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow bg-gray-700/50 border-gray-600/50 rounded-lg text-sm text-gray-100 placeholder-gray-400"
              />
              <Button 
                type="submit" 
                className="bg-indigo-500 hover:bg-indigo-600 rounded-lg shadow-md"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}