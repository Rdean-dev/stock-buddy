
import React, { useState, useEffect } from "react";
import { Searchbar } from "react-native-paper";
import {Pressable, StyleSheet, View, Text} from "react-native";
import { searchStocksData } from "../services/stockService";

export default function StockSearchbar({onSelectedStockChange, variant, placeholder, style, inputStyle}){
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {

        if (searchQuery === '') {
            setSearchResults([]);
            return;
        }
        const timer =  setTimeout(async () => {
            const results = await searchStocksData(searchQuery)
            setSearchResults(results);
            
        }, 500);

        return () => {
            clearTimeout(timer);
        };
    }, [searchQuery]);
    console.log('Search Result', searchResults)
    
    return(
        <View style={{alignSelf: 'stretch'}}>
            <Searchbar
                placeholder={placeholder}
                onChangeText={setSearchQuery}
                value={searchQuery}
                placeholderTextColor= '#64748B'
                iconColor='#475569'
                iconSize='20'
                elevation='0'
                style={[styles.searchbarStyle, variant === 'global' ? styles.globalStyle : styles.scannerStyle, style]}
                inputStyle={[variant === 'global' ? styles.globalInputStyle : styles.scannerInputStyle, { fontWeight: '400', color: '#0F172A' }, inputStyle]}
                
            />
            <View style={[styles.searchResultsStyle, {top: variant === 'global' ? 46 : 60}]}>
                {searchResults.length > 0 && searchResults.map((result) => (
                    <Pressable key={result.symbol} 
                        onPress={() => {onSelectedStockChange(result);  setSearchResults([]);} }>
                        {({hovered, pressed}) => (
                            <View style={[styles.searchResultItem, (hovered || pressed) && styles.itemHovered]}>
                                <Text style={[styles.searchResultText, styles.symbolText]}> {result.symbol}</Text>
                                <Text style={[styles.searchResultText, styles.companyText]} numberOfLines={1} ellipsizeMode="tail">{result.name}</Text>
                            </View>
                        )}
                    </Pressable>
                ))}
            </View>
        </View>

    );
        
}

const styles = StyleSheet.create({
    searchbarStyle:{
        width: 400,
        height: 60,
        borderRadius: 10,
        
    },
    searchResultsStyle:{
        position: 'absolute',
        left: 0, 
        width: '100%',
        zIndex: 1,
    },
    searchResultItem:{
        backgroundColor: "white",
        flexDirection: 'row',
        width: '100%', 
        paddingHorizontal: 15, 
        paddingVertical: 10, 
        gap: 40
    },
    searchResultText:{
        fontSize: 18,
        fontWeight: '600', 
    },
    itemHovered:{
        backgroundColor: 'grey',
    },
    symbolText: {
        width: 120,
    },

    companyText: {
        flex: 1,
    },
    globalStyle:{
        backgroundColor: "#FFFFFF",
        width: 280,
        height: 46,
        borderWidth: 1,
        borderColor: '#D9E1EA',
        borderRadius: 9,
        minHeight: 0,
    },
    scannerStyle:{
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: '#CBD5E1',
        borderRadius: 8,
    },

    globalInputStyle:{
        fontSize:14,
        minHeight: 0,
        height: 46,
        paddingVertical: 0,
    },
    
    scannerInputStyle:{
        fontSize:16,
    },

});
