//import {CandlestickChart} from 'react-native-wagmi-charts';
import normalizeCandleData from '../utils/normalizeCandleData';
import { formatDateAsISODate } from '../utils/formatDate';


export default function StockChart({startDate, endDate, stockData, patternResults}) {
    if (!stockData?.["Time Series (Daily)"] || !startDate || !endDate) {
        return null;
    }

    const filteredArrayOfCandlestickObjects = normalizeCandleData(stockData, formatDateAsISODate(startDate), formatDateAsISODate(endDate));

    if (filteredArrayOfCandlestickObjects.length === 0) {
        return null;
    }
    return (
        <CandlestickChart.Provider data={filteredArrayOfCandlestickObjects}>
            <CandlestickChart>
                <CandlestickChart.Candles/>
                <CandlestickChart.Crosshair/>
            </CandlestickChart>
            <CandlestickChart.PriceText type="open" />
            <CandlestickChart.PriceText type="high" />
            <CandlestickChart.PriceText type="low" />
            <CandlestickChart.PriceText type="close" />
            <CandlestickChart.DatetimeText />
        </CandlestickChart.Provider>
    );
}
