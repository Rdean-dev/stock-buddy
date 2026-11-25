
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import StockChart from "../components/StockChart";
import { Breakpoints } from '../constants/breakpoints';
import { theme } from "../constants/theme";
import { getStockData, getStockProfile } from "../services/stockService";
import { getPriceActionSummary, getRecentNewsSummary } from "../services/stockSummaryService";
import type { AlphaVantageDailyResponse, StockProfile, StockSummary } from '../types/stock';
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
    const [priceActionSummary, setPriceActionSummary] = useState<StockSummary | null>(null);
    const [priceSummaryLoading, setPriceSummaryLoading] = useState<boolean>(false);
    const [priceSummaryError, setPriceSummaryError] = useState<string>("");
    const [newsSummary, setNewsSummary] = useState<StockSummary | null>(null);
    const [newsSummaryLoading, setNewsSummaryLoading] = useState<boolean>(false);
    const [newsSummaryError, setNewsSummaryError] = useState<string>("");


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
        if(USE_MOCK_DATA) return;
        let ignore = false;
        
        setPriceActionSummary(null);
        setPriceSummaryError("");
        
        
        if (!ticker) {
            return;
        }
        setPriceSummaryLoading(true)
        const getData = async () => {
            const priceSummary = await getPriceActionSummary(ticker);

            if (ignore) return;

            if (priceSummary === null) {
                setPriceSummaryError("Unable to load price action summary.");
            } else{
                setPriceActionSummary(priceSummary);
            }

            setPriceSummaryLoading(false);
        }

        getData();
        
        return () => {
            ignore = true;
        };
    }, [ticker]);
    useEffect(() => {
        if(USE_MOCK_DATA) return;
        let ignore = false;
        
        setNewsSummary(null);
        setNewsSummaryError("");
        
        
        if (!ticker) {
            return;
        }
        setNewsSummaryLoading(true)
        const getData = async () => {
            const newsSummary = await getRecentNewsSummary(ticker);

            if (ignore) return;

            if (newsSummary === null) {
                setNewsSummaryError("Unable to load Recent News Summary.");
            } else{
                setNewsSummary(newsSummary);
            }

            setNewsSummaryLoading(false);
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

    const {formattedPrice, formattedChange, changePercentage, formattedPercentage, volume, companyName, description, exchange, exchangeFullName, symbol, image} = formatStockProfile(profileData)
    
    const summary = newsSummary?.summary.split(";").map(bullet => bullet.trim()).filter(bullet => bullet.length > 0);


    
    return (
        <>
            <ScrollView style={styles.container}>
                <View style={{
                        flexDirection: isMobile ? 'column' : 'row',
                        alignItems: isMobile ? 'flex-start' : 'center',
                        gap: 24,
                        marginBottom: 24,
                    }}>
                    <View style={{gap: 16, flexDirection: 'row'}}>
                        <Image
                            style={{width: 60, height: 60, alignContent: 'center', borderRadius: 10,}}
                            source={{uri: image}}
                            resizeMode='contain'/>
                        <View>
                            <Text style={{fontWeight: 'bold', fontSize: 24,}}>{companyName}</Text>
                            <Text style={{fontWeight: '500', fontSize: 14,}}>{ticker} · {exchange}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'baseline', gap: 12}}>
                        <Text style={{fontWeight: 'bold', fontSize: 32,}}>{formattedPrice}</Text>
                        <View style={{flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-end' :  'center', gap: isMobile ?  2 : 5,}}>
                            <Text 
                                style={[styles.changeText, (changePercentage ?? 0) >= 0 ? 
                                    styles.positive : styles.negative, {fontSize: isMobile ? 13 : 16}]}>
                                {formattedChange} ({formattedPercentage})
                            </Text>
                        </View>
                    </View>
                </View>
                
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>AI Research Summary</Text>
                </View>
                <View style={[{zIndex: 0 , marginBottom: 24}, isMobile && {marginHorizontal: 16, marginTop: 16,}]}>
                    {(startDate && endDate && selectedStockData )&&<StockChart startDate={startDate} endDate={endDate} stockData={selectedStockData}  symbol={ticker} dateInterval={dateInterval} height={250} title="Price History"/>}
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About the Company</Text>
                    <Text style={{fontSize: 14, color: theme.colors.labelColor, lineHeight: 22}} numberOfLines={3}>{description}</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Price Action Summary</Text>
                    {priceSummaryLoading ? (<Text>Loading Price Action Summary...</Text>) : 
                        priceSummaryError ? (<Text>{priceSummaryError}</Text>) : 
                        (<Text style={{fontSize: 14, color: theme.colors.labelColor, lineHeight: 22}}>{priceActionSummary?.summary}</Text>)}
                </View>
                <View style={[styles.rowContainer, {flexDirection: isMobile ? 'column' : 'row',}]}>
                    <View style={styles.halfSection}>
                        <Text style={styles.sectionTitle}>Technical Pattern Signals</Text>
                    </View>
                    <View style={styles.halfSection}>
                        <Text style={styles.sectionTitle}>Analyst Sentiment</Text>
                    </View>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Recent News Summary</Text>
                    {newsSummaryLoading ? (<Text>Loading Recent News Summary...</Text>) : 
                        newsSummaryError ? (<Text>{newsSummaryError}</Text>) : 
                        (<><Text style={{fontSize: 14, color: theme.colors.labelColor, lineHeight: 22}}>{summary?.[0]}</Text>
                            <View>{summary?.slice(1).map((bullet, index) => (<Text key={index}>• {bullet}</Text>))}</View>
                        </>)}
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
        borderRadius: 12,
        padding: 24,
        marginBottom: 24,
    },

    chartContainer: {
        borderRadius: 16,
        height: 250,
        padding: 15,
        marginBottom: 12,
    },

    rowContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 24,
        gap: 24,
    },

    halfSection: {
        backgroundColor: theme.colors.cardBackgroundColor,
        borderRadius: 12,
        padding: 24,
        flex: 1,
        borderColor: theme.colors.cardBorderColor,
        borderWidth: 1,
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
