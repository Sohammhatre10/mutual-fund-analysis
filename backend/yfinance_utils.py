import yfinance as yf

def fetch_yfinance_data(ticker: str):
    """
    Fetches real-time stock information for a given ticker from yfinance.
    """
    try:
        stock = yf.Ticker(ticker)
        info = stock.info
        if info:
            # Extract relevant information
            return {
                "symbol": info.get("symbol"),
                "shortName": info.get("shortName"),
                "currentPrice": info.get("currentPrice"),
                "previousClose": info.get("previousClose"),
                "marketCap": info.get("marketCap"),
                "sector": info.get("sector"),
                "industry": info.get("industry"),
            }
        else:
            print(f"No yfinance data found for ticker: {ticker}")
            return None
    except Exception as e:
        print(f"Error fetching yfinance data for {ticker}: {e}")
        return None
