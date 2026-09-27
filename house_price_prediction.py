"""
================================================================================
PRODIGY INFOTECH - MACHINE LEARNING INTERNSHIP
TASK 01: House Price Prediction using Linear Regression
File: house_price_prediction.py
================================================================================

Task Objective:
    Implement a linear regression model to predict house sale prices based on:
    - Square footage (GrLivArea: Above grade living area in sq ft)
    - Number of bedrooms (BedroomAbvGr: Bedrooms above grade)
    - Number of bathrooms (TotalBath = FullBath + 0.5 * HalfBath)

Dataset:
    Kaggle "House Prices - Advanced Regression Techniques" Competition
    Link: https://www.kaggle.com/c/house-prices-advanced-regression-techniques/data
    Files: train.csv (used for model training and evaluation), test.csv
================================================================================
"""

import os
import sys
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import joblib


def load_and_preprocess_data(filepath: str = "train.csv") -> pd.DataFrame:
    if not os.path.exists(filepath):
        print(f"[ERROR] File '{filepath}' not found!")
        print("Please download 'train.csv' from Kaggle:")
        print("https://www.kaggle.com/c/house-prices-advanced-regression-techniques/data")
        sys.exit(1)

    print(f"--> [Step 1/7] Loading dataset from '{filepath}'...")
    df = pd.read_csv(filepath)
    print(f"    Raw dataset shape: {df.shape[0]} rows, {df.shape[1]} columns.")

    required_cols = ["GrLivArea", "BedroomAbvGr", "FullBath", "HalfBath", "SalePrice"]
    missing_in_dataset = [col for col in required_cols if col not in df.columns]
    if missing_in_dataset:
        raise ValueError(f"Missing expected columns in dataset: {missing_in_dataset}")

    subset = df[required_cols].copy()

    # Handle missing values if any exist
    if subset.isnull().any().any():
        print("    Imputing missing values with column medians...")
        subset = subset.fillna(subset.median())

    # Feature Engineering: Total Bathrooms
    print("--> [Step 3/7] Engineering feature 'TotalBath' = FullBath + 0.5 * HalfBath...")
    subset["TotalBath"] = subset["FullBath"] + (0.5 * subset["HalfBath"])
    return subset


def train_and_evaluate(df: pd.DataFrame, test_size: float = 0.2, random_state: int = 42):
    feature_cols = ["GrLivArea", "BedroomAbvGr", "TotalBath"]
    target_col = "SalePrice"

    X = df[feature_cols]
    y = df[target_col]

    print(f"\n--> [Step 4/7] Splitting data: {int((1-test_size)*100)}% train / {int(test_size*100)}% test...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state
    )

    print("--> [Step 5/7] Fitting Linear Regression model...")
    model = LinearRegression(fit_intercept=True)
    model.fit(X_train, y_train)

    y_pred_train = model.predict(X_train)
    y_pred_test = model.predict(X_test)

    train_rmse = np.sqrt(mean_squared_error(y_train, y_pred_train))
    test_rmse = np.sqrt(mean_squared_error(y_test, y_pred_test))
    test_mae = mean_absolute_error(y_test, y_pred_test)
    train_r2 = r2_score(y_train, y_pred_train)
    test_r2 = r2_score(y_test, y_pred_test)

    print("\n=======================================================")
    print("               MODEL PERFORMANCE METRICS               ")
    print("=======================================================")
    print(f"  Training R² Score       : {train_r2:.4f} ({train_r2 * 100:.2f}%)")
    print(f"  Testing R² Score        : {test_r2:.4f} ({test_r2 * 100:.2f}%)")
    print(f"  Training RMSE           : ${train_rmse:,.2f}")
    print(f"  Testing RMSE            : ${test_rmse:,.2f}")
    print(f"  Testing MAE             : ${test_mae:,.2f}")
    print("=======================================================")

    intercept = model.intercept_
    coefficients = dict(zip(feature_cols, model.coef_))

    print(f"  Intercept (beta_0)      : ${intercept:,.2f}")
    for feature, coef in coefficients.items():
        sign = "+" if coef >= 0 else "-"
        print(f"  Weight for {feature:<12}: {sign}${abs(coef):,.2f}")

    metrics = {
        "train_r2": train_r2,
        "test_r2": test_r2,
        "train_rmse": train_rmse,
        "test_rmse": test_rmse,
        "test_mae": test_mae,
        "intercept": intercept,
        "coefficients": coefficients,
    }

    return model, X_train, X_test, y_train, y_test, y_pred_test, metrics


def plot_actual_vs_predicted(y_test: pd.Series, y_pred_test: np.ndarray, output_filename: str = "actual_vs_predicted.png"):
    print(f"\n--> [Step 6/7] Creating Actual vs. Predicted evaluation plot...")
    plt.figure(figsize=(9, 6), dpi=120)
    plt.scatter(y_test, y_pred_test, alpha=0.6, color="#2563eb", edgecolors="w", s=55, label="Test Houses")
    min_val = min(y_test.min(), y_pred_test.min())
    max_val = max(y_test.max(), y_pred_test.max())
    plt.plot([min_val, max_val], [min_val, max_val], color="#dc2626", linestyle="--", linewidth=2, label="Ideal Fit (y = y_hat)")
    plt.title("Actual vs. Predicted House Prices", fontsize=13, fontweight="bold")
    plt.xlabel("Actual Sale Price ($)")
    plt.ylabel("Predicted Sale Price ($)")
    plt.legend()
    plt.tight_layout()
    plt.savefig(output_filename, dpi=150)
    print(f"    Plot saved to '{output_filename}'.")


def save_model(model, filename: str = "house_price_model.joblib"):
    print(f"\n--> [Step 7/7] Saving trained model to disk as '{filename}'...")
    joblib.dump(model, filename)
    print("    Model exported successfully.")


def main():
    print("PRODIGY_ML_01: Linear Regression House Price Prediction")
    df = load_and_preprocess_data("train.csv")
    model, X_train, X_test, y_train, y_test, y_pred_test, metrics = train_and_evaluate(df, test_size=0.2, random_state=42)
    plot_actual_vs_predicted(y_test, y_pred_test)
    save_model(model)
    print("\n[SUCCESS] Pipeline execution finished.")


if __name__ == "__main__":
    main()
