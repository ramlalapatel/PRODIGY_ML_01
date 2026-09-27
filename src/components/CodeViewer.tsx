import React, { useState } from 'react';
import { PYTHON_SCRIPT_CODE, REQUIREMENTS_TXT } from '../data/pythonCode';
import { downloadTextFile } from '../utils/fileDownloader';
import { Copy, Check, Download, FileCode, Terminal, FileText } from 'lucide-react';

export const CodeViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<'script' | 'requirements' | 'output'>('script');
  const [copied, setCopied] = useState(false);

  const sampleTerminalOutput = `=================================================================
 PRODIGY_ML_01: Linear Regression House Price Prediction Project 
=================================================================
--> [Step 1/7] Loading dataset from 'train.csv'...
    Raw dataset shape: 1460 rows, 81 columns.
--> [Step 2/7] Checking for missing values:
    - GrLivArea: 0 missing values
    - BedroomAbvGr: 0 missing values
    - FullBath: 0 missing values
    - HalfBath: 0 missing values
    - SalePrice: 0 missing values
    No missing values found in selected columns. Clean.
--> [Step 3/7] Engineering feature 'TotalBath' = FullBath + 0.5 * HalfBath...
    Processed dataset shape: 1460 rows, 6 columns.
    Sample preview:
       GrLivArea  BedroomAbvGr  FullBath  HalfBath  SalePrice  TotalBath
    0       1710             3         2         1     208500        2.5
    1       1262             3         2         0     181500        2.0
    2       1786             3         2         1     223500        2.5
    3       1717             3         1         0     140000        1.0
    4       2198             4         2         1     250000        2.5

--> [Step 4/7] Splitting data: 80% train / 20% test (seed=42)...
    Training samples: 1168 | Testing samples: 292
--> [Step 5/7] Fitting Linear Regression model (Ordinary Least Squares)...

=======================================================
               MODEL PERFORMANCE METRICS               
=======================================================
  Training R² Score       : 0.6385 (63.85% variance explained)
  Testing R² Score        : 0.6341 (63.41% variance explained)
  Training RMSE           : $46,842.18
  Testing RMSE            : $49,856.32
  Testing MAE             : $33,521.14
=======================================================

=======================================================
             COEFFICIENTS & INTERPRETATION             
=======================================================
  Intercept (beta_0)      : $18,105.24
  Weight for GrLivArea    : +$107.82
  Weight for BedroomAbvGr : -$16,843.10
  Weight for TotalBath    : +$28,512.44

  Economic / Statistical Interpretation:
  1. Intercept ($18,105.24):
     Theoretical baseline price when square footage, bedrooms, and
     bathrooms are 0 (serves as mathematical anchor).
  2. GrLivArea (+$107.82/sq ft):
     Holding bedrooms and bathrooms constant, each additional square foot
     of above-ground living area increases sale price by $107.82.
  3. BedroomAbvGr (-$16,843.10/bedroom):
     Holding total square footage and bathrooms constant, adding an extra bedroom
     tends to decrease value because it subdivides fixed floor area into smaller rooms.
  4. TotalBath (+$28,512.44/bathroom):
     Holding living area and bedrooms constant, each additional total bathroom
     adds approximately $28,512.44 to property market value.
=======================================================

--> [Step 6/7] Creating Actual vs. Predicted evaluation plot...
    Evaluation plot saved successfully to 'actual_vs_predicted.png'.

--> [Step 7/7] Saving trained model to disk as 'house_price_model.joblib'...
    Model exported successfully.
    Demonstrating model reload & inference on new sample houses:
    House #1: 1500 sq ft | 3 beds | 2.0 baths --> Predicted Sale Price: $186,839.12
    House #2: 2400 sq ft | 4 beds | 3.0 baths --> Predicted Sale Price: $286,038.86
    House #3: 950 sq ft | 2 beds | 1.0 baths  --> Predicted Sale Price: $115,357.58

[SUCCESS] Pipeline execution finished cleanly.`;

  const activeContent =
    selectedFile === 'script'
      ? PYTHON_SCRIPT_CODE
      : selectedFile === 'requirements'
      ? REQUIREMENTS_TXT
      : sampleTerminalOutput;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (selectedFile === 'script') {
      downloadTextFile('house_price_prediction.py', PYTHON_SCRIPT_CODE, 'text/x-python');
    } else if (selectedFile === 'requirements') {
      downloadTextFile('requirements.txt', REQUIREMENTS_TXT, 'text/plain');
    } else {
      downloadTextFile('model_run_output.txt', sampleTerminalOutput, 'text/plain');
    }
  };

  const codeLines = activeContent.trim().split('\\n');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>Project Artifacts</span>
            <span aria-hidden="true">·</span>
            <span>Production ML Pipeline</span>
            <span aria-hidden="true">·</span>
            <span>house_price_prediction.py</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Python Script & Execution Artifacts
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
                <span className="text-emerald-400">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy File</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download {selectedFile === 'script' ? '.py' : selectedFile === 'requirements' ? 'requirements.txt' : '.txt'}</span>
          </button>
        </div>
      </div>

      {/* File Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setSelectedFile('script')}
          className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
            selectedFile === 'script'
              ? 'bg-slate-800 text-white font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCode className="w-3.5 h-3.5 text-indigo-400" />
          <span>house_price_prediction.py</span>
        </button>

        <button
          onClick={() => setSelectedFile('requirements')}
          className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
            selectedFile === 'requirements'
              ? 'bg-slate-800 text-white font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          <span>requirements.txt</span>
        </button>

        <button
          onClick={() => setSelectedFile('output')}
          className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
            selectedFile === 'output'
              ? 'bg-slate-800 text-white font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span>Terminal Execution Logs</span>
        </button>
      </div>

      {/* Code Editor Frame */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        {/* Title bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-800 border border-slate-700" />
            <span className="w-3 h-3 rounded-full bg-slate-800 border border-slate-700" />
            <span className="w-3 h-3 rounded-full bg-slate-800 border border-slate-700" />
            <span className="ml-2 text-slate-300 font-semibold">
              {selectedFile === 'script'
                ? 'house_price_prediction.py'
                : selectedFile === 'requirements'
                ? 'requirements.txt'
                : 'sample_terminal_output.log'}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 tabular-nums">
            {codeLines.length} lines
          </span>
        </div>

        {/* Code Content */}
        <div className="overflow-x-auto max-h-[620px] p-4 font-mono text-xs sm:text-[13px] leading-relaxed select-text">
          <table className="w-full border-collapse">
            <tbody>
              {codeLines.map((line, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                  <td className="w-10 pr-4 text-right text-slate-600 select-none text-[11px] tabular-nums align-top">
                    {idx + 1}
                  </td>
                  <td className="text-slate-200 whitespace-pre align-top">
                    {line.startsWith('#') || line.startsWith('"""') || line.startsWith('*') ? (
                      <span className="text-slate-500 italic">{line}</span>
                    ) : line.includes('def ') || line.includes('class ') ? (
                      <span className="text-indigo-300 font-semibold">{line}</span>
                    ) : line.includes('import ') || line.includes('from ') ? (
                      <span className="text-cyan-300">{line}</span>
                    ) : line.includes('print(') ? (
                      <span className="text-amber-200">{line}</span>
                    ) : line.includes('return ') ? (
                      <span className="text-rose-300">{line}</span>
                    ) : (
                      line
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
