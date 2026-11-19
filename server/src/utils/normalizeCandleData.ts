import type {AlphaVantageDailyResponse, Candle} from '../types/stock.js';


export default function normalizeCandleData(stockData: AlphaVantageDailyResponse, limit?: number): Candle[] {
    const initialData = stockData["Time Series (Daily)"];

    const arrayOfCandlestickObjects = Object.entries(initialData).sort(([dateA], [dateB]) => dateB.localeCompare(dateA)).slice(0, limit);

    const candles: Candle[] = [];

    arrayOfCandlestickObjects.forEach((dataEntry) => {
        const entryDate = dataEntry[0];
        const timestamp = new Date(entryDate).getTime();
        const open = parseFloat(dataEntry[1]['1. open']);
        const high = parseFloat(dataEntry[1]['2. high']);
        const low = parseFloat(dataEntry[1]['3. low']);
        const close = parseFloat(dataEntry[1]['4. close']);
        const volume = parseInt(dataEntry[1]['5. volume'], 10);

        
        candles.push({'date': entryDate, 'timestamp': timestamp, 'open': open, 'high': high, 'low': low, 'close': close, 'volume': volume})
        
        
    });
    
    return candles;

}