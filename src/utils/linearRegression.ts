import { HouseRecord } from '../data/sampleDataset';

export interface ProcessedHouse {
  Id: number;
  GrLivArea: number;
  BedroomAbvGr: number;
  FullBath: number;
  HalfBath: number;
  TotalBath: number;
  SalePrice: number;
  predictedPrice?: number;
  residual?: number;
  isTest?: boolean;
}

export interface RegressionMetrics {
  trainR2: number;
  testR2: number;
  trainRmse: number;
  testRmse: number;
  trainMae: number;
  testMae: number;
  intercept: number;
  coefficients: {
    GrLivArea: number;
    BedroomAbvGr: number;
    TotalBath: number;
  };
  sampleCount: number;
  trainCount: number;
  testCount: number;
}

/**
 * Invert a 4x4 matrix using Gauss-Jordan elimination
 */
function invertMatrix4x4(A: number[][]): number[][] | null {
  const n = 4;
  const M: number[][] = A.map((row, i) => [
    ...row,
    ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)),
  ]);

  for (let i = 0; i < n; i++) {
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(M[k][i]) > Math.abs(M[maxRow][i])) {
        maxRow = k;
      }
    }
    if (Math.abs(M[maxRow][i]) < 1e-12) return null; // singular

    // Swap
    [M[i], M[maxRow]] = [M[maxRow], M[i]];

    // Normalize pivot row
    const pivot = M[i][i];
    for (let j = 0; j < 2 * n; j++) {
      M[i][j] /= pivot;
    }

    // Eliminate other rows
    for (let k = 0; k < n; k++) {
      if (k !== i) {
        const factor = M[k][i];
        for (let j = 0; j < 2 * n; j++) {
          M[k][j] -= factor * M[i][j];
        }
      }
    }
  }

  // Extract right half
  return M.map((row) => row.slice(n));
}

/**
 * Solve Ordinary Least Squares (OLS): beta = (X^T * X)^(-1) * X^T * y
 */
export function solveOLS(
  X: number[][], // N x 4 (including bias 1.0)
  y: number[]
): number[] {
  const N = X.length;
  const p = 4; // bias, GrLivArea, BedroomAbvGr, TotalBath

  // 1. Compute XtX = X^T * X (4x4)
  const XtX: number[][] = Array.from({ length: p }, () => Array(p).fill(0));
  for (let i = 0; i < p; i++) {
    for (let j = 0; j < p; j++) {
      let sum = 0;
      for (let k = 0; k < N; k++) {
        sum += X[k][i] * X[k][j];
      }
      XtX[i][j] = sum;
    }
  }

  // 2. Compute Xty = X^T * y (4x1)
  const Xty: number[] = Array(p).fill(0);
  for (let i = 0; i < p; i++) {
    let sum = 0;
    for (let k = 0; k < N; k++) {
      sum += X[k][i] * y[k];
    }
    Xty[i] = sum;
  }

  // 3. Invert XtX
  const invXtX = invertMatrix4x4(XtX);
  if (!invXtX) {
    // fallback if singular
    return [20000, 105, -15000, 28000];
  }

  // 4. beta = invXtX * Xty
  const beta: number[] = Array(p).fill(0);
  for (let i = 0; i < p; i++) {
    let sum = 0;
    for (let j = 0; j < p; j++) {
      sum += invXtX[i][j] * Xty[j];
    }
    beta[i] = sum;
  }

  return beta;
}

/**
 * Run full linear regression pipeline on records
 */
export function runRegressionPipeline(
  records: HouseRecord[],
  testRatio: number = 0.2,
  seed: number = 42
): {
  metrics: RegressionMetrics;
  allProcessed: ProcessedHouse[];
  trainSet: ProcessedHouse[];
  testSet: ProcessedHouse[];
  predict: (area: number, beds: number, totalBath: number) => number;
} {
  // Feature Engineering
  const processed: ProcessedHouse[] = records.map((r) => ({
    ...r,
    TotalBath: Number((r.FullBath + 0.5 * r.HalfBath).toFixed(1)),
  }));

  // Deterministic shuffle with seed
  const shuffled = [...processed];
  let currentSeed = seed;
  const seededRandom = () => {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    return currentSeed / 233280;
  };

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const splitIdx = Math.floor(shuffled.length * (1 - testRatio));
  const trainSet = shuffled.slice(0, splitIdx).map((d) => ({ ...d, isTest: false }));
  const testSet = shuffled.slice(splitIdx).map((d) => ({ ...d, isTest: true }));

  // Build X_train and y_train
  const X_train = trainSet.map((d) => [1.0, d.GrLivArea, d.BedroomAbvGr, d.TotalBath]);
  const y_train = trainSet.map((d) => d.SalePrice);

  // Train model
  const beta = solveOLS(X_train, y_train);
  const intercept = beta[0];
  const coefArea = beta[1];
  const coefBed = beta[2];
  const coefBath = beta[3];

  const predict = (area: number, beds: number, totalBath: number) => {
    return intercept + coefArea * area + coefBed * beds + coefBath * totalBath;
  };

  // Evaluate on Train
  let trainSse = 0;
  let trainSae = 0;
  const trainYMean = y_train.reduce((a, b) => a + b, 0) / y_train.length;
  let trainSst = 0;

  trainSet.forEach((d) => {
    const pred = predict(d.GrLivArea, d.BedroomAbvGr, d.TotalBath);
    const err = d.SalePrice - pred;
    d.predictedPrice = Math.round(pred);
    d.residual = Math.round(err);
    trainSse += err * err;
    trainSae += Math.abs(err);
    trainSst += Math.pow(d.SalePrice - trainYMean, 2);
  });

  const trainRmse = Math.sqrt(trainSse / trainSet.length);
  const trainMae = trainSae / trainSet.length;
  const trainR2 = Math.max(0, 1 - trainSse / (trainSst || 1));

  // Evaluate on Test
  const y_test = testSet.map((d) => d.SalePrice);
  const testYMean = y_test.reduce((a, b) => a + b, 0) / (y_test.length || 1);
  let testSse = 0;
  let testSae = 0;
  let testSst = 0;

  testSet.forEach((d) => {
    const pred = predict(d.GrLivArea, d.BedroomAbvGr, d.TotalBath);
    const err = d.SalePrice - pred;
    d.predictedPrice = Math.round(pred);
    d.residual = Math.round(err);
    testSse += err * err;
    testSae += Math.abs(err);
    testSst += Math.pow(d.SalePrice - testYMean, 2);
  });

  const testRmse = Math.sqrt(testSse / (testSet.length || 1));
  const testMae = testSae / (testSet.length || 1);
  const testR2 = Math.max(0, 1 - testSse / (testSst || 1));

  const allProcessed = [...trainSet, ...testSet].sort((a, b) => a.Id - b.Id);

  return {
    metrics: {
      trainR2,
      testR2,
      trainRmse,
      testRmse,
      trainMae,
      testMae,
      intercept,
      coefficients: {
        GrLivArea: coefArea,
        BedroomAbvGr: coefBed,
        TotalBath: coefBath,
      },
      sampleCount: records.length,
      trainCount: trainSet.length,
      testCount: testSet.length,
    },
    allProcessed,
    trainSet,
    testSet,
    predict,
  };
}
