export type WatchlistStock = {
    symbol: string;
    name: string;
};

export type StockProfile = {
    price: number;
    change: number;
    changePercentage: number;
    image: string;
};

export type AlphaVantageDailyEntry = {
    '1. open': string,
    '2. high': string,
    '3. low': string,
    '4. close': string,
    '5. volume': string,
};

export type AlphaVantageDailyResponse = {
    'Time Series (Daily)' : Record<string, AlphaVantageDailyEntry>
};

export type Candle = {
    date: string,
    timestamp: number,
    open: number,
    high: number,
    low: number,
    close: number,
    volume: number,
};