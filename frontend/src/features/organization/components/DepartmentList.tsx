'use client';

import React from 'react';
import { Department } from '../types/organization.types';
import { Layers, Users, Plus } from 'lucide-react';

interface DepartmentListProps {
  departments: Department[];
}

export const DepartmentList: React.FC<DepartmentListProps> = ({ departments }) => {
  return (
    <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-base font-bold text-white">Tenant Departments ({departments.length})</h2>
          <p className="text-xs text-neutral-400">Structured organizational units managing event workflows</p>
        </div>
        <button className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-xl inline-flex items-center space-x-1.5 border border-neutral-700">
          <Plus className="w-3.5 h-3.5" />
          <span>Add Department</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {departments.map((dept) => (
          <div key={dept.id} className="p-4 bg-neutral-950/60 border border-neutral-800 rounded-xl space-y-2 hover:border-neutral-700 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <h4 className="text-sm font-bold text-white">{dept.name}</h4>
              </div>
              <span className="inline-flex items-center text-[10px] font-semibold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                <Users className="w-3 h-3 mr-1" /> {dept.memberCount} Members
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">{dept.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
