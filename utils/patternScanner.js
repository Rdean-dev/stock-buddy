import data from "../data/mockDailyIBMData.json" with {type: "json"};

const scanPatterns = (startDate, endDate, selectedPatterns, stockData) => {
    const initalData = stockData["Time Series (Daily)"];

    const arrayOfCandlestickObjects = Object.entries(initalData);

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

    const results = [];

    filteredArrayOfCandlestickObjects.forEach((candle, index) => {
        selectedPatterns.forEach((pattern) => {
            if (pattern === "Doji") {
                if (isDoji(candle)) {
                    results.push(candle);
                }
            }
        });
    });

    return results;
    
    

    
    

    


    

}

const startDate = "2026-06-16";

const endDate = '2026-09-15';

const selectedPatterns = ['Doji']

scanPatterns(startDate, endDate, selectedPatterns, data);