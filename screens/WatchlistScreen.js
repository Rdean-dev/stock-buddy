import React from "react";
import {Pressable, Text, StyleSheet, ScrollView} from 'react-native';
import StockCard from "../components/StockCard";
import {Link } from "expo-router";


const stockData = [
    {
        ticker: "BALL",
        company: "Ball Corp",
        price: 49.53,
        change: "-1.2%",
        trend: "Downtrend",
        risk: "Conservative",
        patterns: "3"
    },
    {
        ticker: "AAPL",
        company: "Apple Inc.",
        price: 189.42,
        change: "+1.2%",
        trend: "Uptrend",
        risk: "Moderate",
        patterns: "2"
    },
];

function WatchlistScreen(){

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>My Watchlist</Text>
            

            {stockData.map((stock) => (
                <Link key={stock.ticker} href={{
                    pathname : "/stock-detail",
                    params: {ticker: stock.ticker}}} asChild>
                    <Pressable >
                        <StockCard stock={stock}/>
                    </Pressable>
                </Link>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({

    container: {
        backgroundColor: "#0a0a0a",
        flex: 1,
    },
    
    title: {
        fontSize: 80,
        color: "white"
    },
})
export default WatchlistScreen;