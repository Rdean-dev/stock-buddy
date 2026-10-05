import {CandlestickChart, useCandlestickChart} from 'react-native-wagmi-charts';
import normalizeCandleData from '../utils/normalizeCandleData';
import { formatDateAsISODate } from '../utils/formatDate';
import { StyleSheet, View, useWindowDimensions, Text, Pressable } from 'react-native';
import Svg, { Circle, Rect, Polygon } from 'react-native-svg';

const patternAnnotationVisuals = {
    Doji: {
        color: '#2563EB', // blue
        shape: 'circle',
    },
    Hammer: {
        color: '#059669', // emerald
        shape: 'triangle',
    },
    'Shooting Star': {
        color: '#7C3AED', // violet
        shape: 'star'
    },
    'Inverted Hammer': {
        color: '#EA580C', // burnt orange
        shape: 'circle'
    },
    'Hanging Man': {
        color: '#0891B2', // cyan/teal
        shape: 'triangle'
    },
    'Bullish Engulfing': {
        color: '#16A34A', // strong green
        shape: 'square'
    },
    'Bearish Engulfing': {
        color: '#DC2626', // strong red
        shape: 'diamond'
    },
    'Bullish Harami': {
        color: '#4F46E5', // indigo
        shape: 'square'
    },
    'Bearish Harami': {
        color: '#C026D3', // magenta
        shape: 'triangle'
    },
    'Piercing Line': {
        color: '#0D9488', // teal
        shape: 'diamond'
    },
    'Dark Cloud Cover': {
        color: '#475569', // slate
        shape: 'circle'
    },
    'Morning Star': {
        color: '#D97706', // amber
        shape: 'star'
    },
    'Evening Star': {
        color: '#9333EA', // purple
        shape: 'star'
    },
    'Three White Soldiers': {
        color: '#64748B', // blue-gray
        shape: 'diamond'
    },
    'Three Black Crows': {
        color: '#1E293B', // dark slate
        shape: 'diamond'
    }
};

function PatternAnnotations({matchResults}) {
    const {step, domain, data, height} = useCandlestickChart();
    console.log('domain: ', domain);
    const countOfDatesSeen = {};
    const annotationsArray = matchResults.map((match) => {
        const candle = data[match.matchIndex];
        const index = match.matchIndex ?? null;
        const xPosition = step * index + step / 2 - 5;
        const maxPrice = domain[1];
        const minPrice = domain[0];
        const priceRange = maxPrice - minPrice;
        const distanceFromTop = maxPrice - candle.high;
        const percentageDownChart = distanceFromTop / priceRange;

        const yPosition = (percentageDownChart  * height) - 15;
        let finalYPosition = yPosition;
        const markerSpacing = -15;

        if (match.date in countOfDatesSeen) {
            finalYPosition = yPosition + (markerSpacing * countOfDatesSeen[match.date])
            countOfDatesSeen[match.date] += 1;
        }else{
            countOfDatesSeen[match.date] = 1;
        }


        return {date:match.date, pattern:match.pattern, matchIndex: match.matchIndex, xPosition, yPosition: finalYPosition};

    });

    console.log("aaArray",annotationsArray);

    return(
        <View pointerEvents="none" style={styles.outerAnnotation}>
            {annotationsArray.map((annotation) => (<View key={`${annotation.date}-${annotation.pattern}`} style={[styles.annotation, {left: annotation.xPosition, top: annotation.yPosition}]}><Marker shape={patternAnnotationVisuals[annotation.pattern].shape} color={patternAnnotationVisuals[annotation.pattern].color}/></View>))}
        </View>
    );

    
}

function Marker({shape, color}) {
    if (shape === 'circle'){
        return (
            <Svg height="10" width="10">
                <Circle cx='5' cy='5' r='5' fill={color}/>
            </Svg>
        )
    }else if(shape === 'triangle'){
        return (
            <Svg height="10" width="10">
                <Polygon points="5,0 10,10 0,10" fill={color}/>
            </Svg>

        )
    }else if(shape === 'diamond'){
    return (
        <Svg height="10" width="10">
            <Polygon points="5,0 0,5 5,10 10,5" fill={color}/>
        </Svg>

    )
    }else if(shape === 'square'){
    return (
        <Svg height="10" width="10">
            <Rect x='0' y="0" width='10' height='10' fill={color}/>
        </Svg>

    )
    }else if(shape === 'star'){
    return (
        <Svg height="10" width="10">
            <Polygon
                points="5,0 6.2,3.5 10,3.5 7,5.8 8.2,10 5,7.5 1.8,10 3,5.8 0,3.5 3.8,3.5"
                fill={color}/>
        </Svg>

    )
    }else{
        return null
    }

}

function PatternLegend({selectedPatterns}) {
    return(
        <View style={styles.patternLegend}>
            {selectedPatterns.map((pattern) => (<View key={pattern} style={styles.legend}><Marker shape={patternAnnotationVisuals[pattern].shape} color={patternAnnotationVisuals[pattern].color}/><Text>{pattern}</Text></View>))}
        </View>
    );
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

    console.log("Axis Array",yAxisArray);

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


export default function StockChart({startDate, endDate, stockData, patternResults, dateInterval,selectedStock, selectedPatterns}) {
    
    const { width } = useWindowDimensions();
    
    if (!stockData?.["Time Series (Daily)"] || !startDate || !endDate) {
        return null;
    }


    const filteredArrayOfCandlestickObjects = normalizeCandleData(stockData, formatDateAsISODate(startDate), formatDateAsISODate(endDate));
    
    
    const screenPadding = 32;
    const maxChartWidth = 1000;
    const yAxisWidth = 60;

    const chartWidth = Math.min(width - screenPadding, maxChartWidth);
    const candleChartWidth = chartWidth - 40 - yAxisWidth;
    

    if (filteredArrayOfCandlestickObjects.length === 0) {
        return null;
    }

    const matchesArray = [];

    for (const [patternName, matches] of Object.entries(patternResults ?? {}) ){
        const mappedMatches = matches.map((match) => {
            return {
                date: match.date,
                pattern: patternName,
            };
        });

        matchesArray.push(...mappedMatches);
    }
    console.log("Matches Array", matchesArray);

    const matchResults = matchesArray.map((match) =>{
        const matchIndex = filteredArrayOfCandlestickObjects.findIndex((candle) => match.date === candle.date);
        return {date:match.date, pattern:match.pattern, matchIndex};
    });
    console.log("Match Results", matchResults);


    
    return (
        <View style={[styles.chartContainer, {width: chartWidth}]}>
            <Text style={styles.chartHeader}>{selectedStock.symbol}</Text>
            <View style={styles.dateSection}>
                <Pressable onPress={() => dateInterval(1)}>{({ hovered, pressed }) => (<View style={[styles.dateButton,(hovered || pressed) && styles.dateButtonActive]}><Text style={styles.dateText}>1m</Text></View>)}</Pressable>
                <Pressable onPress={() => dateInterval(3)}>{({ hovered, pressed }) => (<View style={[styles.dateButton,(hovered || pressed) && styles.dateButtonActive]}><Text style={styles.dateText}>3m</Text></View>)}</Pressable>
                <Pressable onPress={() => dateInterval(6)}>{({ hovered, pressed }) => (<View style={[styles.dateButton,(hovered || pressed) && styles.dateButtonActive]}><Text style={styles.dateText}>6m</Text></View>)}</Pressable>
                <Pressable onPress={() => dateInterval(12)}>{({ hovered, pressed }) => (<View style={[styles.dateButton,(hovered || pressed) && styles.dateButtonActive]}><Text style={styles.dateText}>1Y</Text></View>)}</Pressable>
            </View>
            <CandlestickChart.Provider data={filteredArrayOfCandlestickObjects}>
            <View style={styles.chartStyle}>
                <CandlestickChart width={candleChartWidth} height={350} style={styles.chart}>
                    <CandlestickChart.Candles/>
                    <CandlestickChart.Crosshair>
                        <CandlestickChart.Tooltip/>
                    </CandlestickChart.Crosshair>
                    <PatternAnnotations matchResults={matchResults}/>
                </CandlestickChart>
                
                <YAxis />
                
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
                        <PatternLegend selectedPatterns={selectedPatterns}/>
                    </View>

                </View>
                
            </CandlestickChart.Provider >
        </View>
        
       
    );
}

const styles = StyleSheet.create({
    inspectionSection: {
        width: '90%',
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
        gap: 20,
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
    },

    
    chartContainer: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 12,
        marginVertical: 30,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 4,
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
        gap: 20,

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
});