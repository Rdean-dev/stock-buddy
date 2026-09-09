import React from "react";
import {useState} from 'react';
import {Text, StyleSheet, View, ScrollView } from 'react-native';
import PatternCard from '../components/PatternCard';

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
    const {pattern, setPattern} = useState([]);
    return (
        <ScrollView>
            <Text>Pattern Scanner</Text>
            <View style={{}}>
                <Text>Stock Ticker DropDown Menu</Text>
                <Text>Date Range</Text>
                <Text>Pattern Type dropdown/checklist</Text>
            </View>
            <View>
                <Text>Pattern Results</Text>
                {patternData.map((stock) => (
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

});