
export interface PriceActionSummary {
    symbol: string;
    summary: string;
}

export const priceActionService = {
    getSummary(symbol: string): PriceActionSummary{
        return {
            symbol: symbol,
            summary: "Apple rose 1.20% from its previous close and finished near the session's high. Trading volume exceeded the previous session, while the day's trading range was wider."
        }
    },
}