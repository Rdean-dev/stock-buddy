import {getStockData} from "./stock-data.service.js"
import normalizeCandleData from "../utils/normalizeCandleData.js"
import {generatePriceSummary} from "../services/ai-summary.service.js";

export interface PriceActionSummary {
    symbol: string;
    summary: string;
}

export async function getSummary(symbol: string): Promise<PriceActionSummary>{
    
    const stockData = await getStockData(symbol);

    if (!stockData){
        throw new Error("Historical stock data is unavailable");
    }

    const normalizedData = normalizeCandleData(stockData, 2)

    const latestSession = normalizedData[0];
    const previousSession = normalizedData[1];

    if (!latestSession || !previousSession) {
        throw new Error("At least two trading sessions are required");
    }

    const priceChange = latestSession.close - previousSession.close;

    const priceChangePercent = previousSession.close !== 0 ? (priceChange / previousSession.close) * 100 : null;

    const volumeChangePercent = previousSession.volume!== 0 ? ((latestSession.volume - previousSession.volume) / previousSession.volume) * 100 : null;

    const sessionRange = latestSession.high - latestSession.low;

    const previousSessionRange = previousSession.high - previousSession.low;

    const closePositionPercent = sessionRange !== 0 ? ((latestSession.close - latestSession.low) / sessionRange) * 100 : null;




    const metrics = {
        sessionDate: latestSession.date,
        previousSessionDate: previousSession.date,
        open: latestSession.open,
        high: latestSession.high,
        low: latestSession.low,
        close: latestSession.close,
        volume: latestSession.volume,
        previousClose: previousSession.close,
        priceChange,
        priceChangePercent,
        volumeChangePercent,
        sessionRange,
        previousSessionRange,
        closePositionPercent,
    }

    console.log({
        latestVolume: latestSession.volume,
        previousVolume: previousSession.volume,
        volumeChangePercent,
        metrics,
    });
    const summary = await generatePriceSummary(symbol, metrics);
    
    return {
        symbol,
        summary,
    }
}

