import React from 'react';
import { Download, Code2, Play } from 'lucide-react';
import { PYTHON_SCRIPT_CODE } from '../data/pythonCode';
import { downloadTextFile } from '../utils/fileDownloader';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'overview', label: 'Model Overview' },
    { id: 'sandbox', label: 'Live Predictor' },
    { id: 'visualizer', label: 'Actual vs Predicted' },
    { id: 'dataset', label: 'Dataset & Features' },
    { id: 'code', label: 'Python Script' },
    { id: 'readme', label: 'README & Setup' },
  ];

  const handleDownloadScript = () => {
    downloadTextFile('house_price_prediction.py', PYTHON_SCRIPT_CODE, 'text/x-python');
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#overview"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('overview');
          }}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-mono font-bold text-sm shadow-sm group-hover:bg-indigo-500 transition-colors">
            ML
          </div>
          <span className="text-base font-semibold tracking-tight text-slate-100 group-hover:text-white transition-colors">
            PRODIGY_ML_01
          </span>
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`transition-colors relative py-1 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'text-indigo-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab('sandbox')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            <Play className="w-3.5 h-3.5 text-indigo-400" />
            <span>Test Prediction</span>
          </button>
          <button
            onClick={handleDownloadScript}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer shadow-sm whitespace-nowrap"
            title="Download complete house_price_prediction.py"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .py</span>
          </button>
        </div>
      </div>
    </header>
  );
};
