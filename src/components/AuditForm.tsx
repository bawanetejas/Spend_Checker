import React from 'react';
import type { AuditInput, Vendor, UseCase, ToolInput } from '../lib/types';
import { getPlansForVendor } from '../utils/planOptions';
import { useFormPersistence } from '../hooks/useFormPersistence';

interface AuditFormProps {
  onSubmit: (data: AuditInput) => void;
}

export function AuditForm({ onSubmit }: AuditFormProps) {
  const [tools, setTools] = useFormPersistence<ToolInput[]>('audit-tools', [
    { vendor: 'cursor', plan: 'pro', monthlySpend: 0, seats: 1 }
  ]);
  const [useCase, setUseCase] = useFormPersistence<UseCase>('audit-usecase', 'coding');
  const [teamSize, setTeamSize] = useFormPersistence<number>('audit-teamsize', 5);

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
    <form 
      onSubmit={handleSubmit} 
      className="max-w-4xl mx-auto p-6 space-y-6"
      aria-label="AI spend audit form"
    >
      <div>
        <label htmlFor="use-case-select" className="block text-sm font-medium mb-2">
          Primary Use Case
        </label>
        <select 
          id="use-case-select"
          name="useCase"
          value={useCase} 
          onChange={(e) => setUseCase(e.target.value as UseCase)}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-required="true"
        >
          <option value="coding">Coding</option>
          <option value="writing">Writing</option>
          <option value="data">Data Analysis</option>
          <option value="research">Research</option>
          <option value="mixed">Mixed</option>
        </select>
      </div>

      <div>
        <label htmlFor="team-size-input" className="block text-sm font-medium mb-2">
          Team Size
        </label>
        <input 
          id="team-size-input"
          name="teamSize"
          type="number" 
          value={teamSize}
          onChange={(e) => setTeamSize(Number(e.target.value))}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          min="1"
          aria-required="true"
          aria-describedby="team-size-help"
        />
        <span id="team-size-help" className="text-xs text-gray-500 mt-1 block">
          Enter the number of team members using AI tools
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">AI Tools You're Using</h2>
          <button 
            type="button"
            onClick={addTool}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            aria-label="Add another AI tool"
          >
            + Add Tool
          </button>
        </div>

        {tools.map((tool, index) => {
          const availablePlans = getPlansForVendor(tool.vendor);
          
          return (
            <fieldset 
              key={index} 
              className="p-4 border rounded space-y-3"
              aria-label={`AI Tool ${index + 1}`}
            >
              <legend className="sr-only">Tool {index + 1} details</legend>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor={`vendor-${index}`} className="block text-sm font-medium mb-1">
                    Vendor
                  </label>
                  <select 
                    id={`vendor-${index}`}
                    name={`vendor-${index}`}
                    value={tool.vendor}
                    onChange={(e) => updateTool(index, 'vendor', e.target.value as Vendor)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-required="true"
                  >
                    <option value="chatgpt">ChatGPT</option>
                    <option value="claude">Claude</option>
                    <option value="cursor">Cursor</option>
                    <option value="github-copilot">GitHub Copilot</option>
                    <option value="gemini">Gemini</option>
                  </select>
                </div>

                <div>
                  <label htmlFor={`plan-${index}`} className="block text-sm font-medium mb-1">
                    Plan
                  </label>
                  <select
                    id={`plan-${index}`}
                    name={`plan-${index}`}
                    value={tool.plan}
                    onChange={(e) => updateTool(index, 'plan', e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-required="true"
                  >
                    {availablePlans.map((plan) => (
                      <option key={plan.key} value={plan.key}>
                        {plan.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor={`spend-${index}`} className="block text-sm font-medium mb-1">
                    Monthly Spend (₹)
                  </label>
                  <input 
                    id={`spend-${index}`}
                    name={`monthlySpend-${index}`}
                    type="number"
                    value={tool.monthlySpend}
                    onChange={(e) => updateTool(index, 'monthlySpend', Number(e.target.value))}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    aria-required="true"
                    aria-describedby={`spend-help-${index}`}
                  />
                  <span id={`spend-help-${index}`} className="sr-only">
                    Enter monthly spending in Indian Rupees
                  </span>
                </div>

                <div>
                  <label htmlFor={`seats-${index}`} className="block text-sm font-medium mb-1">
                    Number of Seats
                  </label>
                  <input 
                    id={`seats-${index}`}
                    name={`seats-${index}`}
                    type="number"
                    value={tool.seats}
                    onChange={(e) => updateTool(index, 'seats', Number(e.target.value))}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    aria-required="true"
                    aria-describedby={`seats-help-${index}`}
                  />
                  <span id={`seats-help-${index}`} className="sr-only">
                    Number of user licenses or seats
                  </span>
                </div>
              </div>

              {tools.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTool(index)}
                  className="text-red-600 text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded px-2 py-1"
                  aria-label={`Remove tool ${index + 1}`}
                >
                  Remove Tool
                </button>
              )}
            </fieldset>
          );
        })}
      </div>

      <button 
        type="submit"
        className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
        aria-label="Submit audit form and run analysis"
      >
        Run Audit
      </button>
    </form>
  );
}