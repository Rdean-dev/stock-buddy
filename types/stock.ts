export type WatchlistStock = {
    symbol: string;
    name: string;
};

export type StockProfile = {
    price: number;
    change: number;
    changePercentage: number;
    image: string;
    volume: number;
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

export type PatternName = 
    | 'Doji' | 'Hammer' 
    | 'Morning Star' | 'Evening Star' 
    | 'Bearish Engulfing' | 'Bullish Engulfing' 
    | 'Shooting Star' | 'Hanging Man' 
    | 'Bullish Harami' | 'Bearish Harami'
    | 'Piercing Line' | 'Dark Cloud Cover' 
    | 'Three White Soldiers' |'Three Black Crows' | 'Inverted Hammer';


export type ShapeName = | 'diamond' | 'square' | 'star' | 'triangle' | 'circle';

export type MarketState= {
    is_market_open: boolean;
    time_to_open: string;
    time_to_close: string;
}

export type LineChartPoint = {
    timestamp: number,
    value: number,
};
