import {CandlestickChart, useCandlestickChart} from 'react-native-wagmi-charts';
import normalizeCandleData from '../utils/normalizeCandleData';
import { formatDateAsISODate} from '../utils/formatDate';
import { StyleSheet, View, Text, Pressable} from 'react-native';
import  Marker  from "./Marker";
import { patternAnnotationVisuals } from "../constants/patternAnnotationVisuals";
import {useState} from 'react';
import { theme } from "../constants/theme";
import type { PatternName, Candle, AlphaVantageDailyResponse, WatchlistStock } from "../types/stock";

type XAxisProps = {
    candlestickData: Candle[];
    width: number;
}

type StockChartProps = {
    startDate: Date;
    endDate: Date;
    stockData: AlphaVantageDailyResponse;
    dateInterval: (months: number) => void;
    symbol: string;
    annotations?: React.ReactNode;
    legend?: React.ReactNode;
    
}

function YAxis() {
    const yAxisArray = [];
    const {domain} = useCandlestickChart();
    const maxPrice = Math.ceil(domain[1]);
    const minPrice = Math.floor(domain[0]);

    const range = maxPrice - minPrice;
    const interval = Math.ceil(range / 5);

    for (let i = 0; i <= 5; i++) {
        const axisNumber = maxPrice - (interval * i);
        yAxisArray.push(axisNumber);
    }

    return(
        <View style={styles.yAxis}>
            {yAxisArray.map((axisNumber, index) => (
                <Text 
                    key={index}
                    style={styles.yAxisLabel}
                >
                    {axisNumber.toFixed(2)}
                </Text>
            ))}
        </View>
    );



}

function XAxis({candlestickData, width}: XAxisProps){
    const {step} = useCandlestickChart();
    const labelWidth = 50;
    
    const xAxisArray = [];
    const xAxisLabels = candlestickData.map(candle => {
        const date = new Date(candle.date);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC',});
    });

    

    if (candlestickData.length > 30){
        const interval = (candlestickData.length - 1) / 5
        for (let i = 0; i <= 5; i ++) {
            const index = Math.round(i * interval);
            xAxisArray.push({label: xAxisLabels[index], candleIndex: index});
            
        }
    }else{
        xAxisArray.push(...xAxisLabels.map((label, index) => (
            {label, candleIndex: index}
        )));
    }
    return(
        <View style={[styles.xAxis,{width}, {padding: 20}]}>
            {xAxisArray.map((label) => {
                const xPosition = step * label.candleIndex + step / 2;
                return (
                    <Text 
                        key={label.candleIndex}
                        style={[styles.xAxisLabel, {position: 'absolute', left: xPosition - labelWidth / 2, width: labelWidth, textAlign: 'center',}]}
                    >
                        {label.label}
                    </Text>
                );
            })}
        </View>
    );

}


export default function StockChart({startDate, endDate, stockData, dateInterval, symbol,  annotations, legend}: StockChartProps) {
    const [innerWidth, setInnerWidth] = useState(0);
    
    if (!stockData?.["Time Series (Daily)"] || !startDate || !endDate) {
        return null;
    }


    const filteredArrayOfCandlestickObjects = normalizeCandleData(stockData, formatDateAsISODate(startDate), formatDateAsISODate(endDate));
    
    
    
    const yAxisWidth = 60;
    const candleChartWidth = innerWidth - yAxisWidth;
    

    if (filteredArrayOfCandlestickObjects.length === 0) {
        return null;
    }

    



    
    return (
        <View style={styles.chartContainer}>
            <Text style={styles.chartHeader}>{symbol}</Text>
            <View style={styles.dateSection}>
                <Pressable onPress={() => dateInterval(1)}>{({ hovered, pressed }) => (<View style={[styles.dateButton,(hovered || pressed) && styles.dateButtonActive]}><Text style={styles.dateText}>1m</Text></View>)}</Pressable>
                <Pressable onPress={() => dateInterval(3)}>{({ hovered, pressed }) => (<View style={[styles.dateButton,(hovered || pressed) && styles.dateButtonActive]}><Text style={styles.dateText}>3m</Text></View>)}</Pressable>
                <Pressable onPress={() => dateInterval(6)}>{({ hovered, pressed }) => (<View style={[styles.dateButton,(hovered || pressed) && styles.dateButtonActive]}><Text style={styles.dateText}>6m</Text></View>)}</Pressable>
                <Pressable onPress={() => dateInterval(12)}>{({ hovered, pressed }) => (<View style={[styles.dateButton,(hovered || pressed) && styles.dateButtonActive]}><Text style={styles.dateText}>1Y</Text></View>)}</Pressable>
            </View>
            <CandlestickChart.Provider data={filteredArrayOfCandlestickObjects}>
            <View style={styles.chartStyle} onLayout={(event) => setInnerWidth(event.nativeEvent.layout.width)}>
                {candleChartWidth > 0 &&
                <>
                    <View style={{flexDirection: 'column'}}>
                    <CandlestickChart width={candleChartWidth} height={350}>
                        <CandlestickChart.Candles/>
                        <CandlestickChart.Crosshair>
                            <CandlestickChart.Tooltip/>
                        </CandlestickChart.Crosshair>
                        {annotations}
                    </CandlestickChart>
                    
                    <XAxis candlestickData={filteredArrayOfCandlestickObjects}  width={candleChartWidth}/>
                    
                </View>
                
                <YAxis />
                </>
                }
                
            </View>
                <View style={styles.inspectionSection}>

                    <CandlestickChart.DatetimeText
                        options={{
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        }}
                        style={styles.dateValue}
                    />
                    <View style={styles.priceRow}>
                        <View style={styles.priceItem}>
                            <Text style={styles.priceLabel}>Open</Text>
                            <CandlestickChart.PriceText type="open" style={styles.priceValue}/>
                        </View>

                        <View style={styles.priceItem}>
                            <Text style={styles.priceLabel}>High</Text>
                            <CandlestickChart.PriceText type="high" style={styles.priceValue}/>
                        </View>

                        <View style={styles.priceItem}>
                            <Text style={styles.priceLabel}>Low</Text>
                            <CandlestickChart.PriceText type="low" style={styles.priceValue}/>
                        </View>

                        <View style={styles.priceItem}>
                            <Text style={styles.priceLabel}>Close</Text>
                            <CandlestickChart.PriceText type="close" style={styles.priceValue}/>
                        </View>

                    </View>

                    <View>
                        {legend}
                    </View>

                </View>
                
            </CandlestickChart.Provider >
        </View>
        
       
    );
}

const styles = StyleSheet.create({
    inspectionSection: {
        width: '100%',
        borderTopWidth: 1,
        borderTopColor: '#e5e5e5',
        paddingTop: 12,
        marginTop: 10,
    },

    dateValue: {
        fontSize: 13,
        color: '#777',
        marginBottom: 12,
    },

    dateSection:{
        paddingHorizontal: 5,
        paddingVertical: 6,
        flexDirection: 'row',
        gap: theme.spacing.formRowgap,
        alignSelf: 'flex-start',

    },
    dateButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6,
    },

    dateButtonActive: {
        backgroundColor: '#eeeeee',
    },

    dateText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#555',
    },
    chartStyle: {
        flexDirection: 'row',
        width: '100%',
    },

    
    chartContainer: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: theme.colors.cardBorderColor,
        padding: 20,
        elevation: 1,
        width: '100%',
    },

    chartHeader: {
        alignSelf: 'flex-start',
        fontSize: 28,
        fontWeight: '700',
        paddingBottom: 4,
    },

    priceRow: {
        flexDirection: 'row',
        width: '100%',
        marginBottom: 20
    },
    priceItem: {
        alignItems: 'center',
        flex: 1,
    },

    priceLabel: {
        fontSize: 13,
        color: '#777',
        marginBottom: 4,
    },

    priceValue: {
        width: '100%',
        textAlign: 'center',
        fontSize: 17,
        fontWeight: '600',
    },
    annotation: {
        position: 'absolute'
    },
    outerAnnotation: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    legend: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,

    },

    patternLegend: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: theme.spacing.formRowgap,

    },
    yAxis: {
        width: 60,
        height: 350,
        justifyContent: 'space-between',
        paddingLeft: 8,
    },

    yAxisLabel: {
        fontSize: 12,
        color: '#777',
        textAlign: 'right',
    },

    xAxisLabel: {
        fontSize: 12,
        color: '#777',
    },
    xAxis: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 25,
    },
});