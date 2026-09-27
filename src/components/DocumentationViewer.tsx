import React, { useState } from 'react';
import { README_MARKDOWN } from '../data/pythonCode';
import { downloadTextFile } from '../utils/fileDownloader';
import { Copy, Check, Download, BookOpen, Terminal, CheckCircle2, ExternalLink } from 'lucide-react';

export const DocumentationViewer: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(README_MARKDOWN);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCommand = (cmd: string, id: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleDownload = () => {
    downloadTextFile('README.md', README_MARKDOWN, 'text/markdown');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>Project Documentation</span>
            <span aria-hidden="true">·</span>
            <span>README.md</span>
            <span aria-hidden="true">·</span>
            <span>PRODIGY_ML_01</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Project README & Setup Guide
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied README.md!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Raw Markdown</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download README.md</span>
          </button>
        </div>
      </div>

      {/* Quickstart Command Center */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-white">Quick Terminal Setup (Copy & Run)</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Python 3.8+</span>
        </div>

        <div className="space-y-2.5">
          {/* Step 1 */}
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between gap-4">
            <div className="font-mono text-xs text-slate-300 truncate">
              <span className="text-slate-500 select-none mr-2">1.</span>
              python -m venv venv && source venv/bin/activate
            </div>
            <button
              onClick={() =>
                handleCopyCommand('python -m venv venv && source venv/bin/activate', 'c1')
              }
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer shrink-0"
            >
              {copiedCmd === 'c1' ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between gap-4">
            <div className="font-mono text-xs text-slate-300 truncate">
              <span className="text-slate-500 select-none mr-2">2.</span>
              pip install numpy pandas scikit-learn matplotlib seaborn joblib
            </div>
            <button
              onClick={() =>
                handleCopyCommand(
                  'pip install numpy pandas scikit-learn matplotlib seaborn joblib',
                  'c2'
                )
              }
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer shrink-0"
            >
              {copiedCmd === 'c2' ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between gap-4">
            <div className="font-mono text-xs text-slate-300 truncate">
              <span className="text-slate-500 select-none mr-2">3.</span>
              python house_price_prediction.py
            </div>
            <button
              onClick={() => handleCopyCommand('python house_price_prediction.py', 'c3')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer shrink-0"
            >
              {copiedCmd === 'c3' ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Rendered Documentation Content */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6 text-sm text-slate-300 leading-relaxed font-sans">
        {/* Title */}
        <div className="border-b border-slate-800 pb-5">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            PRODIGY_ML_01: House Price Prediction using Linear Regression
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
            <span>Prodigy InfoTech Internship</span>
            <span aria-hidden="true">·</span>
            <span>Task 01</span>
            <span aria-hidden="true">·</span>
            <span>Ames Housing Competition</span>
          </div>
        </div>

        {/* Section: Task Description */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-white">01. Task Description</h3>
          <p className="text-slate-400">
            Implement a linear regression model to predict house sale prices based on square footage (<code className="text-indigo-300 font-mono text-xs">GrLivArea</code>), number of bedrooms (<code className="text-indigo-300 font-mono text-xs">BedroomAbvGr</code>), and number of bathrooms (<code className="text-indigo-300 font-mono text-xs">FullBath + 0.5 * HalfBath</code>).
          </p>
        </section>

        {/* Section: Dataset */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-white">02. Dataset Information</h3>
          <p className="text-slate-400">
            The dataset is sourced from the famous Kaggle competition{' '}
            <a
              href="https://www.kaggle.com/c/house-prices-advanced-regression-techniques/data"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-400 hover:text-indigo-300 underline inline-flex items-center gap-1"
            >
              <span>House Prices: Advanced Regression Techniques</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            . The training dataset consists of 1,460 residential property sales in Ames, Iowa.
          </p>
        </section>

        {/* Section: Feature Engineering */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-white">03. Engineered Features</h3>
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs space-y-1.5 text-slate-300">
            <div><span className="text-indigo-300 font-semibold">GrLivArea</span>: Above grade (ground) living area square feet</div>
            <div><span className="text-indigo-300 font-semibold">BedroomAbvGr</span>: Bedrooms above grade (does not include basement bedrooms)</div>
            <div><span className="text-indigo-300 font-semibold">TotalBath</span>: FullBath + 0.5 × HalfBath</div>
            <div><span className="text-emerald-400 font-semibold">SalePrice</span>: Target variable (property sale price in USD)</div>
          </div>
        </section>

        {/* Section: Saved Model Inference */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-white">04. Loading Saved Model in Production</h3>
          <p className="text-slate-400">
            The script serializes the trained scikit-learn model via <code className="text-indigo-300 font-mono text-xs">joblib.dump()</code> to <code className="text-indigo-300 font-mono text-xs">house_price_model.joblib</code>. You can load and use it in any web app or API:
          </p>
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs text-indigo-200 overflow-x-auto">
            <pre>{`import joblib
import pandas as pd

model = joblib.load("house_price_model.joblib")

# Predict a 2,000 sq ft home with 3 bedrooms and 2.5 bathrooms
new_home = pd.DataFrame([{
    "GrLivArea": 2000,
    "BedroomAbvGr": 3,
    "TotalBath": 2.5
}])

price = model.predict(new_home)[0]
print(f"Predicted Price: \${price:,.2f}")`}</pre>
          </div>
        </section>
      </div>
    </div>
  );
};
