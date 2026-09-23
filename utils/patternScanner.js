import { isDoji, isHammer, isMorningStar, isBearishEngulfing, isBullishEngulfing } from './patternCalculations.js';

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
        Doji: {
            detector: isDoji,
            candlesRequired: 1
        },
        Hammer: {
            detector: isHammer,
            candlesRequired: 1
        },
        'Bullish Engulfing': {
            detector: isBullishEngulfing,
            candlesRequired: 2
        },
        'Bearish Engulfing': {
            detector: isBearishEngulfing,
            candlesRequired: 2
        },
        'Morning Star': {
            detector: isMorningStar,
            candlesRequired: 3,
        }
    };

    const results = {};

    selectedPatterns.forEach((pattern) => {
        results[pattern] = [];
    });

    filteredArrayOfCandlestickObjects.forEach((candle, index) => {
        selectedPatterns.forEach((pattern) => {
            const patterns = patternDetectors[pattern];
            const detector = patterns.detector;
            const candlesRequired = patterns.candlesRequired;
            const previousCandle = filteredArrayOfCandlestickObjects[index - 1];
            const firstCandle = filteredArrayOfCandlestickObjects[index - 2];


            if (index >= 2 && candlesRequired === 3 && detector(firstCandle, previousCandle, candle)) {
                results[pattern].push(candle);
            }
            else if (index >= 1 && candlesRequired === 2 && detector(previousCandle, candle)) {
                results[pattern].push(candle);
            }
            else if (candlesRequired === 1 && detector(candle)) {
                results[pattern].push(candle);
            }
            
        });
    });

    console.log(results);
    return results;
    
    

    
    

    


    

}

