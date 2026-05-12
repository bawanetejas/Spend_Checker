import { useState, useEffect, lazy, Suspense } from 'react';
import { AuditForm } from './components/AuditForm';
import type { AuditInput, AuditResult } from './lib/types';
import { runAudit, generateAuditId } from './lib/audit-engine';
import { saveAuditResult, getAuditResult } from './lib/api';

// Lazy load components that aren't needed immediately
const AuditResults = lazy(() => import('./components/AuditResults').then(module => ({ default: module.AuditResults })));
const LeadCaptureForm = lazy(() => import('./components/LeadCaptureForm').then(module => ({ default: module.LeadCaptureForm })));

// Loading spinner component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div 
        className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
      <p className="text-gray-600" aria-live="polite">Analyzing your AI spend...</p>
    </div>
  </div>
);

function App() {
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // Check URL for shared audit ID
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const auditId = urlParams.get('audit');
    
    if (auditId) {
      loadSharedAudit(auditId);
    }
  }, []);

  const loadSharedAudit = async (auditId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getAuditResult(auditId);
      if (result) {
        setAuditResult(result);
      } else {
        setError('Audit not found');
      }
    } catch (err) {
      setError('Failed to load audit');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAuditSubmit = async (input: AuditInput) => {
    setLoading(true);
    setError(null);

    try {
      // Run audit logic
      const result = runAudit(input);
      const fullResult: AuditResult = {
        ...result,
        id: generateAuditId(),
        createdAt: new Date().toISOString(),
      };

      // Save to Supabase
      await saveAuditResult(fullResult);

      // Update URL with audit ID
      window.history.pushState({}, '', `?audit=${fullResult.id}`);

      setAuditResult(fullResult);
    } catch (err) {
      setError('Failed to generate audit. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAuditResult(null);
    setError(null);
    setCopySuccess(false);
    window.history.pushState({}, '', '/');
  };

  const handleCopyLink = async () => {
    if (!shareUrl) return;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareUrl = auditResult 
    ? `${window.location.origin}?audit=${auditResult.id}`
    : '';

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">AI Spend Audit</h1>
          <p className="text-gray-600 mt-1">Find out how much you're overspending on AI tools</p>
        </div>
      </header>

      <main className="py-12">
        {error && (
          <div className="max-w-4xl mx-auto mb-6 px-6">
            <div 
              className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded"
              role="alert"
              aria-live="assertive"
            >
              <span className="font-medium">Error: </span>
              {error}
            </div>
          </div>
        )}

        {!auditResult ? (
          <AuditForm onSubmit={handleAuditSubmit} />
        ) : (
          <Suspense fallback={<LoadingSpinner />}>
            <AuditResults result={auditResult} />
            
            <div className="max-w-4xl mx-auto px-6 mt-8">
              <LeadCaptureForm auditId={auditResult.id} />
            </div>

            <div className="max-w-4xl mx-auto px-6 mt-8 space-y-4">
              {/* Share Section */}
              <section 
                className="bg-white p-6 rounded-lg border"
                aria-labelledby="share-heading"
              >
                <h2 id="share-heading" className="font-semibold mb-3 text-lg">
                  Share This Audit
                </h2>
                <div className="flex gap-2">
                  <label htmlFor="share-url" className="sr-only">
                    Shareable audit link
                  </label>
                  <input 
                    id="share-url"
                    type="text" 
                    value={shareUrl}
                    readOnly
                    aria-label="Shareable audit link"
                    className="flex-1 p-2 border rounded bg-gray-50 text-sm"
                  />
                  <button 
                    onClick={handleCopyLink}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    aria-label="Copy link to clipboard"
                  >
                    {copySuccess ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>
                {copySuccess && (
                  <p className="text-sm text-green-600 mt-2" role="status" aria-live="polite">
                    Link copied to clipboard!
                  </p>
                )}
              </section>

              <div className="text-center">
                <button 
                  onClick={handleReset}
                  className="px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors"
                  aria-label="Start a new audit"
                >
                  Run Another Audit
                </button>
              </div>
            </div>
          </Suspense>
        )}
      </main>
    </div>
  );
}

export default App;