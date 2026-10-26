import React from 'react';
import {Text, View, StyleSheet, Pressable} from 'react-native';
import { theme } from "../constants/theme";
import {Link } from "expo-router";
import type {WatchlistStock} from '../types/stock'
type StockCardProps = {
    stock: WatchlistStock;
    removeStock: (item: WatchlistStock) => {};
};

export default function StockCard({stock, removeStock}: StockCardProps){
    return (
                
            <View style={styles.stockCard}>
                <Link href={{
                    pathname : "/stock-detail",
                    params: {ticker: stock.symbol}}} asChild>
                    <Pressable>
                        <Text style={styles.tickerText}>Ticker Symbol - {stock.symbol}</Text>
                        <Text style={styles.stockText}>{stock.name}</Text>
                    </Pressable>
                </Link>
                <Pressable style={styles.removeButton} onPress={() => removeStock(stock)}><Text>Remove from Watchlist</Text></Pressable>
            </View>
                
            );
}

const styles = StyleSheet.create({
    stockCard: {
        backgroundColor: theme.colors.cardBackgroundColor,
        borderRadius: theme.radii.cardRadius,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    stockText: {
        color: theme.colors.labelColor,
    },
    tickerText: {
        fontSize: theme.typography.labelSize,
        fontWeight: theme.typography.labelWeight,
        color: theme.colors.labelColor,
    },
    removeButton:{
        paddingHorizontal: 10,
        paddingVertical: 5,
    },

})