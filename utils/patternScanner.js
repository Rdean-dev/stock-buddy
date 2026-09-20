import { isDoji, isHammer } from './patternCalculations.js';

export default function scanPatterns (startDate, endDate, selectedPatterns, stockData) {
    
    const initialData = stockData["Time Series (Daily)"];

    const arrayOfCandlestickObjects = Object.entries(initialData);

    const filteredArrayOfCandlestickObjects = [];

    arrayOfCandlestickObjects.toReversed().forEach((dataEntry) => {
        const entryDate = dataEntry[0];
        const open = parseFloat(dataEntry[1]['1. open']);
        const high = parseFloat(dataEntry[1]['2. high']);
        const low = parseFloat(dataEntry[1]['3. low']);
        const close = parseFloat(dataEntry[1]['4. close']);
        const volume = parseInt(dataEntry[1]['5. volume']);

        if (entryDate >= startDate && entryDate <= endDate){
            filteredArrayOfCandlestickObjects.push({'date': entryDate, 'open': open, 'high': high, 'low': low, 'close': close, 'volume': volume})
        }
        
    });

    const patternDetectors = {
        Doji: isDoji,
        Hammer: isHammer,
    };

    const results = {};

    selectedPatterns.forEach((pattern) => {
        results[pattern] = [];
    });

    filteredArrayOfCandlestickObjects.forEach((candle) => {
        selectedPatterns.forEach((pattern) => {
            const detector = patternDetectors[pattern];

            if (detector(candle)) {
                results[pattern].push(candle);
            }
            
        });
    });

    console.log(results);
    return results;
    
    

    
    

    


    

}

