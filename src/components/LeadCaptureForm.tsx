
import React, { useState } from 'react';
import  { saveLead, hasSubmittedLead } from '../lib/api';

interface LeadCaptureFormProps {
  auditId: string;
}

export function LeadCaptureForm({ auditId }: LeadCaptureFormProps) {
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [teamSize, setTeamSize] = useState<number | ''>('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Check if already submitted
      const alreadySubmitted = await hasSubmittedLead(auditId, email);
      if (alreadySubmitted) {
        setError('This email has already been submitted for this audit');
        setLoading(false);
        return;
      }

      await saveLead({
        auditId,
        email,
        companyName: companyName || undefined,
        role: role || undefined,
        teamSize: teamSize ? Number(teamSize) : undefined,
      });

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="text-green-600 text-5xl mb-3">✓</div>
        <h3 className="text-xl font-semibold text-green-900 mb-2">
          Thanks! Check your email
        </h3>
        <p className="text-green-800">
          We've sent you a copy of this audit. Our team will reach out if we can help you save more.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-2">Get Your Full Report</h3>
      <p className="text-gray-600 mb-4">
        Enter your email to receive a detailed breakdown and get notified about future optimization opportunities.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded"
            placeholder="you@company.com"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Company Name</label>
            <input 
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Optional"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <input 
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="e.g., CTO, Engineer"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Team Size</label>
          <input 
            type="number"
            value={teamSize}
            onChange={(e) => setTeamSize(e.target.value ? Number(e.target.value) : '')}
            className="w-full p-2 border rounded"
            placeholder="Optional"
            min="1"
          />
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Get My Report'}
        </button>

        <p className="text-xs text-gray-500 text-center">
          We'll only contact you about relevant savings opportunities. No spam.
        </p>
      </form>
    </div>
  );
}