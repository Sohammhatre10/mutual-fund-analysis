# Mutual Fund Analysis AI

AI-Driven Mutual Fund Analytics Platform
**Tech Stack:** React • FastAPI • Together AI (Llama-3) • MongoDB • Kaggle Dataset

## Overview

Understanding mutual funds can be challenging for new investors due to scattered information, complex ratios, and inconsistent reporting formats. This project brings all key insights into a unified interface, enabling users to explore, compare, and interpret mutual funds through structured analytics and AI-generated explanations.

The system uses publicly available datasets sourced from Kaggle, a FastAPI backend for data processing, a React frontend for interaction, and Llama-3 via the Together API to generate clear summaries, risk insights, and comparisons.

---

## Key Features

* **Modern React UI** for fund search, comparison, and insight generation
* **FastAPI backend** for data processing, analytics, and routing
* **AI-powered interpretation** using Together API (Llama-3 free tier)
* **Mutual fund dataset imported from Kaggle** and stored in MongoDB
* Endpoints for:

  * Fund retrieval
  * Trend and performance analysis
  * AI-assisted insights
* **Persistent storage** for portfolios, interactions, and user selections

---

## Architecture

### Frontend (React)

* Displays mutual fund details, dashboards, and AI explanations
* Sends user inputs and fund selections to FastAPI
* Provides comparison views and analysis results

### Backend (FastAPI + Python)

* Processes and cleans Kaggle dataset
* Computes key metrics such as:

  * Returns
  * Volatility
  * Risk ratios
  * Rolling averages
* Integrates with Together API for Llama-3 insights
* Exposes REST APIs for frontend usage

### Database (MongoDB)

* Stores cleaned mutual fund entries
* Stores user interactions and saved portfolios

### AI Layer (Together API – Llama-3)

* Generates:

  * Plain-language explanations
  * Risk summaries
  * Comparative insights
  * Overall fund interpretations
* AI is used only for explanation. All numeric analytics are computed independently in Python.

---

## Dataset

A publicly available mutual fund dataset from Kaggle is used. Examples:

* “Indian mutual funds dataset”
* “Mutual fund NAV history”
* “Mutual fund performance dataset”

The dataset is cleaned using Python scripts and imported into MongoDB for efficient queries and metric computations.

---

## API Endpoints

### **GET /funds**

Retrieve all mutual fund entries.

### **GET /funds/{id}**

Retrieve a specific fund and its detailed metrics.

### **POST /analyze**

Compute analytics for one or more selected funds.

### **POST /ai/insight**

Generate AI-based explanations or comparative insights using Llama-3.

### **POST /portfolio/save**

Save a portfolio or user selections into MongoDB.

---

## Setup Instructions

### Backend

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

Make sure to:

* Clone the repository
* Add your Together API Key to environment variables
* Configure MongoDB connection in `.env`

### Frontend

```bash
npm install
npm run dev
```

Run the React development server from the `frontend` directory.

### Database

* Install MongoDB locally **or** use MongoDB Atlas
* Import the Kaggle dataset using a Python script or MongoDB Compass
* Add your database URI to the backend `.env` file

---

## AI Usage Disclosure

Llama-3 through the Together API is used only for:

* Summaries
* Risk analysis
* Comparative insights
* Natural-language interpretation

The platform does not generate financial advice. All numerical calculations are performed directly in Python.

---

## Project Status

The MVP includes:

* Dataset ingestion
* Core analytics
* MongoDB integration
* AI-generated explanatory insights
* Fully functional frontend

Planned enhancements:

* Portfolio simulation
* Advanced risk modeling
* User accounts and personalization

---

## License

This project is intended for educational and ideathon purposes. It should not be used as financial advice.
✔ A folder structure diagram
✔ API documentation in Swagger/OpenAPI format
