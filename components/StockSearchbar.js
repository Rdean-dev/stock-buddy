
import React, { useState, useEffect } from "react";
import { Searchbar } from "react-native-paper";
import {Pressable, StyleSheet, View, Text} from "react-native";
import { searchStocksData } from "../services/stockService";

export default function StockSearchbar({selectedStock, onSelectedStockChange}){
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {

        if (searchQuery === '') {
            return;
        }
        const timer =  setTimeout(async () => {
            const results = await searchStocksData(searchQuery)
            setSearchResults(results);
            console.log(results);
        }, 500);

        return () => {
            clearTimeout(timer);
        };
    }, [searchQuery]);

    console.log("searchResults:", searchResults);
    return(
        <View>
            <Searchbar
                placeholder="Search Ticker or Company"
                onChangeText={setSearchQuery}
                value={searchQuery}
                rippleColor={'blue'}
                style={styles.searchbarStyle}
                
            />
            {searchResults.map((result) => (
                <Pressable key={result.symbol} onPress={() => onSelectedStockChange(result)}>
                    <View>
                        <Text>{result.symbol}</Text>
                        <Text>{result.name}</Text>
                    </View>
                </Pressable>
            ))}
        </View>

    );
        
}

const styles = StyleSheet.create({
    searchbarStyle:{
        width: 300,
        height: 50,
        borderRadius: 10,
        marginTop: 25,
    },
});
