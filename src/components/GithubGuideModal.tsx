import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, GitBranch, Terminal, FolderCheck, AlertCircle, UploadCloud, Info } from 'lucide-react';
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
  const createRepoUrl = `https://github.com/new?name=PRODIGY_ML_01&description=Prodigy+InfoTech+Task+01+-+House+Price+Prediction+using+Linear+Regression`;

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

  const bashSetupCommands = `# 1. Folder create karein aur andar jayein
mkdir PRODIGY_ML_01
cd PRODIGY_ML_01

# 2. Chaaron downloaded files is folder mein rakhein
# (house_price_prediction.py, README.md, requirements.txt, train.csv)

# 3. Git initialize aur commit karein
git init
git add .
git commit -m "feat: Task 01 - House Price Prediction using Linear Regression"

# 4. GitHub remote add karein aur push karein
git branch -M main
git remote add origin ${repoUrl}.git
git push -u origin main`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto space-y-6">
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
                PRODIGY_ML_01 - Task 01 GitHub Submission Guide
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

        {/* IMPORTANT NOTICE: Why White Screen / 404 Appears */}
        <div className="p-4 bg-amber-950/40 border border-amber-500/50 rounded-xl text-amber-200 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-white text-xs sm:text-sm">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Link par click karne ke baad White Screen / 404 kyu aa raha hai?</span>
          </div>
          <p className="text-xs text-amber-200/90 leading-relaxed">
            Kyunki aapne abhi tak apne GitHub account par <strong>PRODIGY_ML_01</strong> naam ki repository create nahi ki hai.
            GitHub par jab tak repository create karke files upload nahi ki jaati, tab tak link open karne par GitHub blank/404 error deta hai.
          </p>
        </div>

        {/* Step 1: Create the repository first */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              Step 1: GitHub par Repository banayein (1-Click)
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Neeche diye gaye button par click karein, GitHub automatically aapke liye <strong>PRODIGY_ML_01</strong> naam se repo create karne ka page open kar dega:
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={createRepoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm"
            >
              <span>GitHub par New Repo Banayein</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <span className="text-xs text-slate-400 font-mono">(Public select karke "Create repository" dabayein)</span>
          </div>
        </div>

        {/* Step 2: Download Project Files */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            Step 2: Project Files Download Karein
          </div>
          <p className="text-xs text-slate-400">
            Ek click mein saari 4 files (<code className="text-slate-300">house_price_prediction.py</code>, <code className="text-slate-300">README.md</code>, <code className="text-slate-300">requirements.txt</code>, <code className="text-slate-300">train.csv</code>) download karein:
          </p>
          <div>
            <button
              onClick={handleDownloadAllFiles}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg inline-flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <FolderCheck className="w-4 h-4" />
              <span>Download All 4 Files</span>
            </button>
          </div>
        </div>

        {/* Step 3: Two Easy Ways to Upload */}
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            Step 3: Files Upload karne ke 2 Aasan Tarike
          </div>

          {/* Option A: Direct Web Upload (Easiest, no command required) */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <UploadCloud className="w-4 h-4 text-emerald-400" />
              <span>Tarika A: Bina Terminal ke (GitHub Web par Drag & Drop - Sabse Aasan)</span>
            </div>
            <ol className="text-xs text-slate-400 space-y-1 list-decimal list-inside pl-1 leading-relaxed">
              <li>Step 1 mein create ki hui GitHub repository page par jayein.</li>
              <li>Wahan <strong>"uploading an existing file"</strong> link par click karein.</li>
              <li>Step 2 mein download ki hui charon files ko drag & drop karke <strong>"Commit changes"</strong> dabayein.</li>
            </ol>
          </div>

          {/* Option B: Terminal Git Commands */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-white">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-indigo-400" />
                Tarika B: Terminal / Git Bash se Push karein
              </span>
              <button
                onClick={() => handleCopy(bashSetupCommands, 'bashcmd')}
                className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] cursor-pointer"
              >
                {copiedCmd === 'bashcmd' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Commands</span>
                  </>
                )}
              </button>
            </div>
            <pre className="font-mono text-xs text-indigo-200 overflow-x-auto p-3 bg-slate-900 rounded-lg border border-slate-800/80 leading-relaxed">
              {bashSetupCommands}
            </pre>
          </div>
        </div>

        {/* Final Submission Link */}
        <div className="p-4 bg-indigo-950/40 border border-indigo-800/70 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
              Prodigy InfoTech Submission URL
            </div>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1">
              <Info className="w-3 h-3" />
              Files push karne ke baad ye link 100% active ho jayegi
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={repoUrl}
              className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-indigo-300 select-all"
            />
            <button
              onClick={() => handleCopy(repoUrl, 'sublink')}
              className="px-3.5 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg cursor-pointer whitespace-nowrap shadow-sm"
            >
              {copiedCmd === 'sublink' ? 'Copied Link!' : 'Copy Repo Link'}
            </button>
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg inline-flex items-center gap-1 whitespace-nowrap"
            >
              <span>Visit</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
