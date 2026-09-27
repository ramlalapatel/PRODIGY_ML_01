import React, { useState } from 'react';
import { RegressionMetrics } from '../utils/linearRegression';
import { Home, Bath, BedDouble, Maximize2, RotateCcw, Sparkles } from 'lucide-react';

interface PredictorSandboxProps {
  metrics: RegressionMetrics;
  predict: (area: number, beds: number, totalBath: number) => number;
}

interface Preset {
  name: string;
  desc: string;
  area: number;
  beds: number;
  fullBath: number;
  halfBath: number;
}

const PRESETS: Preset[] = [
  {
    name: 'Starter Home',
    desc: 'Compact starter property in suburban Ames',
    area: 950,
    beds: 2,
    fullBath: 1,
    halfBath: 0,
  },
  {
    name: 'Family Residence',
    desc: 'Classic 3-bed midwest family home',
    area: 1750,
    beds: 3,
    fullBath: 2,
    halfBath: 1,
  },
  {
    name: 'Executive Suburban',
    desc: 'Modern spacious 4-bedroom home',
    area: 2450,
    beds: 4,
    fullBath: 2,
    halfBath: 1,
  },
  {
    name: 'Luxury Estate',
    desc: 'Large custom build with premium footprint',
    area: 3350,
    beds: 4,
    fullBath: 3,
    halfBath: 1,
  },
];

export const PredictorSandbox: React.FC<PredictorSandboxProps> = ({ metrics, predict }) => {
  const [area, setArea] = useState<number>(1750);
  const [beds, setBeds] = useState<number>(3);
  const [fullBath, setFullBath] = useState<number>(2);
  const [halfBath, setHalfBath] = useState<number>(1);

  const totalBath = Number((fullBath + 0.5 * halfBath).toFixed(1));
  const predictedPrice = Math.max(25000, Math.round(predict(area, beds, totalBath)));

  const { coefficients, intercept } = metrics;
  const interceptPart = intercept;
  const areaPart = coefficients.GrLivArea * area;
  const bedPart = coefficients.BedroomAbvGr * beds;
  const bathPart = coefficients.TotalBath * totalBath;

  const handleApplyPreset = (p: Preset) => {
    setArea(p.area);
    setBeds(p.beds);
    setFullBath(p.fullBath);
    setHalfBath(p.halfBath);
  };

  const handleReset = () => {
    handleApplyPreset(PRESETS[1]);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
          <span>Interactive Simulation</span>
          <span aria-hidden="true">·</span>
          <span>Ordinary Least Squares Model</span>
          <span aria-hidden="true">·</span>
          <span>Real-time Inference</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Live House Price Estimator
        </h1>
        <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-3xl leading-relaxed">
          Adjust the square footage, bedrooms, and bathrooms below to observe how the trained linear regression model updates its predicted market value and breaks down the price decomposition.
        </p>
      </div>

      {/* Preset Profiles */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
          Select a Benchmark Archetype
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESETS.map((preset) => {
            const isMatch =
              area === preset.area &&
              beds === preset.beds &&
              fullBath === preset.fullBath &&
              halfBath === preset.halfBath;

            return (
              <button
                key={preset.name}
                onClick={() => handleApplyPreset(preset)}
                className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                  isMatch
                    ? 'bg-indigo-950/40 border-indigo-500/80 shadow-sm'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-100">{preset.name}</span>
                  {isMatch && <span className="w-2 h-2 rounded-full bg-indigo-400" />}
                </div>
                <div className="text-xs text-slate-400 mt-1 line-clamp-1">{preset.desc}</div>
                <div className="text-xs font-mono text-indigo-300 mt-2">
                  {preset.area} sqft · {preset.beds}b · {preset.fullBath + 0.5 * preset.halfBath}ba
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Controls + Live Estimation Result */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-7 bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h2 className="text-sm font-semibold text-white">Adjust Property Attributes</h2>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to default</span>
            </button>
          </div>

          {/* 1. Square Footage (GrLivArea) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-300">
                <Maximize2 className="w-4 h-4 text-indigo-400" />
                <span>Above Ground Living Area (GrLivArea)</span>
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="500"
                  max="4500"
                  step="25"
                  value={area}
                  onChange={(e) => setArea(Math.max(400, Math.min(6000, Number(e.target.value) || 0)))}
                  className="w-20 px-2 py-1 bg-slate-950 border border-slate-700 rounded text-right font-mono text-sm text-indigo-300 tabular-nums focus:outline-none focus:border-indigo-500"
                />
                <span className="text-xs text-slate-400 font-mono">sq ft</span>
              </div>
            </div>

            <input
              type="range"
              min="500"
              max="4000"
              step="20"
              value={area}
              onChange={(e) => setArea(Number(e.target.value))}
              className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>500 sq ft</span>
              <span>1,500 sq ft (Typical)</span>
              <span>4,000 sq ft</span>
            </div>
          </div>

          {/* 2. Bedrooms (BedroomAbvGr) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-300">
                <BedDouble className="w-4 h-4 text-indigo-400" />
                <span>Bedrooms Above Ground (BedroomAbvGr)</span>
              </label>
              <span className="font-mono text-sm font-semibold text-indigo-300 tabular-nums">
                {beds} {beds === 1 ? 'Bedroom' : 'Bedrooms'}
              </span>
            </div>

            <div className="grid grid-cols-6 gap-2">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setBeds(num)}
                  className={`py-2 text-center text-xs font-mono font-medium rounded-lg border transition-all cursor-pointer ${
                    beds === num
                      ? 'bg-indigo-600 text-white border-indigo-500 font-bold'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            <div className="text-[11px] text-slate-500">
              Note: Holding total area constant, dividing space into more bedrooms slightly lowers valuation due to smaller individual rooms.
            </div>
          </div>

          {/* 3. Bathrooms: FullBath & HalfBath */}
          <div className="space-y-3 pt-1 border-t border-slate-800/60">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-300">
                <Bath className="w-4 h-4 text-indigo-400" />
                <span>Bathroom Configuration</span>
              </label>
              <div className="text-xs font-mono text-indigo-300">
                Engineered Total: <strong className="text-white text-sm tabular-nums">{totalBath}</strong> Baths
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[11px] text-slate-400 mb-1.5">Full Bathrooms (FullBath)</div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[1, 2, 3, 4].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFullBath(f)}
                      className={`py-1.5 text-center text-xs font-mono font-medium rounded-lg border transition-all cursor-pointer ${
                        fullBath === f
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[11px] text-slate-400 mb-1.5">Half Bathrooms (HalfBath)</div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[0, 1, 2, 3].map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setHalfBath(h)}
                      className={`py-1.5 text-center text-xs font-mono font-medium rounded-lg border transition-all cursor-pointer ${
                        halfBath === h
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 font-mono">
              TotalBath = FullBath + 0.5 × HalfBath = {fullBath} + (0.5 × {halfBath}) = {totalBath}
            </div>
          </div>
        </div>

        {/* Prediction Results & Mathematical Decomposition Column */}
        <div className="lg:col-span-5 space-y-4">
          {/* Main Price Card */}
          <div className="bg-gradient-to-b from-indigo-950/60 to-slate-900 border border-indigo-500/40 rounded-xl p-6 shadow-lg shadow-indigo-950/30">
            <div className="flex items-center justify-between text-xs text-indigo-300 mb-1">
              <span>Predicted Sale Price</span>
              <span className="font-mono text-emerald-400">OLS Regression</span>
            </div>
            <div className="text-3xl sm:text-4xl font-mono font-bold text-white tracking-tight tabular-nums">
              ${predictedPrice.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 mt-2 flex items-center justify-between pt-2 border-t border-indigo-900/40">
              <span>Ames Median (~$163,000)</span>
              <span className={`font-mono tabular-nums ${predictedPrice >= 163000 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {predictedPrice >= 163000 ? '+' : ''}
                {(((predictedPrice - 163000) / 163000) * 100).toFixed(1)}% vs. Median
              </span>
            </div>
          </div>

          {/* Mathematical Decomposition Breakdown */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Contribution Breakdown by Feature
            </h3>

            <div className="space-y-2.5 text-xs font-mono">
              {/* Intercept */}
              <div className="flex items-center justify-between p-2 bg-slate-950 rounded border border-slate-800/70">
                <span className="text-slate-400">Base Intercept (β₀)</span>
                <span className="text-slate-200 tabular-nums">
                  +${Math.round(interceptPart).toLocaleString()}
                </span>
              </div>

              {/* Area */}
              <div className="flex items-center justify-between p-2 bg-slate-950 rounded border border-slate-800/70">
                <div>
                  <span className="text-indigo-300">Area Contribution</span>
                  <div className="text-[10px] text-slate-500 tabular-nums">
                    {area} sqft × ${coefficients.GrLivArea.toFixed(2)}/sqft
                  </div>
                </div>
                <span className="text-emerald-400 font-semibold tabular-nums">
                  +${Math.round(areaPart).toLocaleString()}
                </span>
              </div>

              {/* Bedrooms */}
              <div className="flex items-center justify-between p-2 bg-slate-950 rounded border border-slate-800/70">
                <div>
                  <span className="text-amber-300">Bedroom Partitioning</span>
                  <div className="text-[10px] text-slate-500 tabular-nums">
                    {beds} beds × (-${Math.abs(coefficients.BedroomAbvGr).toFixed(2)})
                  </div>
                </div>
                <span className="text-amber-400 font-semibold tabular-nums">
                  -${Math.round(Math.abs(bedPart)).toLocaleString()}
                </span>
              </div>

              {/* Bathrooms */}
              <div className="flex items-center justify-between p-2 bg-slate-950 rounded border border-slate-800/70">
                <div>
                  <span className="text-indigo-300">Bathroom Fixtures</span>
                  <div className="text-[10px] text-slate-500 tabular-nums">
                    {totalBath} baths × ${coefficients.TotalBath.toFixed(2)}
                  </div>
                </div>
                <span className="text-emerald-400 font-semibold tabular-nums">
                  +${Math.round(bathPart).toLocaleString()}
                </span>
              </div>

              {/* Total Sum */}
              <div className="flex items-center justify-between p-2 bg-indigo-950/40 rounded border border-indigo-900/50 font-semibold pt-2 text-white">
                <span>Sum (Fitted Value)</span>
                <span className="tabular-nums text-sm text-indigo-200">
                  =${predictedPrice.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
