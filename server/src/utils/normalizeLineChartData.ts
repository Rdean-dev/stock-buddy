import type {AlphaVantageDailyResponse, LineChartPoint} from '../types/stock';


export default function normalizeLineChartData(stockData: AlphaVantageDailyResponse): LineChartPoint[] {

    const initialData = stockData["Time Series (Daily)"];

    const arrayOfLineChartObjects = Object.entries(initialData);

    const filteredArrayOfLineChartObjects: LineChartPoint[] = [];

    arrayOfLineChartObjects.toReversed().slice(-7).forEach((dataEntry) => {
        const entryDate = dataEntry[0];
        const timestamp = new Date(entryDate).getTime();
        
        const close = parseFloat(dataEntry[1]['4. close']);
        

        
        filteredArrayOfLineChartObjects.push({'timestamp': timestamp, 'value': close})
        
        
    });
    
    return filteredArrayOfLineChartObjects;

};