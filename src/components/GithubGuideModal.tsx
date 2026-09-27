import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, GitBranch, Terminal, FolderCheck } from 'lucide-react';
import { downloadTextFile } from '../utils/fileDownloader';
import { PYTHON_SCRIPT_CODE, README_MARKDOWN, REQUIREMENTS_TXT } from '../data/pythonCode';
import { SAMPLE_TRAIN_DATA, generateCsvString } from '../data/sampleDataset';

interface GithubGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GithubGuideModal: React.FC<GithubGuideModalProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('patelramlala414');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  if (!isOpen) return null;

  const repoUrl = `https://github.com/${username}/PRODIGY_ML_01`;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleDownloadAllFiles = () => {
    downloadTextFile('house_price_prediction.py', PYTHON_SCRIPT_CODE, 'text/x-python');
    setTimeout(() => {
      downloadTextFile('README.md', README_MARKDOWN, 'text/markdown');
    }, 200);
    setTimeout(() => {
      downloadTextFile('requirements.txt', REQUIREMENTS_TXT, 'text/plain');
    }, 400);
    setTimeout(() => {
      downloadTextFile('train.csv', generateCsvString(SAMPLE_TRAIN_DATA), 'text/csv');
    }, 600);
  };

  const bashSetupCommands = `# 1. Create and enter folder
mkdir PRODIGY_ML_01
cd PRODIGY_ML_01

# 2. Put downloaded files (house_price_prediction.py, README.md, requirements.txt, train.csv) in this folder

# 3. Initialize Git repository
git init
git add .
git commit -m "feat: Task 01 - House Price Prediction using Linear Regression"

# 4. Link your GitHub repo and push
git branch -M main
git remote add origin ${repoUrl}.git
git push -u origin main`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                GitHub Repository Setup & Link
              </h2>
              <p className="text-xs text-slate-400">
                PRODIGY_ML_01 - Task 01 Submission Link Guide
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Username input & Generated Link */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
          <label className="text-xs text-slate-400 font-medium block">
            Apna GitHub Username yahan likhein:
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500">https://github.com/</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.trim() || 'username')}
              placeholder="your-github-username"
              className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-indigo-300 focus:outline-none focus:border-indigo-500"
            />
            <span className="text-xs font-mono text-slate-500">/PRODIGY_ML_01</span>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <div className="text-xs text-slate-300 font-mono truncate mr-2">
              <span className="text-slate-500">Aapki Repo Link: </span>
              <span className="text-indigo-400 font-semibold">{repoUrl}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleCopy(repoUrl, 'repourl')}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-700 rounded-lg cursor-pointer"
              >
                {copiedCmd === 'repourl' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
              <a
                href={repoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg"
              >
                <span>Open</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Step-by-step instructions in Hindi/Hinglish */}
        <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <FolderCheck className="w-4 h-4 text-emerald-400" />
            <span>GitHub par upload karne ke aasan steps:</span>
          </h3>

          <ol className="list-decimal list-inside space-y-2.5 pl-1 text-slate-300">
            <li>
              Pehle GitHub par jaakar naya repository banayein:{' '}
              <a
                href="https://github.com/new"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 underline inline-flex items-center gap-0.5 font-mono"
              >
                github.com/new <ExternalLink className="w-3 h-3" />
              </a>
              <div className="text-slate-500 ml-4 mt-0.5">
                Repository name likhein: <code className="text-indigo-300 font-mono">PRODIGY_ML_01</code> (Public rakhein).
              </div>
            </li>
            <li>
              Project ki saari files ek saath download karein:
              <div className="mt-1.5 ml-4">
                <button
                  onClick={handleDownloadAllFiles}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <FolderCheck className="w-3.5 h-3.5" />
                  <span>Download All 4 Files (.py, README, reqs, dataset)</span>
                </button>
              </div>
            </li>
            <li>
              Apne computer par terminal (CMD / PowerShell / Bash) kholkar ye commands run karein:
            </li>
          </ol>

          {/* Bash commands block */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                Git Bash / Terminal Commands
              </span>
              <button
                onClick={() => handleCopy(bashSetupCommands, 'bashcmd')}
                className="text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                {copiedCmd === 'bashcmd' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied Commands</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy All Commands</span>
                  </>
                )}
              </button>
            </div>
            <pre className="font-mono text-xs text-indigo-200 overflow-x-auto p-2 bg-slate-900 rounded border border-slate-800/80 leading-relaxed">
              {bashSetupCommands}
            </pre>
          </div>

          <div className="p-3 bg-indigo-950/40 border border-indigo-800/60 rounded-xl text-indigo-200 flex items-center justify-between">
            <div>
              <div className="font-semibold text-white">Prodigy InfoTech Submission Link:</div>
              <div className="font-mono text-[11px] mt-0.5 text-indigo-300">{repoUrl}</div>
            </div>
            <button
              onClick={() => handleCopy(repoUrl, 'sublink')}
              className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg cursor-pointer"
            >
              {copiedCmd === 'sublink' ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
