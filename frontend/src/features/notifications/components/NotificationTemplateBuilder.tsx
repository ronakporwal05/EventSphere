'use client';

import React, { useState } from 'react';
import { NotificationTemplate } from '../types/notification.types';
import { Mail, Send, Sparkles, Plus, Save } from 'lucide-react';
import { toast } from 'sonner';

interface NotificationTemplateBuilderProps {
  templates: NotificationTemplate[];
  onDispatch: (data: { templateId: string; channel: string }) => void;
  isDispatching: boolean;
}

export const NotificationTemplateBuilder: React.FC<NotificationTemplateBuilderProps> = ({
  templates,
  onDispatch,
  isDispatching,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0]?.id || 'tmpl-1');

  const handleSave = () => {
    toast.success('Notification template saved!');
  };

  return (
    <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
        <div className="flex items-center space-x-2">
          <Mail className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-bold text-white">Broadcast Campaign & Template Designer</h3>
        </div>
        <button
          onClick={handleSave}
          className="px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-xl border border-neutral-700 inline-flex items-center space-x-1"
        >
          <Save className="w-3.5 h-3.5 text-indigo-400" />
          <span>Save Template</span>
        </button>
      </div>

      <div className="space-y-3">
        {templates.map((tmpl) => (
          <div
            key={tmpl.id}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              selectedTemplateId === tmpl.id
                ? 'bg-neutral-950 border-indigo-500 shadow-md'
                : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
            }`}
            onClick={() => setSelectedTemplateId(tmpl.id)}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-white">{tmpl.name}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {tmpl.channel}
              </span>
            </div>
            {tmpl.subject && <p className="text-xs text-indigo-300 font-medium mb-1">Subject: {tmpl.subject}</p>}
            <p className="text-xs text-neutral-400 font-mono whitespace-pre-wrap">{tmpl.body}</p>

            <div className="pt-2 flex justify-end">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDispatch({ templateId: tmpl.id, channel: tmpl.channel });
                }}
                disabled={isDispatching}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl inline-flex items-center space-x-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch Broadcast</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
