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
    const [hasScanned, setHasScanned] = useState(false);

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
        let ignore = false;

        setSelectedStockData(null);
        setHasScanned(false);
        if (selectedStock === null) {
            return;
        }
        const getData = async (stock) => {
            const result = await getStockData(stock);
            if (!ignore){ 
                setSelectedStockData(result)
            };


        }


        getData(selectedStock);
        
        return () => {
            ignore = true;
        };
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
        
    };
   
    const handleScan = () => {
        if (!startDate || !endDate ){
            setDateError('Select both dates')
            return
        }else if (!selectedStock){
            setDateError('Select a Stock');
            return

        }else if (!selectedStockData){
            setDateError('Stock data is still loading or unavailable');
            return

        }else if (selectedPatterns.length === 0){
            setDateError('Select at least one pattern');
            return
        }
        setDateError('')
        setHasScanned(true);
        
        
    };

    const patternResults = hasScanned && startDate && endDate && selectedStockData && selectedStock && selectedPatterns.length > 0? scanPatterns(formatDate(startDate), formatDate(endDate), selectedPatterns, selectedStockData) : {};
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
            {!isMobile && (
                <Text style={{lineHeight: 22, fontSize: 16, fontWeight: 400, color: '#64748B', paddingHorizontal: 24, paddingTop: 0, paddingBottom: 20,}}>
                    Explore candlestick patterns in historical stock data.
                </Text>
            )}
            <View style={[styles.card, isMobile && {marginHorizontal: 16, padding: 16, borderRadius: 12,},]}>
                <Text style={styles.heading}>Scan settings</Text>
                <View style={[styles.startingRow, isMobile && styles.mobileStartingRow]}>
                    
                    <View style={{flexDirection: 'column', flex: 1, minWidth: 0, position: 'relative', zIndex: 10,}}>
                        <Text style={styles.fieldLabel}>Stock to analyze</Text>
                        <StockSearchbar onSelectedStockChange={setSelectedStock} variant="scanner" placeholder='Select a stock to scan' style={{width: '100%', height: 42, borderRadius: 8, borderColor: '#D9E1EA'}} inputStyle={{fontSize: 14, height: 42, minHeight: 0, paddingVertical: 0}}/>
                        <View style={styles.dateSection}>
                            {datePresets.map((preset) => {
                                const isSelected = selectedInterval === preset.months;
                                return (<Pressable 
                                    key={preset.months}  
                                    onPress={() => dateInterval(preset.months)} 
                                    style={({hovered}) => [styles.dateButton, isSelected ? styles.dateButtonActive : styles.dateButtonBackground, hovered && !isSelected && styles.dateButtonHovered]}>
                                    {({ hovered}) => (<Text style={[isSelected ? styles.dateTextActive : styles.dateText, hovered && !isSelected && {color: '#059669'}]}>{preset.label}</Text>)}
                                </Pressable>
                                )
                            })}
                        </View>
                    </View>
                    <View style={{width: isMobile ? '100%': undefined, flexDirection: 'column',flex: isMobile ? undefined: 2, minWidth: 0,}}>
                        <DateRangePicker startDate={startDate} endDate={endDate} onStartDateChange={handleStartDateChange} onEndDateChange={handleEndDateChange}/>
                        {dateError === '' ? null: <Text>{dateError}</Text>}
                    </View>
            
                    <View style={[styles.patternSection, isMobile && styles.mobilePatternSection]}>
                        <Text style={styles.fieldLabel}>Patterns</Text>
                        <MultiSelect data={availablePatterns} 
                            labelField="label"  
                            valueField="value" value={selectedPatterns} 
                            onChange={(selected) => setSelectedPatterns(selected)}
                            mode="auto"
                            placeholder={selectedPatterns?.length > 0 ? `${selectedPatterns.length} pattern(s) selected` : "Select Patterns"}
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
                                <View style={[styles.selectedChip, {borderColor: patternAnnotationVisuals[pattern.value].color, borderWidth: 1}]}>
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
                <Pressable onPress={handleScan} style={[styles.scanButton, {width: isMobile ? '100%' : 180}]}>
                    <Text style={{fontSize: 15, fontWeight: '600', color: '#FFFFFF'}}>
                        Scan Patterns
                    </Text>
                </Pressable>
            </View>
            
            <View style={[{zIndex: 0 ,marginHorizontal: 24, marginTop: 24,}, isMobile && {marginHorizontal: 16, marginTop: 16,}]}>
                {hasScanned && startDate 
                    && endDate && selectedStockData 
                    && selectedStock && selectedPatterns.length > 0 
                    ? <StockChart startDate={startDate} endDate={endDate} stockData={selectedStockData} patternResults={patternResults} selectedStock={selectedStock} dateInterval={dateInterval} selectedPatterns={selectedPatterns}/> : null}
            </View>
            <View style={[{zIndex: 0 ,position: 'relative',marginHorizontal: 24, marginTop: 24, backgroundColor: 'white', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, padding: 16}, isMobile && {marginHorizontal: 16, marginTop: 16,}]}>
                <Text style={{fontSize: 18, fontWeight: 700, color: '#0F172A'}}>Pattern results</Text>
                <Text style={{fontSize: 13, color:'#64748B', marginBottom: 12,}}>{selectedPatterns.length} patterns scanned. {patternData.reduce((total, pattern) => total + pattern.count, 0)} matches</Text>
                {!isMobile && <View style={{flexDirection: 'row', backgroundColor: '#F5F7FA', paddingHorizontal: 12, paddingVertical: 8,}}>
                   <Text style={[styles.resultHeadingText,{width: '40%'}]}>Pattern</Text>
                   <Text style={[styles.resultHeadingText, {width: '15%'}]}>Matches</Text> 
                   <Text style={[styles.resultHeadingText, {width: '45%'}]}>Recent dates</Text> 
                </View>}
                {patternData.map((pattern) => (
                    <PatternCard key={pattern.name} pattern={pattern}/>
                ))}

            </View>
            

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 24,
        padding: 24,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        position: 'relative',
        zIndex: 20,
        overflow: 'visible'


    },
    heading: {
        fontSize: 23,
        lineHeight: 26,
        fontWeight: 700,
        color: '#0F172A',
        marginBottom: 16,
    },
    startingRow:{
        justifyContent: 'flex-start',
        zIndex: 1,
        alignItems: 'flex-start',
        flexDirection: 'row',
        gap: 20,
        flex: 1,
    },
    resultHeadingText:{
        color: '#475569',
        fontSize: 13,
        fontWeight: 500,
    },
    results:{
        marginHorizontal: 24,
        marginTop: 24,
        
    },
    mobileResults:{

    },
    fieldLabel:{
        fontSize: 14,
        lineHeight: 20,
        fontWeight: 400,
        color: '#475569',
        marginBottom: 6,
        fontFamily: 'Arial',
    },
    dateSection:{
        width: '100%',
        paddingHorizontal: 0,
        paddingVertical: 0,
        marginTop: 12,
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',

    },
    dateText:{
        fontSize: 14,
        color: '#475569',
        fontWeight: '600',
    },
    dateTextActive:{
        fontSize: 14,
        color: '#059669',
        fontWeight: '600',
    },
    dateButton: {
        flex: 1,
        height: 36,
        paddingHorizontal: 0,
        paddingVertical: 0,
        justifyContent: 'center',
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
    },
    dateButtonBackground: {
        backgroundColor: '#F8FAFC',
        borderColor: '#E2E8F0',
    },
    dateButtonActive: {
        backgroundColor: '#DDF5EC',
        borderColor: '#DDF5EC',
    },
    dateButtonHovered:{
        backgroundColor: '#DBEAFE',
    },
    containerStyle: {
        width: '100%',
        height: 42,
        backgroundColor: '#FFFFFF',
        borderColor: '#D9E1EA',
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
        fontSize: 14,
        color: '#64748B',
        fontWeight: '400',
        fontFamily: 'Arial',
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
        borderWidth: 0,
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
    scanButton:{
        height: 42,
        alignSelf: 'flex-end', 
        marginTop: 16, 
        paddingHorizontal: 20, 
        justifyContent: 'center', 
        borderRadius: 8,
        backgroundColor: '#059669',
        alignItems: 'center',

    },
    patternSection:{
        flexDirection: 'column',
        flex: 1,
        minWidth: 0,
    },
    mobilePatternSection:{
        width: '100%',
        flex: undefined,
        minWidth: 0,

    },
    mobileStartingRow:{
        flexDirection: 'column',
        gap: 16,
        flex: undefined,
        width: '100%',
    }
});