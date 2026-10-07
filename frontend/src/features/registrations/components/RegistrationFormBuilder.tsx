'use client';

import React, { useState } from 'react';
import { CustomFormField } from '../types/registration.types';
import { FormInput, Plus, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';

export const RegistrationFormBuilder: React.FC = () => {
  const [fields, setFields] = useState<CustomFormField[]>([
    { id: 'f-1', label: 'Dietary Preferences', type: 'SELECT', required: false, options: ['Standard', 'Vegan', 'Halal', 'Kosher', 'Gluten-Free'] },
    { id: 'f-2', label: 'T-Shirt Size', type: 'SELECT', required: true, options: ['S', 'M', 'L', 'XL', 'XXL'] },
    { id: 'f-3', label: 'Emergency Contact Phone', type: 'TEXT', required: true },
  ]);

  const addField = () => {
    const newField: CustomFormField = {
      id: `f-${Date.now()}`,
      label: 'New Custom Question',
      type: 'TEXT',
      required: false,
    };
    setFields([...fields, newField]);
  };

  const removeField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  const saveForm = () => {
    toast.success('Registration checkout form schema saved!');
  };

  return (
    <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
        <div className="flex items-center space-x-2">
          <FormInput className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="text-base font-bold text-white">Custom Checkout Form Builder</h3>
            <p className="text-xs text-neutral-400">Configure mandatory attendee questionnaires and dietary needs</p>
          </div>
        </div>

        <button
          onClick={saveForm}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl inline-flex items-center space-x-1.5"
        >
          <Save className="w-4 h-4" />
          <span>Save Form Schema</span>
        </button>
      </div>

      <div className="space-y-3">
        {fields.map((field) => (
          <div key={field.id} className="p-4 bg-neutral-950/60 border border-neutral-800 rounded-xl flex items-center justify-between gap-3">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                value={field.label}
                onChange={(e) => {
                  const val = e.target.value;
                  setFields(fields.map((f) => (f.id === field.id ? { ...f, label: val } : f)));
                }}
                className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white"
              />

              <select
                value={field.type}
                onChange={(e) => {
                  const val = e.target.value as any;
                  setFields(fields.map((f) => (f.id === field.id ? { ...f, type: val } : f)));
                }}
                className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white"
              >
                <option value="TEXT">Short Text</option>
                <option value="SELECT">Dropdown Select</option>
                <option value="CHECKBOX">Checkbox Agreement</option>
              </select>

              <label className="flex items-center space-x-2 text-xs text-neutral-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setFields(fields.map((f) => (f.id === field.id ? { ...f, required: checked } : f)));
                  }}
                  className="w-4 h-4 rounded bg-neutral-900 border-neutral-700 text-indigo-600"
                />
                <span>Required Field</span>
              </label>
            </div>

            <button
              onClick={() => removeField(field.id)}
              className="p-1.5 text-neutral-500 hover:text-rose-400 rounded-lg"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addField}
        className="w-full py-2.5 bg-neutral-950 hover:bg-neutral-800 border border-dashed border-neutral-800 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white flex items-center justify-center space-x-1.5 transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span>Add Form Field</span>
      </button>
    </div>
  );
};
