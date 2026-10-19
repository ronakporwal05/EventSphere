'use client';

import React, { useState } from 'react';
import { CopilotMessage } from '../types/ai.types';
import { Bot, Send, User, Loader2, Sparkles } from 'lucide-react';

interface AiCopilotDrawerProps {
  history: CopilotMessage[];
  onSendMessage: (text: string) => void;
  isThinking: boolean;
}

export const AiCopilotDrawer: React.FC<AiCopilotDrawerProps> = ({
  history,
  onSendMessage,
  isThinking,
}) => {
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl space-y-4 flex flex-col h-[520px]">
      <div className="flex items-center space-x-2 pb-3 border-b border-neutral-800 shrink-0">
        <Bot className="w-5 h-5 text-indigo-400" />
        <div>
          <h3 className="text-base font-bold text-white">EventSphere AI Copilot</h3>
          <p className="text-xs text-neutral-400">Contextual multi-tenant AI assistant for organizers & staff</p>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1">
        {history.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-2.5 text-xs ${
              msg.sender === 'USER' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div
              className={`p-2 rounded-xl shrink-0 ${
                msg.sender === 'USER'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-neutral-950 border border-neutral-800 text-purple-400'
              }`}
            >
              {msg.sender === 'USER' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                msg.sender === 'USER'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-neutral-950/80 border border-neutral-800 text-neutral-200 rounded-tl-none'
              }`}
            >
              <p>{msg.text}</p>
              <span className="text-[9px] opacity-60 block mt-1">{msg.timestamp}</span>
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center space-x-2 text-xs text-neutral-400">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
            <span>Copilot is querying multi-tenant vector indexes...</span>
          </div>
        )}
      </div>

      {/* Input box */}
      <form onSubmit={handleSend} className="flex items-center space-x-2 pt-2 border-t border-neutral-800 shrink-0">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Copilot about event stats, attendee count, speaker schedule..."
          className="flex-1 px-3.5 py-2.5 bg-neutral-950/60 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          disabled={isThinking}
          className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
