import {useState, useEffect, useRef} from "react";
import { Text, StyleSheet, ScrollView, View, AppState, useWindowDimensions} from 'react-native';
import StockTable from "../components/StockTable";
import { getStockProfile, getMarketStatus, getStockData } from "../services/stockService";
import  StockSearchbar  from '../components/StockSearchbar';
import { theme } from "../constants/theme";
import { mockWatchlist, mockProfileData, mockHistoricalData, } from '../utils/test';
import type {WatchlistStock, StockProfile, MarketState, AlphaVantageDailyResponse} from '../types/stock';
import  Marker  from "../components/Marker";
import { Breakpoints } from '../constants/breakpoints';

const USE_MOCK_DATA = true;

const countdownToMilliseconds = (countdown: string): number => {
    const [hours, minutes, seconds] = countdown.split(':').map(Number);

    return (hours * 3600 + minutes * 60 + seconds) * 1000



}

export default function WatchlistScreen(){
    const { width } = useWindowDimensions();
        
    const isMobile = width < Breakpoints.mobile;

    const [watchlistArray, setWatchlistArray] = useState<WatchlistStock[]>(mockWatchlist);

    const [profileData, setProfileData] = useState<Partial<Record<string, StockProfile>>>(USE_MOCK_DATA ? mockProfileData : {});

    const [marketState, setMarketState] = useState<MarketState | null>(null);

    const [historicalData, setHistoricalData] = useState<Partial<Record<string, AlphaVantageDailyResponse>>>(USE_MOCK_DATA ? mockHistoricalData : {});

    let marketStatement = '';

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout> | undefined;
        let active = true;
        let isFetching = false;
        const getMarketStatusVisual = async () => {
            if (isFetching) return;
            isFetching = true;
            try{
                const marketStatus = await getMarketStatus();
                if (!active) return;
                console.log("Market Status: ", marketStatus);
                if (marketStatus) {
                    setMarketState(marketStatus);
                    let delay = 60000;
                    const tcORto = marketStatus.is_market_open ? marketStatus.time_to_close : marketStatus.time_to_open;
                    if (typeof tcORto === "string") {
                        const tcORtoValue = countdownToMilliseconds(tcORto);
                        delay = Number.isFinite(tcORtoValue) ? Math.max(5000, tcORtoValue): 60000;
                    }
                    timer = setTimeout(() => {
                        getMarketStatusVisual();
                    }, delay);
                    
                }else{
                    setMarketState(null)
                    timer = setTimeout(() => {
                        getMarketStatusVisual();
                    }, 60000);
                }
            }finally{
                isFetching = false;
            }
            
        }

        getMarketStatusVisual();
        const subscription = AppState.addEventListener('change', (nextState) => {
            if (nextState === 'active') {
                clearTimeout(timer);
                getMarketStatusVisual();
            }

        });
        return () => {active = false; clearTimeout(timer); subscription.remove()};
    },[])

    useEffect(() => {
        if (USE_MOCK_DATA) return;
        const getWatchlistData = async (stockSymbol: string) => {
        
            const profile = await getStockProfile(stockSymbol);
            const hdata = await getStockData(stockSymbol);

            console.log("stock symbol",stockSymbol);
            console.log("histordata:",hdata);
            
            console.log("Profile Data:",profile);
            if (profile){
                setProfileData(previous => ({...previous, [stockSymbol]: profile}));
            }
            if (hdata) {
                setHistoricalData(previous => ({...previous, [stockSymbol]: hdata}))
            }


        }
        const filteredWatchlistArray = watchlistArray.filter((stock) => !profileData[stock.symbol] /*&& !fetchingRef.current.has(stock.symbol)*/ && !attemptedRef.current.has(stock.symbol))
        
        filteredWatchlistArray.forEach((stock) => {
            attemptedRef.current.add(stock.symbol);
        });

        const loadWatchlist = async () => {
            for(const stock of filteredWatchlistArray) {
                await getWatchlistData(stock.symbol);

                await new Promise<void>((resolve) => setTimeout(resolve, 1100));
            }
        };

        loadWatchlist();
        
    },[watchlistArray, profileData, historicalData])

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
            <View style={isMobile && {flexDirection: 'row', alignItems: 'center',}}>
                <Text style={[theme.subtitle]}>Your stocks, all in one place</Text>
            </View>
            <ScrollView style={styles.container}>
                <View style={[{flexDirection: 'row', gap: 25}, isMobile && {flexDirection: 'column'}]}>
                    {(watchlistArray.length > 0 && !isMobile) && <Text style={styles.label}>{watchlistArray.length} stocks</Text>}
                    <StockSearchbar onSelectedStockChange={handleWatchlistChange} placeholder="Search to add to watchlist" variant='scanner'/>
                    <View style={[{flexDirection: 'row', gap: 5, justifyContent: 'flex-end', alignItems: 'center'}, isMobile && {paddingHorizontal: 5,justifyContent: 'flex-start'}]}>
                        <Marker shape="circle" color={marketStatement === "Market open" ? theme.colors.positive : theme.colors.negative}/>
                        <Text style={styles.label}>{marketStatement}</Text>
                    </View>
                </View>
                <View style={styles.stockSection}>
                    <StockTable watchlistArray={watchlistArray} removeStock={removeFromWatchlist} profileData={profileData} historicalData={historicalData}/>
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
