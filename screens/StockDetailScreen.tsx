
import { useLocalSearchParams } from "expo-router";
import StockChart from "../components/StockChart";
import type {AlphaVantageDailyResponse, WatchlistStock, PatternName} from "@/types/stock";
import React, { useState, useEffect} from "react";
import { Pressable, useWindowDimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { formatDateAsISODate as formatDate, formatDisplayDate } from "../utils/formatDate";
import { getStockData } from "../services/stockService";
import { Breakpoints } from '../constants/breakpoints';
import { theme } from "../constants/theme";

export default function StockDetailScreen() {
    
    const { ticker } = useLocalSearchParams<{ ticker: string }>();
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [selectedStockData, setSelectedStockData] = useState<AlphaVantageDailyResponse | null>(null);
    const [selectedInterval, setSelectedInterval] = useState<number | null>(null);
    
    useEffect(() => {
        let ignore = false;
        
        setSelectedStockData(null);
        
        if (!ticker) {
            return;
        }
        const getData = async () => {
            const result = await getStockData(ticker);
            if (!ignore){ 
                setSelectedStockData(result)
            };
        }

        getData();
        
        return () => {
            ignore = true;
        };
    }, [ticker]);

    useEffect(() => {
        dateInterval(1)

    }, [])
    
    const dateInterval = (numOfMonths: number) => {
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
    return (
        <>
            <ScrollView style={styles.container}>
                <Text style={styles.header}>{ticker}</Text>
                
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>AI Research Summary</Text>
                </View>
                <View>
                    {(startDate && endDate && selectedStockData )&&<StockChart startDate={startDate} endDate={endDate} stockData={selectedStockData}  symbol={ticker} dateInterval={dateInterval}/>}
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Price Action Summary</Text>
                </View>
                <View style={styles.rowContainer}>
                    <View style={styles.halfSection}>
                        <Text style={styles.sectionTitle}>Technical Pattern Signals</Text>
                    </View>
                    <View style={styles.halfSection}>
                        <Text style={styles.sectionTitle}>Analyst Sentiment</Text>
                    </View>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Recent News Summary</Text>
                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({

    container: {
        backgroundColor: "#0a0a0a",
        flex: 1,
        padding: 12,
    },
    
    section: {
        backgroundColor: "#1a1a1a",
        borderRadius: 16,
        padding: 15,
        marginBottom: 12,
    },

    chartContainer: {
        backgroundColor: "#1a1a1a",
        borderRadius: 16,
        height: 250,
        padding: 15,
        marginBottom: 12,
    },

    rowContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },

    halfSection: {
        backgroundColor: "#1a1a1a",
        borderRadius: 16,
        padding: 15,
        width: "48%",
    },

    sectionTitle: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },

    header: {
        color: "white",
        fontSize: 25,
    },
})