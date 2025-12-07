Mutual Fund Analysis AI

AI-driven Mutual Fund Analytics Platform
React Frontend | Python FastAPI Backend | Together AI (Llama-3) | MongoDB | Kaggle Dataset

Overview

Mutual fund data is often difficult for first-time investors to interpret due to scattered information, technical ratios, and inconsistent reporting formats. This project provides a unified interface that allows users to explore, compare, and understand mutual funds through structured analytics and AI-generated insights.
The system uses real datasets sourced from Kaggle, a FastAPI backend for data processing, a React-based UI for interaction, and Llama-3 (via Together API) for intelligent summarisation, recommendations, and plain-language explanations.

Key Features

Clean React frontend for fund search, comparison, and insight generation

Python FastAPI backend for analytics, preprocessing, and API routing

AI agent powered by Together API (Llama-3 free tier) for explanation and risk assessment

Mutual fund datasets imported from Kaggle and stored in MongoDB

Endpoints for fund metrics, trend analysis, and AI-assisted interpretation

Persistent database layer for portfolio storage and user interactions

Architecture

Frontend (React)

Displays fund information, comparison dashboards, and AI-generated responses

Sends user queries and fund selections to FastAPI

Backend (FastAPI + Python)

Imports and cleans Kaggle mutual fund datasets

Computes performance metrics (returns, volatility, risk ratios, rolling averages)

Integrates with Together API for Llama-3-based insights

Provides REST APIs for the frontend

Database (MongoDB)

Stores cleaned dataset entries

Stores user queries, interaction logs, preference profiles (if required)

AI Layer (Together API)

Generates explanations, risk summaries, comparison insights, and investment perspectives

Ensures outputs are non-deterministic, transparent, and tuned for clarity

Dataset

A publicly available mutual fund dataset from Kaggle is used.
Example search terms:

“Indian mutual funds dataset”

“Mutual fund NAV history”

“Mutual fund performance dataset”

After download, the dataset is cleaned and imported into MongoDB for efficient querying.

API Endpoints

GET /funds – Retrieve all mutual funds
GET /funds/{id} – Retrieve one fund and its metrics
POST /analyze – Compute analytics for selected funds
POST /ai/insight – Generate AI-driven explanations via Together API
POST /portfolio/save – Store user selections in MongoDB

Setup Instructions
Backend

Clone the repository

Install dependencies

pip install -r requirements.txt

Add Together API key to environment variables

Run FastAPI

uvicorn main:app --reload

Frontend

Navigate to frontend directory

Install dependencies

npm install

Start development server

npm run dev

Database

Install MongoDB locally or use MongoDB Atlas

Import Kaggle data using a Python script or MongoDB Compass

Ensure .env contains database URI

AI Usage Disclosure

Llama-3 via Together API is used for:

Text summarisation

Risk explanation

Comparative insights

Natural-language interpretation of fund metrics

All analytic calculations are performed independently in Python; AI is used only for explanation, not for financial advice.

Project Status

MVP includes dataset ingestion, basic analytics, AI-generated summaries, and a functioning UI.
Next steps include portfolio simulation, advanced risk modeling, and user account integration.

License

This project is released for educational and ideathon purposes only. It does not provide financial advice.
