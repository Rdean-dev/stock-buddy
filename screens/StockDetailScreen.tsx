
import { useLocalSearchParams } from "expo-router";
import StockChart from "../components/StockChart";
import React, { useState, useEffect} from "react";
import { Pressable, useWindowDimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { formatDateAsISODate as formatDate, formatDisplayDate } from "../utils/formatDate";
import { getStockData, getStockProfile } from "../services/stockService";
import { Breakpoints } from '../constants/breakpoints';
import { mockWatchlist, mockProfileData, mockHistoricalData, } from '../utils/test';
import type {WatchlistStock, StockProfile, MarketState, PatternName, AlphaVantageDailyResponse} from '../types/stock';
import { theme } from "../constants/theme";
import formatStockProfile from "../utils/formatStockProfile";

const USE_MOCK_DATA = false;

export default function StockDetailScreen() {
    const { width } = useWindowDimensions();
    
    const isMobile = width < Breakpoints.mobile;
    const isTablet = width >= Breakpoints.mobile && width < Breakpoints.tablet;
    
    const { ticker } = useLocalSearchParams<{ ticker: string }>();
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [selectedStockData, setSelectedStockData] = useState<AlphaVantageDailyResponse | null>(null);
    const [selectedInterval, setSelectedInterval] = useState<number | null>(null);
    const [profileData, setProfileData] = useState<StockProfile | null>(null);

    useEffect(() => {
        if(USE_MOCK_DATA) return;
        let ignore = false;
        
        setSelectedStockData(null);
        setProfileData(null);
        
        if (!ticker) {
            return;
        }
        const getData = async () => {
            const stockData = await getStockData(ticker);
            const stockProfile = await getStockProfile(ticker);
            if (!ignore){ 
                setSelectedStockData(stockData)
                setProfileData(stockProfile);
            };
        }

        getData();
        
        return () => {
            ignore = true;
        };
    }, [ticker]);

    useEffect(() => {
        dateInterval(1)

    }, [selectedStockData])
    
    const dateInterval = (numOfMonths: number) => {
        const latestDate = Object.keys(selectedStockData?.["Time Series (Daily)"] ?? {}).sort().pop();
        const today = latestDate ? new Date(`${latestDate}T00:00:00`) : new Date();

        const backDate = new Date(today)

        backDate.setMonth(today.getMonth() - numOfMonths);

        if (today.getDate() !== backDate.getDate()){
            backDate.setDate(0)
        }

        setSelectedInterval(numOfMonths)
        setStartDate(backDate);
        setEndDate(today);
    };

    const {formattedPrice, formattedChange, changePercentage, formattedPercentage, volume, companyName, description, exchange, exchangeFullName, symbol} = formatStockProfile(profileData)
    return (
        <>
            <ScrollView style={styles.container}>
                <View style={{gap: 8}}>
                    <Text style={{fontWeight: 'bold', fontSize: 24,}}>{companyName}</Text>
                    <Text style={{fontWeight: 'bold', fontSize: 14,}}>{ticker} · {exchange}</Text>
                    <Text style={{fontWeight: 'bold', fontSize: 32,}}>{formattedPrice}</Text>
                    <View style={{flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-end' :  'center', gap: isMobile ?  2 : 5,}}>
                        <Text 
                            style={[styles.changeText, (changePercentage ?? 0) >= 0 ? 
                                styles.positive : styles.negative, {fontSize: isMobile ? 13 : 16}]}>
                            {formattedChange} ({formattedPercentage})
                        </Text>
                    </View>
                </View>
                
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>AI Research Summary</Text>
                </View>
                <View style={[{zIndex: 0 ,marginHorizontal: theme.spacing.pageHorizontalMargin, marginTop: 24,}, isMobile && {marginHorizontal: 16, marginTop: 16,}]}>
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
        flex: 1,
        marginHorizontal: theme.spacing.pageHorizontalMargin,
    },
    
    section: {
        backgroundColor: theme.colors.cardBackgroundColor,
        borderColor: theme.colors.cardBorderColor,
        borderWidth: 1,
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
        color: "black",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },

    header: {
        color: "black",
        fontSize: 25,
    },
    changeText:{
        fontSize: 16,
        fontWeight: 'bold',
    },
    positive:{
        color: theme.colors.positive,
    },
    negative:{
        color: theme.colors.negative,
    },
})
