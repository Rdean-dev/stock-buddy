import React from 'react';
import {Text, View, StyleSheet} from 'react-native';


export default function StockCard({stock}){
    return (
                
            <View style={styles.stockCard}>
                <Text style={styles.tickerText}>Ticker Symbol - {stock.ticker}</Text>
                <Text style={styles.stockText}>Price - {stock.price}</Text>
                <Text style={styles.stockText}>Daily Percent Change - {stock.change}</Text>
                <Text style={styles.stockText}>Trend - {stock.trend}</Text>
                <Text style={styles.stockText}>Risk Category - {stock.risk}</Text>
                <Text style={styles.stockText}>Patterns - {stock.patterns}</Text>
            </View>
                
            );
}

const styles = StyleSheet.create({
    stockCard: {
        backgroundColor: "#1a1a1a",
        margin: 8,
        borderRadius: 15,
        padding: 15,
    },

    stockText: {
        color: "#d4d4d4",
    },
    tickerText: {
        fontSize: 22,
        fontWeight: "bold",
        color: "white",
        marginBottom: 4,
    },

})