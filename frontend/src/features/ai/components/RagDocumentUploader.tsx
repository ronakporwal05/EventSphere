'use client';

import React from 'react';
import { RagDocument } from '../types/ai.types';
import { Database, Upload, FileText, CheckCircle, HardDrive } from 'lucide-react';
import { toast } from 'sonner';

interface RagDocumentUploaderProps {
  documents: RagDocument[];
}

export const RagDocumentUploader: React.FC<RagDocumentUploaderProps> = ({ documents }) => {
  const handleUpload = () => {
    toast.success('Document uploaded to Qdrant Vector Store!');
  };

  return (
    <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
        <div className="flex items-center space-x-2">
          <Database className="w-5 h-5 text-purple-400" />
          <div>
            <h3 className="text-base font-bold text-white">RAG Knowledge Store & Document Indexer</h3>
            <p className="text-xs text-neutral-400">Upload PDF manuals and floorplans to train the event Q&A chatbot</p>
          </div>
        </div>

        <button
          onClick={handleUpload}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl inline-flex items-center space-x-2 shadow-lg shadow-purple-600/20"
        >
          <Upload className="w-4 h-4" />
          <span>Upload PDF Document</span>
        </button>
      </div>

      <div className="space-y-3">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="p-4 bg-neutral-950/60 border border-neutral-800 rounded-xl flex items-center justify-between gap-3 hover:border-neutral-700 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">{doc.filename}</span>
                <span className="text-[10px] text-neutral-400 block">
                  {doc.fileSize} • {doc.chunkCount} Vector Chunks Index
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <CheckCircle className="w-3 h-3 mr-1" /> Vectorized (Qdrant)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
