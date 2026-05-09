
import React, { useState } from 'react';
import type { AuditInput, Vendor, UseCase, ToolInput } from '../lib/types';
import { getPlansForVendor } from '../utils/planOptions';

interface AuditFormProps {
  onSubmit: (data: AuditInput) => void;
}

export function AuditForm({ onSubmit }: AuditFormProps) {
  const [tools, setTools] = useState<ToolInput[]>([
    { vendor: 'cursor', plan: 'pro', monthlySpend: 0, seats: 1 }
  ]);
  const [useCase, setUseCase] = useState<UseCase>('coding');
  const [teamSize, setTeamSize] = useState(5);

  const addTool = () => {
    setTools([...tools, { vendor: 'chatgpt', plan: 'plus', monthlySpend: 0, seats: 1 }]);
  };

  const updateTool = (index: number, field: keyof ToolInput, value: any) => {
    const updated = [...tools];
    
    // When vendor changes, reset plan to first available option
    if (field === 'vendor') {
      const plans = getPlansForVendor(value);
      updated[index] = { 
        ...updated[index], 
        vendor: value,
        plan: plans[0]?.key || 'free'
      };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    
    setTools(updated);
  };

  const removeTool = (index: number) => {
    setTools(tools.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ tools, useCase, teamSize });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Primary Use Case</label>
        <select 
          value={useCase} 
          onChange={(e) => setUseCase(e.target.value as UseCase)}
          className="w-full p-2 border rounded"
        >
          <option value="coding">Coding</option>
          <option value="writing">Writing</option>
          <option value="data">Data Analysis</option>
          <option value="research">Research</option>
          <option value="mixed">Mixed</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Team Size</label>
        <input 
          type="number" 
          value={teamSize}
          onChange={(e) => setTeamSize(Number(e.target.value))}
          className="w-full p-2 border rounded"
          min="1"
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">AI Tools You're Using</h3>
          <button 
            type="button"
            onClick={addTool}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Add Tool
          </button>
        </div>

        {tools.map((tool, index) => {
          const availablePlans = getPlansForVendor(tool.vendor);
          
          return (
            <div key={index} className="p-4 border rounded space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Vendor</label>
                  <select 
                    value={tool.vendor}
                    onChange={(e) => updateTool(index, 'vendor', e.target.value as Vendor)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="chatgpt">ChatGPT</option>
                    <option value="claude">Claude</option>
                    <option value="cursor">Cursor</option>
                    <option value="github-copilot">GitHub Copilot</option>
                    <option value="gemini">Gemini</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-1">Plan</label>
                  <select
                    value={tool.plan}
                    onChange={(e) => updateTool(index, 'plan', e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    {availablePlans.map((plan) => (
                      <option key={plan.key} value={plan.key}>
                        {plan.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-1">Monthly Spend (₹)</label>
                  <input 
                    type="number"
                    value={tool.monthlySpend}
                    onChange={(e) => updateTool(index, 'monthlySpend', Number(e.target.value))}
                    className="w-full p-2 border rounded"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Number of Seats</label>
                  <input 
                    type="number"
                    value={tool.seats}
                    onChange={(e) => updateTool(index, 'seats', Number(e.target.value))}
                    className="w-full p-2 border rounded"
                    min="1"
                  />
                </div>
              </div>

              {tools.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTool(index)}
                  className="text-red-600 text-sm hover:underline"
                >
                  Remove Tool
                </button>
              )}
            </div>
          );
        })}
      </div>

      <button 
        type="submit"
        className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
      >
        Run Audit
      </button>
    </form>
  );
}