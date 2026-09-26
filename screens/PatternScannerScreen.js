import React, { useState} from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import DateRangePicker from "../components/DateRangePicker";
import StockSearchbar from "../components/StockSearchbar";
import PatternCard from '../components/PatternCard';
import data from '../data/mockDailyIBMData.json';
import { formatDateAsISODate as formatDate, formatDisplayDate } from "../utils/formatDate";
import scanPatterns from '../utils/patternScanner';
import Checkbox from 'expo-checkbox';
import { MultiSelect } from 'react-native-element-dropdown';


export default function PatternScannerScreen() {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [dateError, setDateError] = useState('');
    const [selectedPatterns, setSelectedPatterns] = useState([]);
    //const [patternData, setPatternData] = useState([]);
    const [selectedStock, setSelectedStock] = useState(null);

    const availablePatterns = [{label: "Doji", value: "Doji"}, 
        {label: "Hammer", value: "Hammer"}, 
        {label: "Shooting Star", value: "Shooting Star"},
        {label: "Inverted Hammer", value: "Inverted Hammer"},
        {label: "Hanging Man", value: "Hanging Man"},
        {label: "Bullish Engulfing", value: "Bullish Engulfing"}, 
        {label: "Bearish Engulfing", value: "Bearish Engulfing"},
        {label: "Bullish Harami", value: "Bullish Harami"},
        {label: "Bearish Harami", value: "Bearish Harami"},
        {label: "Piercing Line", value: "Piercing Line"},
        {label: "Dark Cloud Cover", value: "Dark Cloud Cover"},
        {label: "Morning Star", value: "Morning Star"},
        {label: "Three White Soldiers", value: "Three White Soldiers"},
        {label: "Three Black Crows", value: "Three Black Crows"}];



    const handleStartDateChange = (date) => {
        if ((date && endDate) && normalizeDate(date) > normalizeDate(endDate)){
            setDateError("Pick a date on or before the end Date")
            return
        }

        setDateError("")
        return setStartDate(date)
    }

    const handleEndDateChange = (date) => {
        if ((startDate && date) && normalizeDate(date) < normalizeDate(startDate)){
            setDateError("Pick a date on or after the start Date.")
            return
        }
        setDateError("")

        return setEndDate(date)
    }

   const normalizeDate = (date) => {
        return new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        );
    };
    
    
    const dateInterval = (numOfMonths) => {
        setDateError("")
        const today = new Date();

        const backDate = new Date(today)

        backDate.setMonth(today.getMonth() - numOfMonths);

        if (today.getDate() !== backDate.getDate()){
            backDate.setDate(0)
        }


        setStartDate(backDate);
        setEndDate(today);
    };

    const handleCheckboxChange = (pattern) => {
        
        setSelectedPatterns(previous => previous.includes(pattern)
            ? previous.filter(item => item !== pattern)
            : [...previous, pattern]
        );
        
    }
   
    
    

    const patternResults = startDate && endDate ? scanPatterns(formatDate(startDate), formatDate(endDate), selectedPatterns, data) : {};
    
    const patternData = Object.entries(patternResults).map(([patternName, candles]) => {
        const patternMatchDates = candles.map((candle) => formatDisplayDate(candle.date));

        return {
            name: patternName,
            count: patternMatchDates.length,
            dates: patternMatchDates,
        };
    })
    
    console.log(selectedStock);
    return (
        <ScrollView>
            <Text>Pattern Scanner</Text>
            <View style={styles.startingRow}>
                <StockSearchbar selectedStock={selectedStock} onSelectedStockChange={setSelectedStock}/>
                <View style={{flexDirection: 'column',}}>
                    <DateRangePicker startDate={startDate} endDate={endDate} onStartDateChange={handleStartDateChange} onEndDateChange={handleEndDateChange}/>
                    <View style={styles.dateSection}>
                        <Pressable onPress={() => dateInterval(1)} >{({ hovered, pressed }) => (<Text style={[styles.dateText, (hovered || pressed) && styles.dateTextActive]}>[1m]</Text>)}</Pressable>
                        <Pressable onPress={() => dateInterval(3)} >{({ hovered, pressed }) => (<Text style={[styles.dateText, (hovered || pressed) && styles.dateTextActive]}>[3m]</Text>)}</Pressable>
                        <Pressable onPress={() => dateInterval(6)} >{({ hovered, pressed }) => (<Text style={[styles.dateText, (hovered || pressed) && styles.dateTextActive]}>[6m]</Text>)}</Pressable>
                        <Pressable onPress={() => dateInterval(12)} >{({ hovered, pressed }) => (<Text style={[styles.dateText, (hovered || pressed) && styles.dateTextActive]}>[1Y]</Text>)}</Pressable>
                       <Pressable>{({ hovered, pressed }) => (<Text style={[styles.dateText, (hovered || pressed) && styles.dateTextActive]}>[Custom]</Text>)}</Pressable>
                    </View>
                    
                    <Text>{dateError}</Text>
                </View>
                <View style={{flexDirection: 'column'}}>
                    <MultiSelect data={availablePatterns} 
                        labelField="label"  
                        valueField="value" value={selectedPatterns} 
                        onChange={(selected) => setSelectedPatterns(selected)}
                        mode="auto"
                        placeholder="Select Patterns"
                        style={styles.containerStyle}
                        itemContainerStyle={{padding: 5}}
                        renderItem={(pattern) => (
                            <View style={{flexDirection: 'row'}}>
                                <Text>{pattern.label}</Text>
                            </View>
                            )}
                    />
                </View>
            </View>
            <View>
                {patternData.map((pattern) => (
                    <PatternCard key={pattern.name} pattern={pattern}/>
                ))}

            </View>

            <View>
                <Text>Annotated Chart Placeholder</Text>
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    startingRow:{
        flexDirection: 'row',
        gap: 40,
        },
    dateSection:{
        paddingHorizontal: 5,
        paddingVertical: 5,
        flexDirection: 'row',
        gap: 20

    },
    dateText:{
        fontSize: 17
    },
    dateTextActive:{
        fontSize: 18,
        color: 'blue',

    },

    containerStyle: {
        width: 160,
    },
});