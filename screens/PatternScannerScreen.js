import React from "react";
import {useState} from 'react';
import {Text, StyleSheet, View, ScrollView } from 'react-native';
import PatternCard from '../components/PatternCard';
import DateRangePicker from "../components/DateRangePicker";

const patternData = [
  {
    name: "Doji",
    count: 3,
    dates: ["May 20", "May 24", "May 28"],
    type: "Neutral",
  },
  {
    name: "Bullish Engulfing",
    count: 1,
    dates: ["May 26"],
    type: "Bullish",
  },
];

export default function PatternScannerScreen() {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [dateError, setDateError] = useState('')
    
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
        if (date == null){
            return ""
        }
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }


    return (
        <ScrollView>
            <Text>Pattern Scanner</Text>
            <View style={styles.startingRow}>
                <Text>Stock Ticker DropDown Menu</Text>
                <View>
                    <DateRangePicker startDate={startDate} endDate={endDate} onStartDateChange={handleStartDateChange} onEndDateChange={handleEndDateChange}/>
                    <Text>{dateError}</Text>
                </View>
                <Text>Pattern Type dropdown/checklist</Text>
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
});