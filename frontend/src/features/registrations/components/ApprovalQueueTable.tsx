'use client';

import React from 'react';
import { AttendeeRegistration } from '../types/registration.types';
import { Check, X, Clock, ShieldAlert } from 'lucide-react';

interface ApprovalQueueTableProps {
  pendingList: AttendeeRegistration[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const ApprovalQueueTable: React.FC<ApprovalQueueTableProps> = ({
  pendingList,
  onApprove,
  onReject,
}) => {
  return (
    <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl space-y-4">
      <div className="flex items-center space-x-3 pb-3 border-b border-neutral-800">
        <Clock className="w-5 h-5 text-amber-400" />
        <div>
          <h3 className="text-base font-bold text-white">Pending Approval Queue ({pendingList.length})</h3>
          <p className="text-xs text-neutral-400">Review VIP & restricted ticket applications before granting admission badges</p>
        </div>
      </div>

      {pendingList.length === 0 ? (
        <div className="p-8 text-center bg-neutral-950/40 rounded-xl border border-neutral-800 text-xs text-neutral-500">
          No pending registration requests in approval queue.
        </div>
      ) : (
        <div className="space-y-3">
          {pendingList.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-neutral-950/60 border border-neutral-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-white">{item.attendeeName}</span>
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded">
                    {item.ticketType}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-0.5">{item.attendeeEmail} • {item.company || 'Independent Delegate'}</p>
                <span className="text-[10px] text-neutral-500 block mt-1">Requested for: {item.eventTitle}</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onReject(item.id)}
                  className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold rounded-xl border border-rose-500/20 inline-flex items-center space-x-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
                <button
                  onClick={() => onApprove(item.id)}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl inline-flex items-center space-x-1 shadow-lg shadow-emerald-600/20"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Approve Registration</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
