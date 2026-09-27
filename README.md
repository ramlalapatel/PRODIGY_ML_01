# PRODIGY_ML_01: House Price Prediction using Linear Regression

## 📌 Project Overview
This project is completed as part of the **Prodigy InfoTech Machine Learning Internship** (Task 01).
The objective is to implement a multivariable **Linear Regression** model to predict house sale prices based on fundamental architectural features:
- **Square Footage**: Above grade living area in square feet (`GrLivArea`).
- **Bedrooms**: Number of bedrooms above grade (`BedroomAbvGr`).
- **Bathrooms**: Total bathrooms engineered from full and half baths (`TotalBath = FullBath + 0.5 * HalfBath`).

---

## 📊 Dataset Information
- **Source**: Kaggle "House Prices - Advanced Regression Techniques" Competition.
- **Link**: [https://www.kaggle.com/c/house-prices-advanced-regression-techniques/data](https://www.kaggle.com/c/house-prices-advanced-regression-techniques/data)
- **Files**:
  - `train.csv`: Contains residential property sales in Ames, Iowa with target `SalePrice`.

---

## 🚀 How to Run

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Execute Script
```bash
python house_price_prediction.py
```

---

## 📈 Model Performance & Metrics
```text
=======================================================
               MODEL PERFORMANCE METRICS               
=======================================================
  Testing R² Score        : 0.6341 (63.41% variance explained)
  Testing RMSE            : $49,856.32
  Testing MAE             : $33,521.14
=======================================================
```
