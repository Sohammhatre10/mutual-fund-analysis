import yfinance as yf
import pandas as pd
import numpy as np


def extract_constituents(filepath='constituents.csv'):
    """
    Extracts data from the constituents.csv file.
    """
    try:
        df = pd.read_csv(filepath)
        print(f"Successfully extracted {len(df)} rows from {filepath}")
        return df
    except FileNotFoundError:
        print(f"Error: The file {filepath} was not found.")
        return None
    except Exception as e:
        print(f"An error occurred during extraction: {e}")
        return None
