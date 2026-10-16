import {useState} from "react";
import {Pressable, Text, StyleSheet, ScrollView, View} from 'react-native';
import StockCard from "../components/StockCard";

import  StockSearchbar  from '../components/StockSearchbar';
import { theme } from "../constants/theme";


function WatchlistScreen(){
    const [watchlistArray, setWatchlistArray] = useState([])
    const handleWatchlistChange = (item) => {
        
        if (!watchlistArray.includes(item.symbol)) {
            setWatchlistArray([...watchlistArray, item.symbol])
        }
        
    };

    const removeFromWatchlist = (item) => {
        setWatchlistArray(watchlistArray.filter((stock) => stock !== item))
    }

    return (
        <ScrollView style={styles.container}>
            <StockSearchbar onSelectedStockChange={handleWatchlistChange} placeholder="Search to add to watchlist"/>
            <View style={styles.stockSection}>
                {watchlistArray.map((stock) => (
                    <StockCard stock={stock} removeStock={removeFromWatchlist}/>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        marginHorizontal: theme.spacing.pageHorizontalMargin,
        marginTop: theme.spacing.sectionTopMargin,
    },

    stockSection:{
        gap: theme.spacing.formRowgap,
    }

})
export default WatchlistScreen;