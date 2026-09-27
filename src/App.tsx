import React, { useState, useMemo } from 'react';
import { SAMPLE_TRAIN_DATA, HouseRecord } from './data/sampleDataset';
import { runRegressionPipeline } from './utils/linearRegression';
import { Header } from './components/Header';
import { ModelOverview } from './components/ModelOverview';
import { PredictorSandbox } from './components/PredictorSandbox';
import { RegressionVisualizer } from './components/RegressionVisualizer';
import { DatasetViewer } from './components/DatasetViewer';
import { CodeViewer } from './components/CodeViewer';
import { DocumentationViewer } from './components/DocumentationViewer';
import { GithubGuideModal } from './components/GithubGuideModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [records, setRecords] = useState<HouseRecord[]>(SAMPLE_TRAIN_DATA);
  const [isCustomLoaded, setIsCustomLoaded] = useState<boolean>(false);
  const [isGithubModalOpen, setIsGithubModalOpen] = useState<boolean>(false);

  // Run regression pipeline on current records
  const regressionResult = useMemo(() => {
    return runRegressionPipeline(records, 0.2, 42);
  }, [records]);

  const { metrics, allProcessed, testSet, predict } = regressionResult;

  const handleUploadCustomData = (newRecords: HouseRecord[]) => {
    setRecords(newRecords);
    setIsCustomLoaded(true);
  };

  const handleResetData = () => {
    setRecords(SAMPLE_TRAIN_DATA);
    setIsCustomLoaded(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenGithubModal={() => setIsGithubModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <ModelOverview metrics={metrics} onNavigate={setActiveTab} />
        )}

        {activeTab === 'sandbox' && (
          <PredictorSandbox metrics={metrics} predict={predict} />
        )}

        {activeTab === 'visualizer' && (
          <RegressionVisualizer
            metrics={metrics}
            data={allProcessed}
            testData={testSet}
          />
        )}

        {activeTab === 'dataset' && (
          <DatasetViewer
            data={allProcessed}
            onUploadCustomData={handleUploadCustomData}
            onResetData={handleResetData}
            isCustomLoaded={isCustomLoaded}
          />
        )}

        {activeTab === 'code' && <CodeViewer />}

        {activeTab === 'readme' && <DocumentationViewer />}
      </main>

      <GithubGuideModal
        isOpen={isGithubModalOpen}
        onClose={() => setIsGithubModalOpen(false)}
      />

      <footer className="border-t border-slate-900 py-6 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            PRODIGY_ML_01 · Linear Regression House Price Prediction Project
          </div>
          <div>
            Kaggle Ames Housing Dataset · scikit-learn · pandas · matplotlib
          </div>
        </div>
      </footer>
    </div>
  );
}
