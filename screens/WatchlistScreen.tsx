import {useState, useEffect, useRef} from "react";
import {Pressable, Text, StyleSheet, ScrollView, View} from 'react-native';
import StockTable from "../components/StockTable";
import { getStockProfile, getMarketStatus } from "../services/stockService";
import  StockSearchbar  from '../components/StockSearchbar';
import { theme } from "../constants/theme";
import { mockWatchlist, mockProfileData } from "../utils/test";
import type {WatchlistStock, StockProfile, MarketState} from '../types/stock';
import  Marker  from "../components/Marker";

const USE_MOCK_DATA = true;

function WatchlistScreen(){
    const [watchlistArray, setWatchlistArray] = useState<WatchlistStock[]>([  
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

    const [profileData, setProfileData] = useState<Partial<Record<string, StockProfile>>>({});

    const [marketState, setMarketState] = useState<MarketState | null>(null);

    let marketStatement = '';

    useEffect(() => {
        const getMarketStatusVisual = async () => {
            const marketStatus = await getMarketStatus();
            console.log("Market Status: ", marketStatus);
            if (marketStatus) {
                setMarketState(marketStatus);
            }
        }

        getMarketStatusVisual();
    },[])

    useEffect(() => {
        if (USE_MOCK_DATA) return;
        const getWatchlistData = async (stockSymbol: string) => {
        
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
    const attemptedRef = useRef(new Set<string>());
    const handleWatchlistChange = (item: WatchlistStock) => {
        
        if (!watchlistArray.some((stock) => stock.symbol === item.symbol)) {
            setWatchlistArray([...watchlistArray, item])
        }
        
    };

    const removeFromWatchlist = (item: WatchlistStock) => {
        setWatchlistArray(watchlistArray.filter((stock) => stock.symbol !== item.symbol))
    }

    console.log('Watchlist',watchlistArray );

    if (marketState === null) {
        marketStatement = 'Market status unavailable';
    } else if (marketState.is_market_open === true) {
        marketStatement = "Market open";
    } else{
        marketStatement = "Market closed";
    }
    return (
        <>
            <View>
                <Text style={theme.subtitle}>Your stocks, all in one place</Text>
            </View>
            <ScrollView style={styles.container}>
                <View style={{flexDirection: 'row', gap: 25}}>
                    {watchlistArray.length > 0 && <Text style={styles.label}>{watchlistArray.length} stocks</Text>}
                    <StockSearchbar onSelectedStockChange={handleWatchlistChange} placeholder="Search to add to watchlist" variant='scanner'/>
                    <View style={{flexDirection: 'row', gap: 5, justifyContent: 'flex-end', alignItems: 'center'}}>
                        <Marker shape="circle" color={marketStatement === "Market open" ? theme.colors.positive : theme.colors.negative}/>
                        <Text style={styles.label}>{marketStatement}</Text>
                    </View>
                </View>
                <View style={styles.stockSection}>
                    <StockTable watchlistArray={mockWatchlist} removeStock={removeFromWatchlist} profileData={mockProfileData}/>

                </View>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        marginHorizontal: theme.spacing.pageHorizontalMargin,
    },

    stockSection:{
        gap: theme.spacing.formRowgap,
        marginTop: theme.spacing.sectionTopMargin,

    },
    label:{
        color: theme.colors.labelColor,
        fontSize: theme.typography.labelSize,
        fontWeight: '500',
        lineHeight: 18,
        alignContent: 'center'
    },

})
export default WatchlistScreen;