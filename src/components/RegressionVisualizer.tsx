import React, { useState, useMemo } from 'react';
import { ProcessedHouse, RegressionMetrics } from '../utils/linearRegression';

interface RegressionVisualizerProps {
  metrics: RegressionMetrics;
  data: ProcessedHouse[];
  testData: ProcessedHouse[];
}

export const RegressionVisualizer: React.FC<RegressionVisualizerProps> = ({
  metrics,
  data,
  testData,
}) => {
  const [viewMode, setViewMode] = useState<'actual_vs_predicted' | 'residuals'>('actual_vs_predicted');
  const [datasetFilter, setDatasetFilter] = useState<'test' | 'all'>('test');
  const [hoveredPoint, setHoveredPoint] = useState<ProcessedHouse | null>(null);

  const activePoints = datasetFilter === 'test' ? testData : data;

  // Chart dimensions & scaling
  const width = 760;
  const height = 480;
  const padding = { top: 30, right: 30, bottom: 60, left: 80 };

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  // Domain for Actual vs Predicted
  const { minVal, maxVal } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    data.forEach((d) => {
      const pred = d.predictedPrice || d.SalePrice;
      min = Math.min(min, d.SalePrice, pred);
      max = Math.max(max, d.SalePrice, pred);
    });
    // Add margin
    const range = max - min;
    return {
      minVal: Math.max(0, Math.floor((min - range * 0.05) / 10000) * 10000),
      maxVal: Math.ceil((max + range * 0.05) / 10000) * 10000,
    };
  }, [data]);

  // Domain for Residuals
  const { maxAbsResidual } = useMemo(() => {
    let maxAbs = 0;
    data.forEach((d) => {
      const res = Math.abs(d.residual || 0);
      if (res > maxAbs) maxAbs = res;
    });
    return { maxAbsResidual: Math.ceil(maxAbs / 5000) * 5000 };
  }, [data]);

  // Coordinate transforms
  const scaleX = (val: number) => {
    return padding.left + ((val - minVal) / (maxVal - minVal)) * plotWidth;
  };

  const scaleYActualVsPred = (val: number) => {
    return padding.top + plotHeight - ((val - minVal) / (maxVal - minVal)) * plotHeight;
  };

  const scaleYResidual = (val: number) => {
    // 0 is centered
    return (
      padding.top +
      plotHeight / 2 -
      (val / maxAbsResidual) * (plotHeight / 2)
    );
  };

  // Axis Ticks
  const ticks = [50000, 100000, 150000, 200000, 250000, 300000, 350000, 400000];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>Model Diagnostics</span>
            <span aria-hidden="true">·</span>
            <span>Matplotlib Parity</span>
            <span aria-hidden="true">·</span>
            <span>Error Evaluation</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Regression Fit & Residual Diagnostics
          </h1>
        </div>

        {/* View & Dataset Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Toggle */}
          <div className="p-1 bg-slate-900 border border-slate-800 rounded-lg flex items-center">
            <button
              onClick={() => setViewMode('actual_vs_predicted')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                viewMode === 'actual_vs_predicted'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Actual vs. Predicted
            </button>
            <button
              onClick={() => setViewMode('residuals')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                viewMode === 'residuals'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Residual Errors (e = y - ŷ)
            </button>
          </div>

          {/* Dataset Filter */}
          <div className="p-1 bg-slate-900 border border-slate-800 rounded-lg flex items-center">
            <button
              onClick={() => setDatasetFilter('test')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                datasetFilter === 'test'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Test Set (20%)
            </button>
            <button
              onClick={() => setDatasetFilter('all')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                datasetFilter === 'all'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Data (100%)
            </button>
          </div>
        </div>
      </div>

      {/* Main Chart Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 bg-slate-900/50 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs mb-3">
            <div className="flex items-center gap-4 text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
                <span>Test Set Predictions ({testData.length} houses)</span>
              </div>
              {datasetFilter === 'all' && (
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-600 inline-block" />
                  <span>Train Set</span>
                </div>
              )}
              {viewMode === 'actual_vs_predicted' && (
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-0.5 bg-rose-500 inline-block border-t border-dashed" />
                  <span className="text-slate-400">Ideal 45° Line (y = ŷ)</span>
                </div>
              )}
            </div>
            <span className="font-mono text-slate-400 text-[11px]">
              RMSE: ${Math.round(metrics.testRmse).toLocaleString()} · R²: {(metrics.testR2 * 100).toFixed(1)}%
            </span>
          </div>

          {/* SVG Visualizer */}
          <div className="relative w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-auto select-none bg-slate-950 rounded-lg border border-slate-800/80"
            >
              {/* Background Grid Lines */}
              {ticks.map((t) => {
                if (t < minVal || t > maxVal) return null;
                const x = scaleX(t);
                const y = scaleYActualVsPred(t);
                return (
                  <g key={t} opacity={0.25}>
                    <line
                      x1={x}
                      y1={padding.top}
                      x2={x}
                      y2={padding.top + plotHeight}
                      stroke="#475569"
                      strokeDasharray="2 3"
                    />
                    {viewMode === 'actual_vs_predicted' && (
                      <line
                        x1={padding.left}
                        y1={y}
                        x2={padding.left + plotWidth}
                        y2={y}
                        stroke="#475569"
                        strokeDasharray="2 3"
                      />
                    )}
                  </g>
                );
              })}

              {/* Zero line for Residuals */}
              {viewMode === 'residuals' && (
                <line
                  x1={padding.left}
                  y1={scaleYResidual(0)}
                  x2={padding.left + plotWidth}
                  y2={scaleYResidual(0)}
                  stroke="#ef4444"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                />
              )}

              {/* Ideal 45 Degree Line for Actual vs Predicted */}
              {viewMode === 'actual_vs_predicted' && (
                <line
                  x1={scaleX(minVal)}
                  y1={scaleYActualVsPred(minVal)}
                  x2={scaleX(maxVal)}
                  y2={scaleYActualVsPred(maxVal)}
                  stroke="#ef4444"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              )}

              {/* X and Y Axes */}
              <line
                x1={padding.left}
                y1={padding.top + plotHeight}
                x2={padding.left + plotWidth}
                y2={padding.top + plotHeight}
                stroke="#64748b"
                strokeWidth={1}
              />
              <line
                x1={padding.left}
                y1={padding.top}
                x2={padding.left}
                y2={padding.top + plotHeight}
                stroke="#64748b"
                strokeWidth={1}
              />

              {/* X-Axis Ticks & Labels */}
              {ticks.map((t) => {
                if (t < minVal || t > maxVal) return null;
                const x = scaleX(t);
                return (
                  <g key={`x-${t}`}>
                    <line
                      x1={x}
                      y1={padding.top + plotHeight}
                      x2={x}
                      y2={padding.top + plotHeight + 5}
                      stroke="#64748b"
                    />
                    <text
                      x={x}
                      y={padding.top + plotHeight + 20}
                      fontSize={10}
                      fill="#94a3b8"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      ${t / 1000}k
                    </text>
                  </g>
                );
              })}

              {/* Y-Axis Ticks & Labels */}
              {viewMode === 'actual_vs_predicted'
                ? ticks.map((t) => {
                    if (t < minVal || t > maxVal) return null;
                    const y = scaleYActualVsPred(t);
                    return (
                      <g key={`y-${t}`}>
                        <line
                          x1={padding.left - 5}
                          y1={y}
                          x2={padding.left}
                          y2={y}
                          stroke="#64748b"
                        />
                        <text
                          x={padding.left - 10}
                          y={y + 3}
                          fontSize={10}
                          fill="#94a3b8"
                          textAnchor="end"
                          fontFamily="monospace"
                        >
                          ${t / 1000}k
                        </text>
                      </g>
                    );
                  })
                : [-60000, -30000, 0, 30000, 60000].map((res) => {
                    const y = scaleYResidual(res);
                    return (
                      <g key={`res-${res}`}>
                        <line
                          x1={padding.left - 5}
                          y1={y}
                          x2={padding.left}
                          y2={y}
                          stroke="#64748b"
                        />
                        <text
                          x={padding.left - 10}
                          y={y + 3}
                          fontSize={10}
                          fill="#94a3b8"
                          textAnchor="end"
                          fontFamily="monospace"
                        >
                          {res >= 0 ? `+$${res / 1000}k` : `-$${Math.abs(res) / 1000}k`}
                        </text>
                      </g>
                    );
                  })}

              {/* Axis Titles */}
              <text
                x={padding.left + plotWidth / 2}
                y={height - 15}
                fontSize={11}
                fill="#cbd5e1"
                textAnchor="middle"
                fontWeight="500"
              >
                Actual House Sale Price (USD)
              </text>
              <text
                x={-(padding.top + plotHeight / 2)}
                y={22}
                fontSize={11}
                fill="#cbd5e1"
                textAnchor="middle"
                transform="rotate(-90)"
                fontWeight="500"
              >
                {viewMode === 'actual_vs_predicted'
                  ? 'Predicted House Sale Price (USD)'
                  : 'Residual Error: (Actual - Predicted)'}
              </text>

              {/* Data Points */}
              {activePoints.map((house) => {
                const pred = house.predictedPrice || house.SalePrice;
                const residual = house.residual || 0;
                const cx = scaleX(house.SalePrice);
                const cy =
                  viewMode === 'actual_vs_predicted'
                    ? scaleYActualVsPred(pred)
                    : scaleYResidual(residual);

                const isSelected = hoveredPoint?.Id === house.Id;
                const isTest = house.isTest;

                return (
                  <circle
                    key={house.Id}
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 6.5 : isTest ? 4.5 : 3.5}
                    fill={isTest ? '#6366f1' : '#475569'}
                    stroke={isSelected ? '#ffffff' : isTest ? '#a5b4fc' : '#1e293b'}
                    strokeWidth={isSelected ? 2 : 1}
                    opacity={isSelected ? 1.0 : isTest ? 0.85 : 0.45}
                    className="cursor-pointer transition-transform duration-75"
                    onMouseEnter={() => setHoveredPoint(house)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                );
              })}
            </svg>
          </div>
        </div>

        {/* Inspection Sidebar for Hovered/Selected House */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              House Property Inspector
            </h3>

            {hoveredPoint ? (
              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400 font-sans">Kaggle Property ID:</span>
                  <span className="text-indigo-400 font-bold">#{hoveredPoint.Id}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-sans">Actual Sale Price:</span>
                  <span className="text-white font-bold tabular-nums">
                    ${hoveredPoint.SalePrice.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-sans">Predicted Price (ŷ):</span>
                  <span className="text-indigo-300 font-bold tabular-nums">
                    ${(hoveredPoint.predictedPrice || 0).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-sans">Residual Error (e):</span>
                  <span
                    className={`font-bold tabular-nums ${
                      (hoveredPoint.residual || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {(hoveredPoint.residual || 0) >= 0 ? '+' : ''}
                    ${(hoveredPoint.residual || 0).toLocaleString()}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800 space-y-1.5 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">Living Area (GrLivArea):</span>
                    <span className="tabular-nums">{hoveredPoint.GrLivArea} sq ft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">Bedrooms (BedroomAbvGr):</span>
                    <span className="tabular-nums">{hoveredPoint.BedroomAbvGr} beds</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">Engineered TotalBath:</span>
                    <span className="tabular-nums">{hoveredPoint.TotalBath} baths</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">Partition Type:</span>
                    <span className={hoveredPoint.isTest ? 'text-indigo-400 font-bold' : 'text-slate-400'}>
                      {hoveredPoint.isTest ? 'Test Set (20%)' : 'Train Set (80%)'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-slate-500">
                Hover over any point in the scatter plot to inspect its specific features, actual price, prediction, and residual error.
              </div>
            )}
          </div>

          {/* Model Fit Insights */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 space-y-2 text-xs">
            <h4 className="font-semibold text-slate-200">How to interpret this diagnostic:</h4>
            <ul className="space-y-2 text-slate-400 list-disc list-inside">
              <li>
                <strong className="text-slate-300">45° Red Line:</strong> Perfect prediction line where predicted price equals actual price (y = ŷ).
              </li>
              <li>
                <strong className="text-slate-300">Residual Spread:</strong> Points above the line represent houses that sold for higher than the model estimated (underpredicted). Points below represent houses that sold for lower.
              </li>
              <li>
                <strong className="text-slate-300">Linearity:</strong> The linear regression maintains stable variance across normal home sizes ($100k to $300k). High-end luxury properties ($350k+) exhibit higher variance due to non-linear luxury amenities (swimming pools, finishes) not captured by just area, beds, and baths.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
