import React from 'react';
import { RegressionMetrics } from '../utils/linearRegression';
import { ArrowRight, CheckCircle2, TrendingUp, DollarSign, Home, Sliders } from 'lucide-react';

interface ModelOverviewProps {
  metrics: RegressionMetrics;
  onNavigate: (tab: string) => void;
}

export const ModelOverview: React.FC<ModelOverviewProps> = ({ metrics, onNavigate }) => {
  const { coefficients, intercept, testR2, trainR2, testRmse, trainRmse, testMae, sampleCount, trainCount, testCount } = metrics;

  return (
    <div className="space-y-8">
      {/* Editorial Title & Context */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
          <span>Prodigy InfoTech ML Internship</span>
          <span aria-hidden="true">·</span>
          <span>Task 01</span>
          <span aria-hidden="true">·</span>
          <span>Ames Housing Linear Regression</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Linear Regression House Price Prediction
        </h1>
        <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-3xl leading-relaxed">
          Predicting residential sale prices from Kaggle's Ames Housing dataset using above-grade living square footage (<code className="text-indigo-300 font-mono text-xs">GrLivArea</code>), bedroom count (<code className="text-indigo-300 font-mono text-xs">BedroomAbvGr</code>), and engineered total bathrooms (<code className="text-indigo-300 font-mono text-xs">FullBath + 0.5 * HalfBath</code>).
        </p>
      </div>

      {/* Key Metric Scorecards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Testing R² Score</div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-emerald-400 tabular-nums">
            {(testR2 * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-slate-500 mt-1 tabular-nums">
            Train R²: {(trainR2 * 100).toFixed(1)}% (variance explained)
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Testing RMSE</div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-indigo-400 tabular-nums">
            ${Math.round(testRmse).toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1 tabular-nums">
            Train RMSE: ${Math.round(trainRmse).toLocaleString()}
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Testing MAE</div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-slate-200 tabular-nums">
            ${Math.round(testMae).toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">Average absolute prediction deviation</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Split Ratio</div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-slate-200 tabular-nums">
            80 / 20
          </div>
          <div className="text-xs text-slate-500 mt-1 tabular-nums">
            {trainCount} train · {testCount} test samples
          </div>
        </div>
      </div>

      {/* Regression Equation Box */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-white">01. Fitted Ordinary Least Squares Regression Equation</h2>
          <span className="text-xs text-slate-400 font-mono">OLS: β = (XᵀX)⁻¹Xᵀy</span>
        </div>
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80 font-mono text-xs sm:text-sm text-indigo-200 overflow-x-auto leading-relaxed tabular-nums">
          <div className="text-slate-400 text-xs mb-1"># General Formulation:</div>
          <div className="mb-3 text-slate-300">
            SalePrice = β₀ + β₁·(GrLivArea) + β₂·(BedroomAbvGr) + β₃·(TotalBath)
          </div>
          <div className="text-slate-400 text-xs mb-1"># Fitted Model on Current Data:</div>
          <div className="text-white font-semibold">
            SalePrice = ${Math.round(intercept).toLocaleString()}{' '}
            {coefficients.GrLivArea >= 0 ? '+' : '-'} ${Math.abs(coefficients.GrLivArea).toFixed(2)} × (GrLivArea){' '}
            {coefficients.BedroomAbvGr >= 0 ? '+' : '-'} ${Math.abs(coefficients.BedroomAbvGr).toFixed(2)} × (BedroomAbvGr){' '}
            {coefficients.TotalBath >= 0 ? '+' : '-'} ${Math.abs(coefficients.TotalBath).toFixed(2)} × (TotalBath)
          </div>
        </div>
        <div className="mt-3 text-xs text-slate-400 flex items-center gap-1.5">
          <span>Engineered feature:</span>
          <code className="text-indigo-300 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 font-mono">
            TotalBath = FullBath + 0.5 × HalfBath
          </code>
        </div>
      </div>

      {/* Coefficients and Real-World Interpretation Table */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6">
        <h2 className="text-base font-semibold text-white mb-2">02. Feature Coefficients & Statistical Interpretation</h2>
        <p className="text-xs text-slate-400 mb-4">
          Each partial regression coefficient indicates the expected change in sale price when increasing that feature by 1 unit, holding all other features constant.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-xs text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Feature Name</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3 text-right">Coefficient (β)</th>
                <th className="py-2.5 px-3">Sign</th>
                <th className="py-2.5 px-3">Real Estate Interpretation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              <tr className="hover:bg-slate-800/20 transition-colors">
                <td className="py-3 px-3 font-mono text-indigo-300 font-medium">Intercept (β₀)</td>
                <td className="py-3 px-3 text-xs text-slate-400">Baseline Constant</td>
                <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-200">
                  ${Math.round(intercept).toLocaleString()}
                </td>
                <td className="py-3 px-3">
                  <span className="text-xs font-mono text-slate-300">+</span>
                </td>
                <td className="py-3 px-3 text-xs text-slate-300 leading-relaxed">
                  Theoretical base value anchoring the regression hyperplane when all features equal zero.
                </td>
              </tr>

              <tr className="hover:bg-slate-800/20 transition-colors">
                <td className="py-3 px-3 font-mono text-indigo-300 font-medium">GrLivArea (β₁)</td>
                <td className="py-3 px-3 text-xs text-slate-400">Square Footage (sq ft)</td>
                <td className="py-3 px-3 text-right font-mono tabular-nums text-emerald-400 font-semibold">
                  +${coefficients.GrLivArea.toFixed(2)}
                </td>
                <td className="py-3 px-3">
                  <span className="text-xs font-mono text-emerald-400">Positive</span>
                </td>
                <td className="py-3 px-3 text-xs text-slate-300 leading-relaxed">
                  Every 1 sq ft increase in above-grade living area adds ~${coefficients.GrLivArea.toFixed(0)} to market value (holding bedrooms and bathrooms fixed). Strongest linear driver of price.
                </td>
              </tr>

              <tr className="hover:bg-slate-800/20 transition-colors">
                <td className="py-3 px-3 font-mono text-indigo-300 font-medium">BedroomAbvGr (β₂)</td>
                <td className="py-3 px-3 text-xs text-slate-400">Bedroom Count</td>
                <td className="py-3 px-3 text-right font-mono tabular-nums text-amber-400 font-semibold">
                  -${Math.abs(coefficients.BedroomAbvGr).toFixed(2)}
                </td>
                <td className="py-3 px-3">
                  <span className="text-xs font-mono text-amber-400">Negative*</span>
                </td>
                <td className="py-3 px-3 text-xs text-slate-300 leading-relaxed">
                  <strong className="text-slate-200">Controlling for total area:</strong> For a house of fixed square footage, adding more bedrooms subdivides space into smaller, cramped rooms, reducing perceived luxury and sale price.
                </td>
              </tr>

              <tr className="hover:bg-slate-800/20 transition-colors">
                <td className="py-3 px-3 font-mono text-indigo-300 font-medium">TotalBath (β₃)</td>
                <td className="py-3 px-3 text-xs text-slate-400">Full + 0.5 × Half Bath</td>
                <td className="py-3 px-3 text-right font-mono tabular-nums text-emerald-400 font-semibold">
                  +${coefficients.TotalBath.toFixed(2)}
                </td>
                <td className="py-3 px-3">
                  <span className="text-xs font-mono text-emerald-400">Positive</span>
                </td>
                <td className="py-3 px-3 text-xs text-slate-300 leading-relaxed">
                  Each additional full bathroom adds ~${Math.round(coefficients.TotalBath).toLocaleString()} (half bathroom adds ~${Math.round(coefficients.TotalBath * 0.5).toLocaleString()}), reflecting high fixture costs and convenience.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Machine Learning Pipeline Breakdown */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6">
        <h2 className="text-base font-semibold text-white mb-4">03. End-to-End Implementation Workflow</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2 text-indigo-400">
              <CheckCircle2 className="w-4 h-4" />
              <h3 className="text-sm font-semibold text-slate-200">1. Data Ingestion & Sanitation</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Loads <code className="text-slate-300">train.csv</code> via pandas, checks for missing entries, applies median imputation if nulls occur, and validates schema integrity.
            </p>
          </div>

          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2 text-indigo-400">
              <Sliders className="w-4 h-4" />
              <h3 className="text-sm font-semibold text-slate-200">2. Feature Engineering</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Combines <code className="text-slate-300">FullBath</code> and <code className="text-slate-300">HalfBath</code> into a single consolidated bathroom metric: <code className="text-slate-300">TotalBath = FullBath + 0.5*HalfBath</code>.
            </p>
          </div>

          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2 text-indigo-400">
              <TrendingUp className="w-4 h-4" />
              <h3 className="text-sm font-semibold text-slate-200">3. 80/20 Train/Test Split</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Uses scikit-learn's <code className="text-slate-300">train_test_split(..., test_size=0.2, random_state=42)</code> to evaluate on unseen validation data and prevent overfitting.
            </p>
          </div>

          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2 text-indigo-400">
              <DollarSign className="w-4 h-4" />
              <h3 className="text-sm font-semibold text-slate-200">4. OLS Model Training</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fits <code className="text-slate-300">LinearRegression(fit_intercept=True)</code> by minimizing residual sum of squares across the 3 predictor dimensions.
            </p>
          </div>

          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2 text-indigo-400">
              <Home className="w-4 h-4" />
              <h3 className="text-sm font-semibold text-slate-200">5. Diagnostics & Plotting</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Computes test RMSE, MAE, R², and generates an Actual vs. Predicted scatter plot with the 45-degree reference line saved via matplotlib.
            </p>
          </div>

          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2 text-indigo-400">
              <CheckCircle2 className="w-4 h-4" />
              <h3 className="text-sm font-semibold text-slate-200">6. Model Persistence (joblib)</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Serializes the trained scikit-learn model to <code className="text-slate-300">house_price_model.joblib</code> for lightweight production inference without retraining.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Navigation Footer Banners */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-900/30 rounded-xl">
        <div>
          <h3 className="text-sm font-semibold text-white">Ready to test house price predictions?</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Test the interactive estimator with custom square footage, bedrooms, and bathrooms in real-time.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => onNavigate('sandbox')}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>Launch Live Predictor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onNavigate('code')}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>View Python Code</span>
          </button>
        </div>
      </div>
    </div>
  );
};
