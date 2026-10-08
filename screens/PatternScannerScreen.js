import React, { useState, useEffect} from "react";
import { Pressable, useWindowDimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import DateRangePicker from "../components/DateRangePicker";
import StockSearchbar from "../components/StockSearchbar";
import PatternCard from '../components/PatternCard';
import { formatDateAsISODate as formatDate, formatDisplayDate } from "../utils/formatDate";
import scanPatterns from '../utils/patternScanner';
import Checkbox from 'expo-checkbox';
import { MultiSelect } from 'react-native-element-dropdown';
import StockChart from '../components/StockChart';
import { getStockData } from "../services/stockService";
import { Breakpoints } from '../constants/breakpoints';
import  Marker  from "../components/Marker";
import { patternAnnotationVisuals } from "../constants/patternAnnotationVisuals";

const datePresets = [
    {
        label: '1M', 
        months: 1,
    },
    {
        label: '3M', 
        months: 3,
    },
    {
        label: '6M', 
        months: 6,
    },
    {
        label: '1Y', 
        months: 12,
    }
]

export default function PatternScannerScreen() {
    const { width } = useWindowDimensions();

    const isMobile = width < Breakpoints.mobile;
    const isTablet = width >= Breakpoints.mobile &&
                    width < Breakpoints.tablet;
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [dateError, setDateError] = useState('');
    const [selectedPatterns, setSelectedPatterns] = useState([]);
    //const [patternData, setPatternData] = useState([]);
    const [selectedStock, setSelectedStock] = useState(null);
    const [selectedStockData, setSelectedStockData] = useState(null);
    const [selectedInterval, setSelectedInterval] = useState(null);

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


    useEffect(() => {

        if (selectedStock === null) {
            return;
        }
        const getData = async (stock) => {
            const result = await getStockData(stock);
            setSelectedStockData(result);


        }

        getData(selectedStock);
    }, [selectedStock]);
    const handleStartDateChange = (date) => {
        if ((date && endDate) && normalizeDate(date) > normalizeDate(endDate)){
            setDateError("Pick a date on or before the end Date")
            return
        }

        setDateError("");
        setSelectedInterval(null);
        return setStartDate(date);
    }

    const handleEndDateChange = (date) => {
        if ((startDate && date) && normalizeDate(date) < normalizeDate(startDate)){
            setDateError("Pick a date on or after the start Date.")
            return
        }
        setDateError("")
        setSelectedInterval(null);
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

        setSelectedInterval(numOfMonths)
        setStartDate(backDate);
        setEndDate(today);
    };

    const handleCheckboxChange = (pattern) => {
        
        setSelectedPatterns(previous => previous.includes(pattern)
            ? previous.filter(item => item !== pattern)
            : [...previous, pattern]
        );
        
    }
   

    const patternResults = startDate && endDate && selectedStockData? scanPatterns(formatDate(startDate), formatDate(endDate), selectedPatterns, selectedStockData) : {};
    
    const patternData = Object.entries(patternResults).map(([patternName, candles]) => {
        const patternMatchDates = candles.map((candle) => formatDisplayDate(candle.date));

        return {
            name: patternName,
            count: patternMatchDates.length,
            dates: patternMatchDates,
        };
    })
    
   
    return (
        <ScrollView>

            <View style={[styles.startingRow, {flexDirection: isMobile ? 'column': 'row', paddingHorizontal: isMobile ? 16: 50}]}>
                <View style={{flexDirection: 'column'}}>
                    <Text style={styles.sectionTitle}>Search Stock</Text>
                    <StockSearchbar selectedStock={selectedStock} onSelectedStockChange={setSelectedStock}/>
                </View>
                <View style={{flexDirection: 'column',}}>
                    <DateRangePicker startDate={startDate} endDate={endDate} onStartDateChange={handleStartDateChange} onEndDateChange={handleEndDateChange}/>
                    <View style={styles.dateSection}>
                        {datePresets.map((preset) => {
                            const isSelected = selectedInterval === preset.months;
                            return (<Pressable 
                                key={preset.months}  
                                onPress={() => dateInterval(preset.months)} 
                                style={({hovered}) => [styles.dateButton, isSelected ? styles.dateButtonActive : styles.dateButtonBackground, hovered && !isSelected && styles.dateButtonHovered]}>
                                {({ hovered}) => (<Text style={[isSelected ? styles.dateTextActive : styles.dateText, hovered && !isSelected && {color: '#1D4ED8'}]}>{preset.label}</Text>)}
                            </Pressable>
                            )
                        })}
                    </View>
                    <Text>{dateError}</Text>
                </View>
                <View style={{flexDirection: 'column'}}>
                    <MultiSelect data={availablePatterns} 
                        labelField="label"  
                        valueField="value" value={selectedPatterns} 
                        onChange={(selected) => setSelectedPatterns(selected)}
                        mode="auto"
                        placeholder="Select Pattern(s)"
                        placeholderStyle={styles.placeholderStyle}
                        style={styles.containerStyle}
                        itemContainerStyle={{padding: 5}}
                        selectedTextStyle={styles.selectedTextStyle}
                        selectedStyle={styles.selectedStyle}
                        renderItem={(pattern) => (
                            <View style={{flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, paddingHorizontal: 10}}>
                                <Marker shape={patternAnnotationVisuals[pattern.value].shape} color={patternAnnotationVisuals[pattern.value].color}/><Text style={styles.dropdownTextStyle}>{pattern.label}</Text>
                            </View>
                            )}
                        renderSelectedItem={(pattern, unSelect) => (
                            <View style={styles.selectedChip}>
                                <Marker
                                    shape={patternAnnotationVisuals[pattern.value].shape}
                                    color={patternAnnotationVisuals[pattern.value].color}
                                />

                                <Text style={styles.selectedChipText}>
                                    {pattern.label}
                                </Text>

                                <Pressable onPress={() => unSelect(pattern)}>
                                    <Text style={styles.removeChip}>x</Text>
                                </Pressable>
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
                <StockChart startDate={startDate} endDate={endDate} stockData={selectedStockData} patternResults={patternResults} selectedStock={selectedStock} dateInterval={dateInterval} selectedPatterns={selectedPatterns}/>
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    startingRow:{
        justifyContent: 'space-evenly',
        zIndex: 1,
        paddingVertical: 30,
        },
    dateSection:{
        paddingHorizontal: 0,
        paddingVertical: 8,
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'flex-start',
        alignItems: 'center'

    },
    dateText:{
        fontSize: 15,
        color: '#334155',
    },
    dateTextActive:{
        fontSize: 15,
        color: '#FFFFFF',
    },
    dateButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 2,
    },
    dateButtonBackground: {
        backgroundColor: '#F1F5F9',
        borderColor: '#E2E8F0',
    },
    dateButtonActive: {
        backgroundColor: '#2563EB',
        borderColor: '#2563EB',
    },
    dateButtonHovered:{
        backgroundColor: '#DBEAFE',
    },
    containerStyle: {
        width: 250,
        height: 44,
        backgroundColor: '#FFFFFF',
        borderColor: '#CBD5E1',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    pageStyle: {
        paddingHorizontal: 50
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '500',
        color: '#1E293B',
    },
    placeholderStyle:{
        fontSize: 18,
        color: '#64748B',
        fontWeight: '400',
    },
    dropdownTextStyle:{
        fontSize: 15,
        color: '#334155',
        fontWeight: '400',
    },
    selectedTextStyle:{
        fontSize: 14,
        color: '#334155',
        fontWeight: '500',
        
    },
    selectedStyle:{
        gap: 8,
        backgroundColor: '#FFFFFF',
        borderColor: '#E2E8F0',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    itemContainerStyle: {
        backgroundColor: '#ffffff',
        borderColor: '#E2E8F0',
        borderRadius: 8,

    },
    selectedChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#FFFFFF',
        borderColor: '#E2E8F0',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 6,
        marginRight: 8,
        marginTop: 8,
    },

    selectedChipText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#334155',
    },

    removeChip: {
        fontSize: 18,
        color: '#94A3B8',
        marginLeft: 4,
    },
});