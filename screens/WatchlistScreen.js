import {useState, useEffect, useRef} from "react";
import {Pressable, Text, StyleSheet, ScrollView, View} from 'react-native';
import StockTable from "../components/StockTable";
import { getStockProfile } from "../services/stockService";
import  StockSearchbar  from '../components/StockSearchbar';
import { theme } from "../constants/theme";


function WatchlistScreen(){
    const [watchlistArray, setWatchlistArray] = useState([  
    {
        "symbol": "AAPL",
        "name": "Apple Inc."
    },
    {
        "symbol": "TSLA",
        "name": "Tesla, Inc."
    },
    {
        "symbol": "AMZN",
        "name": "Amazon.com, Inc."
    },
    {
        "symbol": "MSFT",
        "name": "Microsoft Corporation"
    },
    {
        "symbol": "DELL",
        "name": "Dell Technologies Inc."
    }]);

    const [profileData, setProfileData] = useState({});


    useEffect(() => {
        const getWatchlistData = async (stockSymbol) => {
        
            const profile = await getStockProfile(stockSymbol);
            
            console.log("Profile Data:",profile);
            if (profile){
                setProfileData(previous => ({...previous, [stockSymbol]: profile}));
            }


        }
        const filteredWatchlistArray = watchlistArray.filter((stock) => !profileData[stock.symbol] /*&& !fetchingRef.current.has(stock.symbol)*/ && !attemptedRef.current.has(stock.symbol))
        
        Promise.all(filteredWatchlistArray.map((watchlistStock) => {attemptedRef.current.add(watchlistStock.symbol); /*fetchingRef.current.add(watchlistStock.symbol);*/ return getWatchlistData(watchlistStock.symbol)}));
        
    },[watchlistArray, profileData])

    //const fetchingRef = useRef(new Set());
    const attemptedRef = useRef(new Set());
    const handleWatchlistChange = (item) => {
        
        if (!watchlistArray.some((stock) => stock.symbol === item.symbol)) {
            setWatchlistArray([...watchlistArray, item])
        }
        
    };

    const removeFromWatchlist = (item) => {
        setWatchlistArray(watchlistArray.filter((stock) => stock.symbol !== item.symbol))
    }

    console.log('Watchlist',watchlistArray );
    return (
        <ScrollView style={styles.container}>
            <StockSearchbar onSelectedStockChange={handleWatchlistChange} placeholder="Search to add to watchlist"/>
            <View style={styles.stockSection}>
                <StockTable watchlistArray={watchlistArray} removeStock={removeFromWatchlist} profileData={profileData}/>

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
        marginTop: theme.spacing.sectionTopMargin,

    }

})
export default WatchlistScreen;