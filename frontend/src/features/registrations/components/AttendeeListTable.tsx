'use client';

import React, { useState } from 'react';
import { AttendeeRegistration } from '../types/registration.types';
import { Search, CheckCircle, Clock, XCircle, MoreVertical, Building } from 'lucide-react';

interface AttendeeListTableProps {
  registrations: AttendeeRegistration[];
}

export const AttendeeListTable: React.FC<AttendeeListTableProps> = ({ registrations }) => {
  const [search, setSearch] = useState('');

  const filtered = registrations.filter(
    (r) =>
      r.attendeeName.toLowerCase().includes(search.toLowerCase()) ||
      r.attendeeEmail.toLowerCase().includes(search.toLowerCase()) ||
      r.eventTitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
        <div>
          <h3 className="text-base font-bold text-white">Confirmed & Registered Attendees ({filtered.length})</h3>
          <p className="text-xs text-neutral-400">View ticket passes, organization affiliations, and registration timestamps</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search attendees..."
            className="w-full pl-9 pr-3 py-1.5 bg-neutral-950/60 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto border border-neutral-800 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-950 text-neutral-400 text-[11px] font-semibold uppercase tracking-wider border-b border-neutral-800">
              <th className="py-3 px-4">Attendee</th>
              <th className="py-3 px-4">Event</th>
              <th className="py-3 px-4">Ticket Type</th>
              <th className="py-3 px-4">Organization</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Registered</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800 text-xs">
            {filtered.map((reg) => (
              <tr key={reg.id} className="hover:bg-neutral-800/40 transition-colors">
                <td className="py-3 px-4">
                  <div>
                    <span className="font-semibold text-white block">{reg.attendeeName}</span>
                    <span className="text-[10px] text-neutral-400 block">{reg.attendeeEmail}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-neutral-300 truncate max-w-[200px]">{reg.eventTitle}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {reg.ticketType}
                  </span>
                </td>
                <td className="py-3 px-4 text-neutral-400">
                  {reg.company ? (
                    <span className="inline-flex items-center">
                      <Building className="w-3 h-3 mr-1 text-neutral-500" />
                      {reg.company}
                    </span>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="py-3 px-4">
                  {reg.status === 'CHECKED_IN' && (
                    <span className="inline-flex items-center text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <CheckCircle className="w-3 h-3 mr-1" /> Checked-In
                    </span>
                  )}
                  {reg.status === 'APPROVED' && (
                    <span className="inline-flex items-center text-[10px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                      <CheckCircle className="w-3 h-3 mr-1" /> Approved
                    </span>
                  )}
                  {reg.status === 'PENDING' && (
                    <span className="inline-flex items-center text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      <Clock className="w-3 h-3 mr-1" /> Pending
                    </span>
                  )}
                  {reg.status === 'WAITLISTED' && (
                    <span className="inline-flex items-center text-[10px] font-semibold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                      Waitlisted
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-right font-mono text-[10px] text-neutral-400">{reg.registeredAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
