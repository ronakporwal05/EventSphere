'use client';

import React, { useState } from 'react';
import { Volunteer, VolunteerShiftStatus } from '../types/volunteer.types';
import { Users, Search, MapPin, Clock, Scan, ShieldAlert } from 'lucide-react';

interface VolunteerRosterTableProps {
  volunteers: Volunteer[];
  onUpdateStatus: (data: { id: string; status: VolunteerShiftStatus }) => void;
}

export const VolunteerRosterTable: React.FC<VolunteerRosterTableProps> = ({
  volunteers,
  onUpdateStatus,
}) => {
  const [search, setSearch] = useState('');

  const filtered = volunteers.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.assignedZone.toLowerCase().includes(search.toLowerCase()) ||
      v.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
        <div>
          <h3 className="text-base font-bold text-white">Active Volunteer Staff Directory ({volunteers.length})</h3>
          <p className="text-xs text-neutral-400">Manage turnstile staff shift status, zone allocations, and check-in counts</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search volunteer, zone..."
            className="w-full pl-9 pr-3 py-1.5 bg-neutral-950/60 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto border border-neutral-800 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-950 text-neutral-400 text-[11px] font-semibold uppercase tracking-wider border-b border-neutral-800">
              <th className="py-3 px-4">Volunteer</th>
              <th className="py-3 px-4">Assigned Gate / Zone</th>
              <th className="py-3 px-4">Shift Hours</th>
              <th className="py-3 px-4">Check-ins Handled</th>
              <th className="py-3 px-4 text-right">Shift Duty Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800 text-xs">
            {filtered.map((vol) => (
              <tr key={vol.id} className="hover:bg-neutral-800/40 transition-colors">
                <td className="py-3 px-4">
                  <div>
                    <span className="font-semibold text-white block">{vol.name}</span>
                    <span className="text-[10px] text-neutral-400 block">{vol.email} • {vol.phone}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-neutral-300">
                  <span className="inline-flex items-center text-xs">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-indigo-400" />
                    {vol.assignedZone}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-[11px] text-neutral-400">{vol.shiftTime}</td>
                <td className="py-3 px-4 font-bold text-emerald-400 font-mono">{vol.scansProcessed.toLocaleString()}</td>
                <td className="py-3 px-4 text-right">
                  <select
                    value={vol.status}
                    onChange={(e) => onUpdateStatus({ id: vol.id, status: e.target.value as VolunteerShiftStatus })}
                    className={`px-3 py-1 rounded-xl text-xs font-bold focus:outline-none border ${
                      vol.status === 'ON_SHIFT'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : vol.status === 'ON_BREAK'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                    }`}
                  >
                    <option value="ON_SHIFT">🟢 ON SHIFT</option>
                    <option value="ON_BREAK">🟡 ON BREAK</option>
                    <option value="OFF_SHIFT">🔴 OFF SHIFT</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
