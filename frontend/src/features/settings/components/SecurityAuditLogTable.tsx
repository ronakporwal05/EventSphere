'use client';

import React from 'react';
import { SecurityAuditLog } from '../types/settings.types';
import { ShieldCheck, AlertCircle, Lock } from 'lucide-react';

interface SecurityAuditLogTableProps {
  logs: SecurityAuditLog[];
}

export const SecurityAuditLogTable: React.FC<SecurityAuditLogTableProps> = ({ logs }) => {
  return (
    <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl space-y-4">
      <div className="flex items-center space-x-2 pb-3 border-b border-neutral-800">
        <Lock className="w-5 h-5 text-indigo-400" />
        <div>
          <h3 className="text-base font-bold text-white">Multi-Tenant Security Audit Inspector</h3>
          <p className="text-xs text-neutral-400">Immutable audit log of admin operations, IP addresses, and authentication events</p>
        </div>
      </div>

      <div className="overflow-x-auto border border-neutral-800 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-950 text-neutral-400 text-[11px] font-semibold uppercase tracking-wider border-b border-neutral-800">
              <th className="py-3 px-4">Actor</th>
              <th className="py-3 px-4">Action Event</th>
              <th className="py-3 px-4">IP Address</th>
              <th className="py-3 px-4 text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800 text-xs">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-neutral-800/40 transition-colors">
                <td className="py-3 px-4 font-semibold text-white">{log.actorName}</td>
                <td className="py-3 px-4 text-neutral-300">{log.action}</td>
                <td className="py-3 px-4 font-mono text-[11px] text-neutral-400">{log.ipAddress}</td>
                <td className="py-3 px-4 text-right font-mono text-[10px] text-neutral-500">{log.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
