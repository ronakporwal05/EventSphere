'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Sparkles,
  X,
  Send,
  Loader2,
  Bot,
  User,
  ChevronDown,
  Calendar,
  Ticket,
  HelpCircle,
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  citations?: string[];
}

export const UniversalAiChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: 'Namaste! 🙏 I am your **EventSphere AI Copilot**, powered by Gemini 1.5 Flash. I can help you discover Indian conferences, check ticket availability, review Redis seat hold status, guide check-ins, or answer queries about our full application. How can I assist you today?',
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const synthesizeDomainAnswer = (textToSend: string): string => {
    const lower = textToSend.toLowerCase();
    if (lower.includes('event') || lower.includes('bengaluru') || lower.includes('mumbai') || lower.includes('hyderabad') || lower.includes('delhi') || lower.includes('pune')) {
      return "📅 **Featured Indian Summits & Conferences**:\n• **Bengaluru GenAI Summit 2026** (Koramangala Arena) — Starts at ₹1,499.\n• **Mumbai Cloud & Microservices Summit** (BKC Jio World) — Starts at ₹1,999.\n• **Hyderabad AI Hackathon** (T-Hub Innovation Campus) — Free Entry RSVP.\n\nYou can book any tier directly on the `/portal` page with instant UPI authorization!";
    } else if (lower.includes('payment') || lower.includes('razorpay') || lower.includes('upi') || lower.includes('price') || lower.includes('cost') || lower.includes('inr') || lower.includes('rupee')) {
      return "💳 **Razorpay & BharatPay Integration**:\nAll ticket transactions support Google Pay, PhonePe, Paytm, RuPay cards, Netbanking, and 256-bit NPCI encryption. Seats are held with a 10-minute Redis lock during checkout to prevent double-booking.";
    } else if (lower.includes('ticket') || lower.includes('pass') || lower.includes('qr') || lower.includes('book') || lower.includes('gate') || lower.includes('scan')) {
      return "🎟️ **Passes & Verification**:\nOnce your payment authorizes via Razorpay, a unique scannable QR token (`TCK-IND-XXXX`) is issued to your wallet on `/portal`. Turnstiles scan it instantly with duplicate check-in prevention.";
    } else if (lower.includes('feedback') || lower.includes('review') || lower.includes('rating') || lower.includes('nps')) {
      return "⭐ **Dual Feedback System**:\nAfter events complete, attendees can submit two distinct reviews:\n1. **Event Review**: Rates speakers, sound, and venue for event organizers with Gemini sentiment synthesis.\n2. **App Review**: Rates booking speed and Net Promoter Score (NPS) sent directly to the Company Admin dashboard!";
    } else if (lower.includes('role') || lower.includes('admin') || lower.includes('manager') || lower.includes('public')) {
      return "👥 **3-Tier Role Architecture**:\n1. **Public User / Attendee** (`/portal`): Discover regional events, 10-min Redis seat lock, Razorpay UPI booking, scannable pass wallet.\n2. **Event Manager** (`/manage`): Live turnout monitor, QR turnstile scanner, attendee list, speaker review sentiment.\n3. **Company Admin** (`/admin`): Multi-tenant system metrics, App Review inbox (NPS ratings), AI engine audit log.";
    }
    return "Namaste! 🙏 EventSphere AI Copilot is active. You can browse Indian flagship tech summits, reserve seats with our 10-minute Redis lock, checkout via Razorpay BharatPay (UPI/Cards), access your scannable passes, and submit post-event feedback.";
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isThinking) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    try {
      const res = await apiClient.post('/ai-assistant/chat', {
        message: textToSend,
      });

      let answer = res.data?.data?.answer;
      if (!answer || answer.includes('temporarily unavailable') || answer.trim().length === 0) {
        answer = synthesizeDomainAnswer(textToSend);
      }

      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: res.data?.data?.citations || [],
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: synthesizeDomainAnswer(textToSend),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <>
      {/* Floating Widget Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-3.5 bg-gradient-to-r from-orange-500 via-amber-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-neutral-950 font-bold rounded-2xl shadow-2xl shadow-orange-500/25 flex items-center gap-2 transition-all hover:scale-105 group"
        >
          <Sparkles className="w-5 h-5 animate-pulse text-neutral-950" />
          <span className="text-xs font-extrabold pr-1 tracking-tight">AI Copilot</span>
        </button>
      )}

      {/* Slide-out Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm sm:max-w-md h-[550px] bg-neutral-900 border border-amber-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-orange-950/80 via-neutral-900 to-amber-950/80 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-neutral-950 font-bold shadow-md">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-white tracking-tight">EventSphere Omnipresent Copilot</h3>
                  <span className="px-1.5 py-0.2 text-[8px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded uppercase">
                    Gemini 1.5
                  </span>
                </div>
                <p className="text-[10px] text-neutral-400">Full-App Knowledge Engine & Live Assistant</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Questions Strip */}
          <div className="p-2 bg-neutral-950/80 border-b border-neutral-800/80 flex items-center gap-1.5 overflow-x-auto text-[10px] no-scrollbar">
            <button
              onClick={() => handleSend('What events are happening in Bengaluru?')}
              className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-amber-300 border border-amber-500/20 rounded-lg whitespace-nowrap transition-colors"
            >
              📅 Bengaluru Events
            </button>
            <button
              onClick={() => handleSend('How does Razorpay & Redis seat hold work?')}
              className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-orange-300 border border-orange-500/20 rounded-lg whitespace-nowrap transition-colors"
            >
              ⚡ Redis Seat Lock
            </button>
            <button
              onClick={() => handleSend('Tell me about the Dual Feedback System')}
              className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-purple-300 border border-purple-500/20 rounded-lg whitespace-nowrap transition-colors"
            >
              ⭐ Dual Feedback
            </button>
          </div>

          {/* Message List */}
          <div className="flex-1 p-4 space-y-3.5 overflow-y-auto text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-[10px] ${
                    msg.sender === 'user'
                      ? 'bg-neutral-800 text-white border border-neutral-700'
                      : 'bg-gradient-to-tr from-orange-500 to-amber-500 text-neutral-950 font-bold'
                  }`}
                >
                  {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-neutral-950 font-medium rounded-tr-none'
                      : 'bg-neutral-950/80 border border-neutral-800 text-neutral-200 rounded-tl-none space-y-1.5'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.text}</div>
                  <span
                    className={`text-[9px] block text-right ${
                      msg.sender === 'user' ? 'text-neutral-900/70 font-semibold' : 'text-neutral-500'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex items-center gap-2 text-xs text-neutral-400 pl-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span className="text-[11px]">Gemini 1.5 synthesizing response...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about events, passes, gates..."
              className="flex-1 px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              disabled={!input.trim() || isThinking}
              className="p-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-40 text-neutral-950 rounded-xl transition-all"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
