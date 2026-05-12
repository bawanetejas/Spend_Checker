import type { AuditResult } from "../lib/types";
const USD_TO_INR = import.meta.env.VITE_USD_TO_INR;
interface AuditResultsProps {
  result: AuditResult;
}

export function AuditResults({ result }: AuditResultsProps) {
  const { recommendations, totalMonthlySavings, totalAnnualSavings } = result;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Hero Savings */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-lg border-2 border-green-200">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Your Savings Potential
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600">Monthly Savings</p>
            <p className="text-4xl font-bold text-green-600">
              ₹{totalMonthlySavings.toLocaleString("en-IN")}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Annual Savings</p>
            <p className="text-4xl font-bold text-blue-600">
              ₹{totalAnnualSavings.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>
      {/* Recommendations */}
      <div>
        <h3 className="text-2xl font-semibold mb-4">Recommendations</h3>
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className={`p-6 rounded-lg border-l-4 ${
                rec.action === "optimal"
                  ? "bg-gray-50 border-gray-400"
                  : "bg-white border-green-500 shadow-sm"
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      rec.action === "optimal"
                        ? "bg-gray-200 text-gray-700"
                        : rec.action === "downgrade"
                          ? "bg-yellow-100 text-yellow-800"
                          : rec.action === "switch"
                            ? "bg-blue-100 text-blue-800"
                            : rec.action === "credits"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-green-100 text-green-800"
                    }`}
                  >
                    {rec.action.toUpperCase()}
                  </span>
                  <h4 className="text-lg font-semibold mt-2">
                    {rec.currentTool} - {rec.currentPlan}
                  </h4>
                </div>

                {rec.monthlySavings > 0 && (
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      ₹{rec.monthlySavings.toLocaleString("en-IN")}/mo
                    </p>
                    <p className="text-sm text-gray-600">
                      ₹{rec.annualSavings.toLocaleString("en-IN")}/year
                    </p>
                  </div>
                )}
              </div>

              <p className="text-gray-700 mb-3">{rec.reasoning}</p>

              {rec.targetPlan && (
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-600">
                    Current: ₹{rec.currentSpend.toLocaleString("en-IN")}/mo
                  </span>
                  <span className="text-gray-400">→</span>
                  <span className="text-green-600 font-semibold">
                    Recommended: {rec.targetVendor} {rec.targetPlan} - ₹
                    {rec.newSpend?.toLocaleString("en-IN")}/mo
                  </span>
                </div>
              )}

              <div className="mt-2">
                <span
                  className={`text-xs ${
                    rec.confidence === "high"
                      ? "text-green-600"
                      : rec.confidence === "medium"
                        ? "text-yellow-600"
                        : "text-gray-600"
                  }`}
                >
                  Confidence: {rec.confidence}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Credex CTA */}
      {totalMonthlySavings > 500 * USD_TO_INR && (
        <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-purple-900 mb-2">
            💰 Save Even More with Credex
          </h3>
          <p className="text-purple-800 mb-4">
            You're saving ₹{totalMonthlySavings.toLocaleString("en-IN")}/month.
            Credex can help you access these same tools at up to 25% additional
            discount through our credit marketplace.
          </p>
          <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            <a href="https://credex.rocks/" target="_blank">
              Book a Consultation
            </a>
          </button>
        </div>
      )}

      {/*  For low savings */}
      {totalMonthlySavings < 100 * USD_TO_INR && (
        <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6">
          <h3 className="font-semibold">You're Spending Well! ✅</h3>
          <p>Your AI tool setup is already optimized for your use case.</p>
          <button className="px-6 py-2 mt-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            <a href="https://credex.rocks/" target="_blank">
              Notify me of future optimizations
            </a>
          </button>
        </div>
      )}
    </div>
  );
}
