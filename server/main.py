from fastapi import FastAPI
from pydantic import BaseModel
import datetime, numpy as np

app = FastAPI(title="AI Trading Backend Demo")

class MarketRequest(BaseModel):
    symbol: str
    features: list

@app.get("/health")
def health():
    return {"status": "ok", "time": datetime.datetime.utcnow().isoformat()+"Z"}

@app.get("/indicators/{symbol}")
def indicators(symbol: str):
    # Demo: replace with real NSE/data-vendor calls
    return {
        "symbol": symbol,
        "time": datetime.datetime.utcnow().isoformat()+"Z",
        "dma44_rising": True,
        "oi": 123456,
        "volume": 987654,
        "rsi": 58.3,
        "ma_short": 150.12,
        "ma_long": 145.3
    }

@app.post("/predict")
def predict(req: MarketRequest):
    features = req.features or []
    dma_flag = features[0] if len(features) > 0 else 0
    rsi = features[3] if len(features) > 3 else 50
    buy = min(1.0, 0.5 + 0.3 * (1 if dma_flag else 0) - 0.002*(rsi-50))
    sell = 1.0 - buy
    hold = 0.0
    recommendation = "BUY" if buy > 0.55 else ("SELL" if sell > 0.55 else "HOLD")
    return {
        "symbol": req.symbol,
        "timestamp": datetime.datetime.utcnow().isoformat()+"Z",
        "buy_prob": round(buy, 4),
        "sell_prob": round(sell, 4),
        "hold_prob": round(hold, 4),
        "recommendation": recommendation
    }
