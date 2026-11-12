import {useCandlestickChart} from 'react-native-wagmi-charts';
import normalizeCandleData from '../utils/normalizeCandleData';
import { formatDateAsISODate} from '../utils/formatDate';
import { StyleSheet, View, Text,} from 'react-native';
import  Marker  from "./Marker";
import { patternAnnotationVisuals } from "../constants/patternAnnotationVisuals";
import { theme } from "../constants/theme";
import type { PatternName, Candle, AlphaVantageDailyResponse, WatchlistStock } from "../types/stock";
import StockChart from "../components/StockChart";

type PatternMatch = {
    date: string;
    pattern: PatternName;
    matchIndex: number;
};

type PatternAnnotationsProps = {
    matchResults: PatternMatch[];
}

type PatternLegendProps = {
    selectedPatterns: PatternName[];
}
type StockChartProps = {
    startDate: Date;
    endDate: Date;
    stockData: AlphaVantageDailyResponse;
    patternResults: Partial<Record<PatternName, Candle[]>>;
    dateInterval: (months: number) => void;
    selectedStock: WatchlistStock;
    selectedPatterns: PatternName[];
}

function PatternAnnotations({matchResults}: PatternAnnotationsProps) {
    const {step, domain, data, height} = useCandlestickChart();
    
    const countOfDatesSeen: Record<string, number> = {};
    const annotationsArray = matchResults.flatMap((match) => {
        const candle = data[match.matchIndex];
        const maxPrice = domain[1];
        const minPrice = domain[0];
        const priceRange = maxPrice - minPrice;

        if (!candle || priceRange <= 0) {
            return [];
        }
        const index = match.matchIndex;
        const xPosition = step * index + step / 2 - 5;
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


        return [{
            date: match.date,
            pattern: match.pattern,
            matchIndex: match.matchIndex,
            xPosition,
            yPosition: finalYPosition,
        }];

    });

    

    return(
        <View pointerEvents="none" style={styles.outerAnnotation}>
            {annotationsArray.map((annotation) => (<View key={`${annotation.date}-${annotation.pattern}`} style={[styles.annotation, {left: annotation.xPosition, top: annotation.yPosition}]}><Marker shape={patternAnnotationVisuals[annotation.pattern].shape} color={patternAnnotationVisuals[annotation.pattern].color}/></View>))}
        </View>
    );

    
}



function PatternLegend({selectedPatterns}: PatternLegendProps) {
    return(
        <View style={styles.patternLegend}>
            {selectedPatterns.map((pattern) => (<View key={pattern} style={styles.legend}><Marker shape={patternAnnotationVisuals[pattern].shape} color={patternAnnotationVisuals[pattern].color}/><Text>{pattern}</Text></View>))}
        </View>
    );
}




export default function PatternStockChart({startDate, endDate, stockData, patternResults, dateInterval,selectedStock, selectedPatterns}: StockChartProps) {
    
    if (!stockData?.["Time Series (Daily)"] || !startDate || !endDate) {
        return null;
    }


    const filteredArrayOfCandlestickObjects = normalizeCandleData(stockData, formatDateAsISODate(startDate), formatDateAsISODate(endDate));

    if (filteredArrayOfCandlestickObjects.length === 0) {
        return null;
    }

    
    const matchesArray = [];

    for (const patternName of selectedPatterns){
        const matches = patternResults[patternName];
        if (!matches) continue;
        const mappedMatches = matches.map((match) => {
            return {
                date: match.date,
                pattern: patternName,
            };
        });

        matchesArray.push(...mappedMatches);
    }
    
    const matchResults = matchesArray.map((match) =>{
        const matchIndex = filteredArrayOfCandlestickObjects.findIndex((candle) => match.date === candle.date);
        return {date:match.date, pattern:match.pattern, matchIndex};
    }).filter(result => result.matchIndex >= 0);

    return (
        <StockChart startDate={startDate} endDate={endDate} stockData={stockData}  symbol={selectedStock.symbol} dateInterval={dateInterval}  annotations={<PatternAnnotations matchResults={matchResults}/>}  legend= {<PatternLegend selectedPatterns={selectedPatterns}/>}/> 
    )
}

const styles = StyleSheet.create({
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

});