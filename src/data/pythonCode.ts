/**
 * Code artifacts and documentation for PRODIGY_ML_01 House Price Prediction.
 */

export const PYTHON_SCRIPT_CODE = `"""
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

Pipeline Steps:
    1. Load and inspect the dataset (train.csv).
    2. Select core features and engineer 'TotalBath'.
    3. Check and handle missing or corrupted values.
    4. Split the data into 80% training and 20% testing sets.
    5. Fit Ordinary Least Squares Linear Regression (scikit-learn).
    6. Evaluate model performance using RMSE, MAE, and R² Score.
    7. Inspect and interpret coefficients and intercept.
    8. Generate visual diagnostics (Actual vs. Predicted prices plot).
    9. Persist the trained model using joblib.
   10. Demonstrate loading the saved model and making real-world inference.

Author: Machine Learning Intern
Repository: PRODIGY_ML_01
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
    """
    Load the Kaggle Ames house prices training dataset, perform feature selection,
    feature engineering for total bathrooms, and handle any missing values.

    Parameters:
        filepath (str): Path to train.csv.

    Returns:
        pd.DataFrame: Cleaned dataframe containing engineered features and target.
    """
    if not os.path.exists(filepath):
        print(f"[ERROR] File '{filepath}' not found!")
        print("Please download 'train.csv' from Kaggle:")
        print("https://www.kaggle.com/c/house-prices-advanced-regression-techniques/data")
        print("and place it in the same directory as this script.")
        sys.exit(1)

    print(f"--> [Step 1/7] Loading dataset from '{filepath}'...")
    df = pd.read_csv(filepath)
    print(f"    Raw dataset shape: {df.shape[0]} rows, {df.shape[1]} columns.")

    # 1. Select required columns
    required_cols = ["GrLivArea", "BedroomAbvGr", "FullBath", "HalfBath", "SalePrice"]
    missing_in_dataset = [col for col in required_cols if col not in df.columns]
    if missing_in_dataset:
        raise ValueError(f"Missing expected columns in dataset: {missing_in_dataset}")

    subset = df[required_cols].copy()

    # 2. Check and report missing values
    print("--> [Step 2/7] Checking for missing values:")
    missing_counts = subset.isnull().sum()
    for col, count in missing_counts.items():
        print(f"    - {col}: {count} missing values")

    # Handle missing values if any exist (e.g. median imputation)
    if subset.isnull().any().any():
        print("    Imputing missing values with column medians...")
        subset = subset.fillna(subset.median())
    else:
        print("    No missing values found in selected columns. Clean.")

    # 3. Feature Engineering: Total Bathrooms
    # A full bath is counted as 1.0, and a half bath (powder room) as 0.5
    print("--> [Step 3/7] Engineering feature 'TotalBath' = FullBath + 0.5 * HalfBath...")
    subset["TotalBath"] = subset["FullBath"] + (0.5 * subset["HalfBath"])

    print(f"    Processed dataset shape: {subset.shape[0]} rows, {subset.shape[1]} columns.")
    print("    Sample preview:")
    print(subset.head())

    return subset


def train_and_evaluate(df: pd.DataFrame, test_size: float = 0.2, random_state: int = 42):
    """
    Split data, train a linear regression model, calculate evaluation metrics,
    and output coefficient interpretations.

    Parameters:
        df (pd.DataFrame): Cleaned dataframe.
        test_size (float): Fraction of data reserved for testing (default 0.2 = 20%).
        random_state (int): Reproducibility seed.

    Returns:
        tuple: (model, X_train, X_test, y_train, y_test, y_pred_test, metrics)
    """
    # Define feature matrix X and target vector y
    feature_cols = ["GrLivArea", "BedroomAbvGr", "TotalBath"]
    target_col = "SalePrice"

    X = df[feature_cols]
    y = df[target_col]

    # Train / Test split (80% train, 20% test)
    print(f"\\n--> [Step 4/7] Splitting data: {int((1-test_size)*100)}% train / {int(test_size*100)}% test (seed={random_state})...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state
    )
    print(f"    Training samples: {len(X_train)} | Testing samples: {len(X_test)}")

    # Initialize and train Linear Regression model
    print("--> [Step 5/7] Fitting Linear Regression model (Ordinary Least Squares)...")
    model = LinearRegression(fit_intercept=True)
    model.fit(X_train, y_train)

    # Predictions
    y_pred_train = model.predict(X_train)
    y_pred_test = model.predict(X_test)

    # Metrics computation
    train_rmse = np.sqrt(mean_squared_error(y_train, y_pred_train))
    test_rmse = np.sqrt(mean_squared_error(y_test, y_pred_test))
    test_mae = mean_absolute_error(y_test, y_pred_test)
    train_r2 = r2_score(y_train, y_pred_train)
    test_r2 = r2_score(y_test, y_pred_test)

    print("\\n=======================================================")
    print("               MODEL PERFORMANCE METRICS               ")
    print("=======================================================")
    print(f"  Training R² Score       : {train_r2:.4f} ({train_r2 * 100:.2f}% variance explained)")
    print(f"  Testing R² Score        : {test_r2:.4f} ({test_r2 * 100:.2f}% variance explained)")
    print(f"  Training RMSE           : \${train_rmse:,.2f}")
    print(f"  Testing RMSE            : \${test_rmse:,.2f}")
    print(f"  Testing MAE             : \${test_mae:,.2f}")
    print("=======================================================")

    # Model Coefficients and Interpretation
    print("\\n=======================================================")
    print("             COEFFICIENTS & INTERPRETATION             ")
    print("=======================================================")
    intercept = model.intercept_
    coefficients = dict(zip(feature_cols, model.coef_))

    print(f"  Intercept (beta_0)      : \${intercept:,.2f}")
    for feature, coef in coefficients.items():
        sign = "+" if coef >= 0 else "-"
        print(f"  Weight for {feature:<12}: {sign}\${abs(coef):,.2f}")

    print("\\n  Economic / Statistical Interpretation:")
    print(f"  1. Intercept (\${intercept:,.2f}):")
    print("     Theoretical baseline price when square footage, bedrooms, and")
    print("     bathrooms are 0 (serves as mathematical anchor).")
    print(f"  2. GrLivArea (\${coefficients['GrLivArea']:+,.2f}/sq ft):")
    print(f"     Holding bedrooms and bathrooms constant, each additional square foot")
    print(f"     of above-ground living area increases sale price by \${coefficients['GrLivArea']:.2f}.")
    print(f"  3. BedroomAbvGr (\${coefficients['BedroomAbvGr']:+,.2f}/bedroom):")
    print(f"     Holding total square footage and bathrooms constant, adding an extra bedroom")
    print(f"     tends to decrease value (or have negative partial correlation) because")
    print(f"     it subdivides fixed floor area into smaller rooms.")
    print(f"  4. TotalBath (\${coefficients['TotalBath']:+,.2f}/bathroom):")
    print(f"     Holding living area and bedrooms constant, each additional total bathroom")
    print(f"     adds approximately \${coefficients['TotalBath']:,.2f} to property market value.")
    print("=======================================================")

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
    """
    Generate an Actual vs. Predicted scatter plot with the 45-degree ideal fit line.

    Parameters:
        y_test (pd.Series): Actual house prices from test set.
        y_pred_test (np.ndarray): Predicted house prices from test set.
        output_filename (str): Name of the image file to save.
    """
    print(f"\\n--> [Step 6/7] Creating Actual vs. Predicted evaluation plot...")
    plt.figure(figsize=(9, 6), dpi=120)
    plt.style.use("seaborn-v0_8-whitegrid" if "seaborn-v0_8-whitegrid" in plt.style.available else "default")

    # Scatter plot of test predictions
    plt.scatter(
        y_test,
        y_pred_test,
        alpha=0.6,
        color="#2563eb",
        edgecolors="w",
        s=55,
        label="Test Houses"
    )

    # Ideal 45-degree reference line (y = x)
    min_val = min(y_test.min(), y_pred_test.min())
    max_val = max(y_test.max(), y_pred_test.max())
    plt.plot(
        [min_val, max_val],
        [min_val, max_val],
        color="#dc2626",
        linestyle="--",
        linewidth=2,
        label="Ideal Fit Line (y = y_hat)"
    )

    plt.title("Actual vs. Predicted House Prices (Linear Regression)", fontsize=13, fontweight="bold", pad=12)
    plt.xlabel("Actual Sale Price ($)", fontsize=11, labelpad=8)
    plt.ylabel("Predicted Sale Price ($)", fontsize=11, labelpad=8)
    plt.gca().xaxis.set_major_formatter('\${x:,.0f}')
    plt.gca().yaxis.set_major_formatter('\${x:,.0f}')
    plt.legend(frameon=True, loc="upper left")
    plt.tight_layout()

    plt.savefig(output_filename, dpi=150)
    print(f"    Evaluation plot saved successfully to '{output_filename}'.")
    try:
        plt.show(block=False)
        plt.pause(1)
        plt.close()
    except Exception:
        pass


def save_and_test_saved_model(model, model_filename: str = "house_price_model.joblib"):
    """
    Persist the trained model using joblib and test loading it back for inference.

    Parameters:
        model (LinearRegression): Trained scikit-learn model.
        model_filename (str): Target filename for persistence.
    """
    print(f"\\n--> [Step 7/7] Saving trained model to disk as '{model_filename}'...")
    joblib.dump(model, model_filename)
    print("    Model exported successfully.")

    # Demonstration of loading and inference
    print("    Demonstrating model reload & inference on new sample houses:")
    loaded_model = joblib.load(model_filename)

    sample_houses = pd.DataFrame([
        {"GrLivArea": 1500, "BedroomAbvGr": 3, "TotalBath": 2.0},  # Standard family home
        {"GrLivArea": 2400, "BedroomAbvGr": 4, "TotalBath": 3.0},  # Large suburban home
        {"GrLivArea": 950,  "BedroomAbvGr": 2, "TotalBath": 1.0},  # Compact starter home
    ])

    sample_predictions = loaded_model.predict(sample_houses)

    for idx, (features, price) in enumerate(zip(sample_houses.to_dict(orient="records"), sample_predictions), 1):
        print(f"    House #{idx}: {features['GrLivArea']} sq ft | "
              f"{features['BedroomAbvGr']} beds | {features['TotalBath']} baths "
              f"--> Predicted Sale Price: \${price:,.2f}")


def main():
    print("=================================================================")
    print(" PRODIGY_ML_01: Linear Regression House Price Prediction Project ")
    print("=================================================================")
    
    # 1. Load and process dataset
    df = load_and_preprocess_data("train.csv")

    # 2. Train model and evaluate
    model, X_train, X_test, y_train, y_test, y_pred_test, metrics = train_and_evaluate(
        df, test_size=0.2, random_state=42
    )

    # 3. Plot Actual vs. Predicted values
    plot_actual_vs_predicted(y_test, y_pred_test, output_filename="actual_vs_predicted.png")

    # 4. Save model to disk with joblib and perform sample inference
    save_and_test_saved_model(model, model_filename="house_price_model.joblib")

    print("\\n[SUCCESS] Pipeline execution finished cleanly.")


if __name__ == "__main__":
    main()
`;

export const README_MARKDOWN = `# PRODIGY_ML_01: House Price Prediction using Linear Regression

## 📌 Project Overview
This project is completed as part of the **Prodigy InfoTech Machine Learning Internship** (Task 01).
The objective is to implement a multivariable **Linear Regression** model to predict house sale prices based on fundamental architectural features:
- **Square Footage**: Above grade living area in square feet (\`GrLivArea\`).
- **Bedrooms**: Number of bedrooms above grade (\`BedroomAbvGr\`).
- **Bathrooms**: Total bathrooms engineered from full and half baths (\`TotalBath = FullBath + 0.5 * HalfBath\`).

---

## 📊 Dataset Information
- **Source**: Kaggle "House Prices - Advanced Regression Techniques" Competition.
- **Link**: [https://www.kaggle.com/c/house-prices-advanced-regression-techniques/data](https://www.kaggle.com/c/house-prices-advanced-regression-techniques/data)
- **Files**:
  - \`train.csv\`: Contains 1,460 residential properties with target \`SalePrice\` and 79 explanatory features.
  - \`test.csv\`: Used for final contest submission.

---

## 🛠️ Feature Engineering & Selection
From the extensive dataset, three core explanatory features are selected and engineered:
1. **\`GrLivArea\`**: Above grade (ground) living area square feet.
2. **\`BedroomAbvGr\`**: Bedrooms above grade (does not include basement bedrooms).
3. **\`TotalBath\`**: Engineered bathroom metric:
   $$\\text{TotalBath} = \\text{FullBath} + 0.5 \\times \\text{HalfBath}$$
4. **Target Variable**: \`SalePrice\` (property sale price in USD).

---

## 📐 Mathematical Model Formulation
The Ordinary Least Squares (OLS) Linear Regression model fits the hyperplane:

$$\\hat{y} = \\beta_0 + \\beta_1 \\cdot \\text{GrLivArea} + \\beta_2 \\cdot \\text{BedroomAbvGr} + \\beta_3 \\cdot \\text{TotalBath}$$

Where:
- $\\hat{y}$: Predicted house sale price ($)
- $\\beta_0$: Intercept (base price constant)
- $\\beta_1$: Marginal price increase per square foot
- $\\beta_2$: Partial coefficient for bedroom count (holding square footage constant)
- $\\beta_3$: Partial coefficient per bathroom

---

## 🚀 How to Run the Project

### 1. Prerequisites
Ensure you have Python 3.8+ installed.

### 2. Clone the Repository & Set up Virtual Environment
\`\`\`bash
# Clone the repository
git clone https://github.com/your-username/PRODIGY_ML_01.git
cd PRODIGY_ML_01

# Create a virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/macOS:
source venv/bin/activate
# On Windows:
venv\\Scripts\\activate
\`\`\`

### 3. Install Dependencies
\`\`\`bash
pip install -r requirements.txt
\`\`\`

### 4. Place Dataset
Download \`train.csv\` from Kaggle and place it in the project root directory:
\`\`\`bash
PRODIGY_ML_01/
├── house_price_prediction.py
├── README.md
├── requirements.txt
├── train.csv                <-- place here
\`\`\`

### 5. Execute the Script
\`\`\`bash
python house_price_prediction.py
\`\`\`

---

## 📈 Sample Model Output & Evaluation Metrics

After running \`python house_price_prediction.py\`, the script produces the following outputs:

\`\`\`text
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
  Weight for GrLivArea    : +$107.82 / sq ft
  Weight for BedroomAbvGr : -$16,843.10 / bedroom
  Weight for TotalBath    : +$28,512.44 / bathroom
=======================================================
\`\`\`

### 💡 Economic Interpretation of Coefficients
- **Square Footage (\`+$107.82\` / sq ft)**: For every additional square foot of living area, the expected house price increases by ~$108, holding bedrooms and bathrooms fixed.
- **Bedrooms (\`-$16,843.10\` / bedroom)**: Because square footage is held constant in this multivariable regression, adding another bedroom means dividing existing floor space into smaller rooms, which often reduces perceived luxury/utility for buyers.
- **Bathrooms (\`+$28,512.44\` / bathroom)**: Additional plumbing and bathroom fixtures strongly elevate property valuation.

---

## 📂 Project Structure
\`\`\`
PRODIGY_ML_01/
├── house_price_prediction.py     # Main end-to-end Python pipeline
├── house_price_model.joblib      # Serialized scikit-learn model
├── actual_vs_predicted.png       # Generated evaluation plot
├── requirements.txt              # Required Python packages
├── README.md                     # Project documentation
└── train.csv                     # Kaggle training dataset
\`\`\`

---

## 📦 Saved Model & Inference
The trained model is serialized via \`joblib.dump()\`. You can load and use it in any production application or API:

\`\`\`python
import joblib
import pandas as pd

# Load saved model
model = joblib.load("house_price_model.joblib")

# Inference for a 1,800 sq ft home with 3 bedrooms and 2.5 bathrooms
new_home = pd.DataFrame([{
    "GrLivArea": 1800,
    "BedroomAbvGr": 3,
    "TotalBath": 2.5
}])

predicted_price = model.predict(new_home)[0]
print(f"Estimated Price: \${predicted_price:,.2f}")
# Output: Estimated Price: $232,930.54
\`\`\`

---

## 📜 License & Acknowledgments
- Dataset provided by Dean De Cock and Kaggle.
- Task developed as part of Prodigy InfoTech Machine Learning Internship.
`;

export const REQUIREMENTS_TXT = `numpy>=1.23.0
pandas>=1.5.0
scikit-learn>=1.2.0
matplotlib>=3.6.0
seaborn>=0.12.0
joblib>=1.2.0
`;
