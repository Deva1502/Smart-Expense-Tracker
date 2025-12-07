import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Sparkles, Loader2, ListChecks, AlertOctagon } from "lucide-react";

function AIInsights() {
  const { user } = useSelector((state) => state.auth);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const performAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        "https://smart-expense-tracker-c9xv.onrender.com/api/ai/analyze",
        {},
        config
      );
      setAnalysis(response.data);
    } catch (error) {
      console.error("AI Analysis failed", error);
      setError("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/30 p-6 rounded-2xl shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

      <div className="flex items-center justify-between mb-6 relative z-10">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles size={20} className="text-indigo-400" />
            AI Financial Advisor
          </h3>
        </div>
        <button
          onClick={performAnalysis}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-lg transition-all shadow-lg shadow-indigo-900/20 flex items-center gap-2"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            "Analyze Finances"
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/20 p-4 rounded-xl border border-red-500/30 mb-4 relative z-10">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {analysis && (
        <div className="space-y-6 animate-fadeIn">
          {/* ==== SPENDING OVERVIEW ==== */}
          {analysis.spending_analysis && (
            <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50">
              <h4 className="text-sm font-bold text-emerald-400 mb-2">
                Spending Overview
              </h4>
              <p className="text-gray-300 text-sm">
                {analysis.spending_analysis.overview}
              </p>
              <p className="text-gray-400 text-xs mt-2">
                Total Spent: ${analysis.spending_analysis.total_spent}
              </p>
            </div>
          )}

          {/* ==== CATEGORY BREAKDOWN ==== */}
          {analysis.spending_analysis?.category_breakdown && (
            <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50">
              <h4 className="text-sm font-bold text-indigo-400 mb-2">
                Category Breakdown
              </h4>

              <div className="space-y-2">
                {Object.entries(
                  analysis.spending_analysis.category_breakdown
                ).map(([category, info]) => (
                  <div
                    key={category}
                    className="p-3 bg-black/20 rounded text-gray-300 flex justify-between"
                  >
                    <span className="font-semibold text-indigo-300">
                      {category}
                    </span>
                    <span>
                      ${info?.total_spent ?? "N/A"} (
                      {info?.percentage ?? "N/A"}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==== PAYMENT METHODS ==== */}
          {analysis.spending_analysis?.payment_method_breakdown && (
            <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50">
              <h4 className="text-sm font-bold text-purple-400 mb-2">
                Payment Method Breakdown
              </h4>

              <div className="space-y-2">
                {Object.entries(
                  analysis.spending_analysis.payment_method_breakdown
                ).map(([method, total]) => (
                  <div
                    key={method}
                    className="p-3 bg-black/20 rounded text-gray-300 flex justify-between"
                  >
                    <span className="font-semibold text-purple-300">
                      {method}
                    </span>
                    <span>${total ?? "N/A"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==== ANOMALIES ==== */}
          {analysis.anomalies && (
            <div className="bg-red-900/20 p-4 rounded-xl border border-red-500/30">
              <h4 className="text-sm font-bold text-red-400 mb-2">
                Anomaly Insights
              </h4>
              <p className="text-gray-300 text-sm">
                {analysis.anomalies.description}
              </p>

              {/* Ensure anomalies and potential_anomalies are defined before accessing length */}
              {Array.isArray(analysis.anomalies.potential_anomalies) &&
                (analysis.anomalies.potential_anomalies.length === 0 ? (
                  <p className="text-gray-400 text-xs mt-2">
                    No anomalies detected.
                  </p>
                ) : (
                  <ul className="list-disc list-inside text-gray-300 text-sm mt-2">
                    {analysis.anomalies.potential_anomalies.map((a, idx) => (
                      <li key={idx}>{a}</li>
                    ))}
                  </ul>
                ))}
            </div>
          )}

          {/* ==== RECOMMENDATIONS ==== */}
          {analysis.recommendations &&
            analysis.recommendations.recommended_budgets && (
              <div className="bg-indigo-900/30 p-4 rounded-xl border border-indigo-500/30">
                <h4 className="text-sm font-bold text-indigo-400 mb-2">
                  Budget Recommendations
                </h4>

                <p className="text-gray-300 text-sm mb-3">
                  {analysis.recommendations.description}
                </p>

                <div className="space-y-3">
                  {Object.entries(
                    analysis.recommendations.recommended_budgets
                  ).map(([category, rec]) => (
                    <div
                      key={category}
                      className="p-3 bg-black/20 rounded text-gray-300"
                    >
                      <span className="font-semibold text-indigo-300">
                        {category}
                      </span>
                      <div className="text-sm mt-1">
                        Recommended:{" "}
                        <span className="text-gray-200">
                          {rec.recommended_amount}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {rec.rationale}
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-gray-400 text-xs mt-4">
                  {analysis.recommendations.note}
                </p>
              </div>
            )}

          {/* ==== ALERTS ==== */}
          {analysis.alerts && (
            <div className="bg-yellow-900/20 p-4 rounded-xl border border-yellow-600/30">
              <h4 className="text-sm font-bold text-yellow-400 mb-2">Alerts</h4>
              <p className="text-gray-300 text-sm">
                {analysis.alerts.description}
              </p>

              {/* Ensure alerts and alerts.alerts are defined before accessing length */}
              {Array.isArray(analysis.alerts.alerts) &&
                (analysis.alerts.alerts.length === 0 ? (
                  <p className="text-gray-400 text-xs mt-2">No alerts triggered.</p>
                ) : (
                  <ul className="list-disc list-inside text-gray-300 text-sm mt-2">
                    {analysis.alerts.alerts.map((alert, idx) => (
                      <li key={idx}>{alert}</li>
                    ))}
                  </ul>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
export default AIInsights;