export default function normalizeCandleData(stockData, startDate, endDate) {
    const initialData = stockData["Time Series (Daily)"];

    const arrayOfCandlestickObjects = Object.entries(initialData);

    const filteredArrayOfCandlestickObjects = [];

    arrayOfCandlestickObjects.toReversed().forEach((dataEntry) => {
        const entryDate = dataEntry[0];
        const timestamp = new Date(entryDate).getTime();
        const open = parseFloat(dataEntry[1]['1. open']);
        const high = parseFloat(dataEntry[1]['2. high']);
        const low = parseFloat(dataEntry[1]['3. low']);
        const close = parseFloat(dataEntry[1]['4. close']);
        const volume = parseInt(dataEntry[1]['5. volume']);

        if (entryDate >= startDate && entryDate <= endDate){
            filteredArrayOfCandlestickObjects.push({'date': entryDate, 'timestamp': timestamp, 'open': open, 'high': high, 'low': low, 'close': close, 'volume': volume})
        }
        
    });

    return filteredArrayOfCandlestickObjects;
}