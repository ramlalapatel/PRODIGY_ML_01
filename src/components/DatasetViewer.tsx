import React, { useState, useMemo } from 'react';
import { ProcessedHouse } from '../utils/linearRegression';
import { HouseRecord, generateCsvString, SAMPLE_TRAIN_DATA } from '../data/sampleDataset';
import { downloadTextFile } from '../utils/fileDownloader';
import { Download, Upload, Search, Filter, RefreshCw, FileSpreadsheet } from 'lucide-react';

interface DatasetViewerProps {
  data: ProcessedHouse[];
  onUploadCustomData?: (records: HouseRecord[]) => void;
  onResetData?: () => void;
  isCustomLoaded?: boolean;
}

export const DatasetViewer: React.FC<DatasetViewerProps> = ({
  data,
  onUploadCustomData,
  onResetData,
  isCustomLoaded,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [bedroomFilter, setBedroomFilter] = useState<string>('all');
  const [partitionFilter, setPartitionFilter] = useState<'all' | 'train' | 'test'>('all');
  const [sortField, setSortField] = useState<keyof ProcessedHouse>('Id');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Filtered & sorted records
  const filteredData = useMemo(() => {
    return data
      .filter((row) => {
        if (searchTerm && !row.Id.toString().includes(searchTerm)) {
          return false;
        }
        if (bedroomFilter !== 'all' && row.BedroomAbvGr.toString() !== bedroomFilter) {
          return false;
        }
        if (partitionFilter === 'train' && row.isTest) return false;
        if (partitionFilter === 'test' && !row.isTest) return false;
        return true;
      })
      .sort((a, b) => {
        const valA = a[sortField] ?? 0;
        const valB = b[sortField] ?? 0;
        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
  }, [data, searchTerm, bedroomFilter, partitionFilter, sortField, sortAsc]);

  const handleSort = (field: keyof ProcessedHouse) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleDownloadCsv = () => {
    const csv = generateCsvString(SAMPLE_TRAIN_DATA);
    downloadTextFile('train.csv', csv, 'text/csv');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split(/\\r?\\n/).filter((l) => l.trim().length > 0);
        if (lines.length < 2) {
          throw new Error('CSV file has no data rows.');
        }

        const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
        const idIdx = headers.indexOf('Id');
        const areaIdx = headers.indexOf('GrLivArea');
        const bedIdx = headers.indexOf('BedroomAbvGr');
        const fullBathIdx = headers.indexOf('FullBath');
        const halfBathIdx = headers.indexOf('HalfBath');
        const priceIdx = headers.indexOf('SalePrice');

        if (areaIdx === -1 || bedIdx === -1 || fullBathIdx === -1 || priceIdx === -1) {
          throw new Error('CSV must contain GrLivArea, BedroomAbvGr, FullBath, and SalePrice columns.');
        }

        const parsed: HouseRecord[] = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
          const area = parseFloat(cols[areaIdx]);
          const beds = parseInt(cols[bedIdx], 10);
          const fullBath = parseInt(cols[fullBathIdx], 10);
          const halfBath = halfBathIdx !== -1 ? parseInt(cols[halfBathIdx], 10) || 0 : 0;
          const price = parseFloat(cols[priceIdx]);

          if (!isNaN(area) && !isNaN(beds) && !isNaN(fullBath) && !isNaN(price)) {
            parsed.push({
              Id: idIdx !== -1 ? parseInt(cols[idIdx], 10) || i : i,
              GrLivArea: area,
              BedroomAbvGr: beds,
              FullBath: fullBath,
              HalfBath: halfBath,
              SalePrice: price,
            });
          }
        }

        if (parsed.length === 0) {
          throw new Error('No valid records parsed from CSV.');
        }

        if (onUploadCustomData) {
          onUploadCustomData(parsed);
        }
      } catch (err: any) {
        setUploadError(err.message || 'Failed to parse CSV file');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>Ames Housing Data</span>
            <span aria-hidden="true">·</span>
            <span>Feature Engineering</span>
            <span aria-hidden="true">·</span>
            <span>train.csv View</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Dataset & Feature Engineering Table
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Displaying {filteredData.length} of {data.length} residential properties loaded from{' '}
            {isCustomLoaded ? 'user-uploaded custom CSV' : 'Kaggle Ames train.csv'}.
          </p>
        </div>

        {/* Buttons: Download Sample CSV & Upload Custom train.csv */}
        <div className="flex items-center gap-2.5">
          {isCustomLoaded && onResetData && (
            <button
              onClick={onResetData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset to Sample Data</span>
            </button>
          )}

          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-indigo-400" />
            <span>Upload train.csv</span>
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={handleDownloadCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer shadow-sm"
            title="Download sample train.csv to run with Python"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download train.csv</span>
          </button>
        </div>
      </div>

      {uploadError && (
        <div className="p-3 bg-rose-950/40 border border-rose-800 rounded-lg text-xs text-rose-300">
          Upload Error: {uploadError}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by Property ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>

        {/* Bedroom Filter */}
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <span>Bedrooms:</span>
          <select
            value={bedroomFilter}
            onChange={(e) => setBedroomFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 font-mono"
          >
            <option value="all">All</option>
            <option value="1">1 Bed</option>
            <option value="2">2 Beds</option>
            <option value="3">3 Beds</option>
            <option value="4">4 Beds</option>
          </select>
        </div>

        {/* Partition Filter */}
        <div className="flex items-center gap-1 p-0.5 bg-slate-950 rounded-lg border border-slate-800">
          <button
            onClick={() => setPartitionFilter('all')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              partitionFilter === 'all'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Rows
          </button>
          <button
            onClick={() => setPartitionFilter('train')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              partitionFilter === 'train'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Train Only
          </button>
          <button
            onClick={() => setPartitionFilter('test')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              partitionFilter === 'test'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Test (20%)
          </button>
        </div>
      </div>

      {/* High-Density Data Table */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto max-h-[500px]">
          <table className="w-full text-left text-xs font-mono">
            <thead className="sticky top-0 bg-slate-950 border-b border-slate-800 z-10 select-none">
              <tr className="text-slate-400 uppercase tracking-wider text-[11px]">
                <th
                  onClick={() => handleSort('Id')}
                  className="py-3 px-3 cursor-pointer hover:text-white"
                >
                  Id {sortField === 'Id' && (sortAsc ? '▲' : '▼')}
                </th>
                <th
                  onClick={() => handleSort('GrLivArea')}
                  className="py-3 px-3 cursor-pointer hover:text-white text-right"
                >
                  GrLivArea (sqft) {sortField === 'GrLivArea' && (sortAsc ? '▲' : '▼')}
                </th>
                <th
                  onClick={() => handleSort('BedroomAbvGr')}
                  className="py-3 px-3 cursor-pointer hover:text-white text-right"
                >
                  BedroomAbvGr {sortField === 'BedroomAbvGr' && (sortAsc ? '▲' : '▼')}
                </th>
                <th className="py-3 px-3 text-right">FullBath</th>
                <th className="py-3 px-3 text-right">HalfBath</th>
                <th
                  onClick={() => handleSort('TotalBath')}
                  className="py-3 px-3 cursor-pointer text-indigo-400 hover:text-indigo-300 text-right bg-indigo-950/20"
                >
                  ★ TotalBath {sortField === 'TotalBath' && (sortAsc ? '▲' : '▼')}
                </th>
                <th
                  onClick={() => handleSort('SalePrice')}
                  className="py-3 px-3 cursor-pointer hover:text-white text-right"
                >
                  SalePrice {sortField === 'SalePrice' && (sortAsc ? '▲' : '▼')}
                </th>
                <th className="py-3 px-3 text-right">Predicted (ŷ)</th>
                <th className="py-3 px-3 text-right">Residual (e)</th>
                <th className="py-3 px-3 text-center">Split</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 tabular-nums">
              {filteredData.slice(0, 100).map((row) => (
                <tr key={row.Id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-2.5 px-3 text-slate-400">#{row.Id}</td>
                  <td className="py-2.5 px-3 text-right text-slate-200">{row.GrLivArea}</td>
                  <td className="py-2.5 px-3 text-right text-slate-200">{row.BedroomAbvGr}</td>
                  <td className="py-2.5 px-3 text-right text-slate-400">{row.FullBath}</td>
                  <td className="py-2.5 px-3 text-right text-slate-400">{row.HalfBath}</td>
                  <td className="py-2.5 px-3 text-right text-indigo-300 font-semibold bg-indigo-950/10">
                    {row.TotalBath.toFixed(1)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-white font-medium">
                    ${row.SalePrice.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-300">
                    ${(row.predictedPrice || 0).toLocaleString()}
                  </td>
                  <td
                    className={`py-2.5 px-3 text-right font-medium ${
                      (row.residual || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {(row.residual || 0) >= 0 ? '+' : ''}
                    ${(row.residual || 0).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-sans ${
                        row.isTest
                          ? 'bg-indigo-900/50 text-indigo-300 border border-indigo-700/50'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {row.isTest ? 'Test' : 'Train'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredData.length > 100 && (
          <div className="py-2 px-4 bg-slate-950 text-center text-xs text-slate-500 border-t border-slate-800">
            Showing first 100 of {filteredData.length} records.
          </div>
        )}
      </div>
    </div>
  );
};
