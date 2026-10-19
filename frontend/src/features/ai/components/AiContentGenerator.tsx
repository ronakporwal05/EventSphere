'use client';

import React, { useState } from 'react';
import { Sparkles, Copy, Check, Loader2, Wand2 } from 'lucide-react';
import { AiGenerationRequest } from '../types/ai.types';
import { toast } from 'sonner';

interface AiContentGeneratorProps {
  onGenerate: (input: AiGenerationRequest) => Promise<{ generatedText: string }>;
  isGenerating: boolean;
}

export const AiContentGenerator: React.FC<AiContentGeneratorProps> = ({ onGenerate, isGenerating }) => {
  const [prompt, setPrompt] = useState('');
  const [contentType, setContentType] = useState<'EVENT_DESCRIPTION' | 'SOCIAL_POST' | 'PROMO_EMAIL' | 'SPEAKER_BIO'>('EVENT_DESCRIPTION');
  const [tone, setTone] = useState<'PROFESSIONAL' | 'CASUAL' | 'EXCITING' | 'FORMAL'>('EXCITING');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    const res = await onGenerate({ prompt, contentType, tone });
    setResult(res.generatedText);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl space-y-4">
      <div className="flex items-center space-x-2 pb-3 border-b border-neutral-800">
        <Wand2 className="w-5 h-5 text-indigo-400" />
        <div>
          <h3 className="text-base font-bold text-white">AI Content Studio & Copywriter</h3>
          <p className="text-xs text-neutral-400">Generate high-converting promotional copies, emails, and speaker bios</p>
        </div>
      </div>

      <form onSubmit={handleGenerate} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
              Target Output Format
            </label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value as any)}
              className="w-full px-3 py-2 bg-neutral-950/60 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="EVENT_DESCRIPTION">Event Overview Copy</option>
              <option value="SOCIAL_POST">Social Media Campaign (LinkedIn / X)</option>
              <option value="PROMO_EMAIL">VIP Email Invitation</option>
              <option value="SPEAKER_BIO">Keynote Speaker Biography</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
              Brand Tone & Emotion
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as any)}
              className="w-full px-3 py-2 bg-neutral-950/60 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="EXCITING">Exciting & High Energy</option>
              <option value="PROFESSIONAL">Professional & Corporate</option>
              <option value="CASUAL">Casual & Friendly</option>
              <option value="FORMAL">Formal & VIP Executive</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
            Prompt Context / Keywords
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            placeholder="e.g. AI summit event taking place in San Francisco focusing on multi-tenant Spring Boot architecture..."
            className="w-full px-3.5 py-2 bg-neutral-950/60 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isGenerating}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl inline-flex items-center space-x-2 shadow-lg shadow-indigo-600/20 transition-all"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Generate AI Copy</span>
          </button>
        </div>
      </form>

      {/* Generated Result Output */}
      {result && (
        <div className="mt-4 p-4 bg-neutral-950/80 border border-neutral-800 rounded-xl space-y-2 relative">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider">
              AI Generation Preview
            </span>
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[10px] font-semibold rounded-lg inline-flex items-center space-x-1"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <p className="text-xs text-neutral-200 leading-relaxed whitespace-pre-wrap font-sans">{result}</p>
        </div>
      )}
    </div>
  );
};
