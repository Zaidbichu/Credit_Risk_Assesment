# Credit Risk Assessment

A credit risk prediction application that evaluates the likelihood of loan default using a trained machine learning model and exposes the prediction through a FastAPI backend with a simple frontend interface.

## Overview

This project loads a pre-trained credit risk model and threshold from serialized pickle files, then predicts whether a loan applicant is likely to default based on financial and personal attributes. It includes:

- A FastAPI REST API for predictions
- A browser-based form for inputting application details
- A trained ML model and threshold for classification
- Static HTML/CSS/JavaScript frontend assets

## Features

- Accepts applicant and loan details such as age, income, home ownership, employment length, loan amount, interest rate, and credit history
- Computes the probability of default
- Classifies applicants as "Low Risk" or "High Risk"
- Serves a web UI from the `static` directory

## Project Structure

```text
.
├── __pycache__/
├── static/
│   ├── index.html
│   ├── script.js
│   └── style.css
├── best_threeshold.pkl
├── credit_risk_dataset.csv
├── credit_risk_model.pkl
├── main.py
├── requirements.txt
└── README.md
```

## Tech Stack

- Python
- FastAPI
- Pydantic
- Pandas
- scikit-learn
- XGBoost
- Joblib
- HTML/CSS/JavaScript

## Setup

1. Clone the repository:

```bash
git clone https://github.com/Zaidbichu/Credit_Risk_Assesment.git
cd Credit_Risk_Assesment
```

2. Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Run the application:

```bash
python main.py
```

Or with Uvicorn directly:

```bash
uvicorn main:app --reload
```

5. Open the app in your browser:

```text
http://localhost:8000
```

## API Usage

The app exposes a `POST /predict` endpoint.

### Request Body

```json
{
  "person_age": 35,
  "person_income": 75000,
  "person_home_ownership": "RENT",
  "person_emp_length": 5,
  "loan_intent": "PERSONAL",
  "loan_grade": "B",
  "loan_amnt": 12000,
  "loan_int_rate": 8.5,
  "loan_percent_income": 0.2,
  "cb_person_default_on_file": "N",
  "cb_person_cred_hist_length": 6
}
```

### Example Request

```bash
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "person_age": 35,
    "person_income": 75000,
    "person_home_ownership": "RENT",
    "person_emp_length": 5,
    "loan_intent": "PERSONAL",
    "loan_grade": "B",
    "loan_amnt": 12000,
    "loan_int_rate": 8.5,
    "loan_percent_income": 0.2,
    "cb_person_default_on_file": "N",
    "cb_person_cred_hist_length": 6
  }'
```

### Example Response

```json
{
  "default_probability": 0.1345,
  "default_prediction": 0,
  "threshold": 0.19,
  "Result": "Low Risk"
}
```

## Notes

- The model and threshold are loaded at application startup from `credit_risk_model.pkl` and `best_threeshold.pkl`.
- The frontend is served from the `static` directory and provides user-friendly loan evaluation.
- The dataset file `credit_risk_dataset.csv` can be used for training, validation, or exploratory analysis.

## License

This project does not currently specify a license. If you plan to distribute or reuse it publicly, it is recommended to add an appropriate license file.
