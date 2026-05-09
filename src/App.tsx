// src/App.tsx
import React, { useState } from 'react';
import { AuditForm } from './components/AuditForm';
import { AuditResults } from './components/AuditResults';
import type { AuditInput, AuditResult } from './lib/types';
import { runAudit, generateAuditId } from './lib/audit-engine';

function App() {
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);

  const handleAuditSubmit = (input: AuditInput) => {
    const result = runAudit(input);
    const fullResult: AuditResult = {
      ...result,
      id: generateAuditId(),
      createdAt: new Date().toISOString(),
    };
    setAuditResult(fullResult);
  };

  const handleReset = () => {
    setAuditResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">AI Spend Audit</h1>
          <p className="text-gray-600">Find out how much you're overspending on AI tools</p>
        </div>
      </header>

      <main className="py-12">
        {!auditResult ? (
          <AuditForm onSubmit={handleAuditSubmit} />
        ) : (
          <>
            <AuditResults result={auditResult} />
            <div className="text-center mt-8">
              <button 
                onClick={handleReset}
                className="px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Run Another Audit
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;