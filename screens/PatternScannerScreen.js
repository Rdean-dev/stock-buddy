import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import DateRangePicker from "../components/DateRangePicker";
import PatternCard from '../components/PatternCard';
import data from '../data/mockDailyIBMData.json';
import { formatDateAsISODate as formatDate } from "../utils/formatDate";
import scanPatterns from '../utils/patternScanner';


export default function PatternScannerScreen() {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [dateError, setDateError] = useState('');
    const [selectedPatterns, setSelectedPatterns] = useState(['Doji']);
    //const [patternData, setPatternData] = useState([]);
    
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

    const patternResults = startDate && endDate ? scanPatterns(formatDate(startDate), formatDate(endDate), selectedPatterns, data) : {};
    
    const allDatesArray = Object.values(patternResults).flatMap(array => array.map(candle => candle.date));

    patternData[0].dates = allDatesArray;
    patternData[0].count = allDatesArray.length
    return (
        <ScrollView>
            <Text>Pattern Scanner</Text>
            <View style={styles.startingRow}>
                <Text>S</Text>
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
                <Text>checkbox</Text>
            </View>
            <View>
                <Text>Pattern Results</Text>
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

    }
});