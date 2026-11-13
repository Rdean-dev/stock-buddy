import { DataTable, IconButton, MD3Colors, Card } from 'react-native-paper';
import { theme } from "../constants/theme";
import {StyleSheet, View, Text, Image, useWindowDimensions} from 'react-native';
import { Breakpoints } from '../constants/breakpoints';
import { useState } from "react";
import type { WatchlistStock, StockProfile, AlphaVantageDailyResponse } from '../types/stock';
import Sparkline  from "../components/Sparkline";
import  formatStockProfile  from "../utils/formatStockProfile";

type StockTableProps = {
    watchlistArray: WatchlistStock[];
    removeStock: (item: WatchlistStock) => void;
    profileData: Partial<Record<string, StockProfile>>;
    historicalData: Partial<Record<string, AlphaVantageDailyResponse>>;
};

type Columns = | 'company' | 'price' | 'today' | 'volume' | null;


export default function StockTable({watchlistArray, removeStock, profileData, historicalData} : StockTableProps) {
    const { width } = useWindowDimensions();
    
    const isMobile = width < Breakpoints.mobile;

    const [sortAscending, setSortAscending] = useState<boolean>(true);
    const [sortColumn, setSortColumn] = useState<Columns>(null);
    const sortedStocks = 
        sortColumn == 'price' ? [...watchlistArray].sort((a,b) => {
            const priceA = profileData[a.symbol]?.price;
            const priceB = profileData[b.symbol]?.price;

            if (priceA == null && priceB == null) return 0;
            if (priceA == null) return 1;
            if (priceB == null) return -1;

            if (sortAscending) {
                return priceA - priceB
            }
            return priceB - priceA
        }) : 
        sortColumn === 'company' ? [...watchlistArray].sort((a,b) => {
            if (sortAscending) {
                return a.symbol.localeCompare(b.symbol)
            }
            return b.symbol.localeCompare(a.symbol)
        }) : 
        sortColumn === 'today' ? [...watchlistArray].sort((a,b) => {
            const changePA = profileData[a.symbol]?.changePercentage;
            const changePB = profileData[b.symbol]?.changePercentage;

            if (changePA == null && changePB == null) return 0;
            if (changePA == null) return 1;
            if (changePB == null) return -1;
            
            if (sortAscending) {
                return changePA - changePB
            }
            return changePB - changePA
        }) : 
        sortColumn == 'volume' ? [...watchlistArray].sort((a,b) => {
            const priceA = profileData[a.symbol]?.volume;
            const priceB = profileData[b.symbol]?.volume;

            if (priceA == null && priceB == null) return 0;
            if (priceA == null) return 1;
            if (priceB == null) return -1;

            if (sortAscending) {
                return priceA - priceB
            }
            return priceB - priceA
        }) :
        watchlistArray;

    const handleDirectionChange = (column: Columns) => {
        if (column === sortColumn) {
            setSortAscending(!sortAscending);
        }else{
            setSortAscending(true);
        }
        
        setSortColumn(column);
    }


    return (
        <Card>
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title onPress={() => {handleDirectionChange('company')}} sortDirection= {sortColumn === 'company' ? sortAscending ? 'ascending' : 'descending' : undefined} style={[styles.companyColumn, isMobile && styles.mobileHeader]}>Company</DataTable.Title>
                    <DataTable.Title onPress={() => {handleDirectionChange('price')}} sortDirection= {sortColumn === 'price' ? sortAscending ? 'ascending' : 'descending' : undefined} style={[styles.priceColumn, isMobile && {flex: 1}]} numeric>Price</DataTable.Title>
                    <DataTable.Title onPress={() => {handleDirectionChange('today')}} sortDirection= {sortColumn === 'today' ? sortAscending ? 'ascending' : 'descending' : undefined} style={styles.todayColumn} numeric>Today</DataTable.Title>
                    {!isMobile && <DataTable.Title
                        onPress={() => handleDirectionChange('volume')}
                        sortDirection={
                            sortColumn === 'volume'
                            ? sortAscending ? 'ascending' : 'descending'
                            : undefined
                        }
                        style={styles.volumeColumn}
                        numeric
                    >Volume</DataTable.Title>}
                    {!isMobile && <DataTable.Title style={styles.trendColumn} textStyle={{fontWeight: '500'}} numeric>7-Day Trend</DataTable.Title>}
                    <DataTable.Title style={styles.exitColumn}>{''}</DataTable.Title>
                </DataTable.Header>

                {sortedStocks.length > 0 && sortedStocks.map((stock) => {

                    const profile = profileData[stock.symbol];
                    const historicalStockData = historicalData[stock.symbol]
                    
                    const {formattedPrice, formattedChange, changePercentage, formattedPercentage, volume} = formatStockProfile(profile)

                    return (
                        <DataTable.Row key={stock.symbol} style={{paddingVertical: 10}}>
                            <DataTable.Cell style={[styles.companyColumn, isMobile && styles.mobileHeader]}>
                                <View style={{flexDirection: 'row', alignItems: 'center', gap: 7, flex: 1, minWidth: 0}}>
                                    <Image
                                        style={{width: 37, height: 37, alignContent: 'center', borderRadius: 6,}}
                                        source={{uri: profile?.image}}
                                        resizeMode='contain'></Image>
                                    <View style={{flexDirection: 'column', gap: 2, flex: 1, minWidth: 0}}>
                                        <Text style={[styles.symbolStyle, {fontSize: isMobile ? 15 : 17}]}>{stock.symbol}</Text>
                                        <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.stockNameStyle, {fontSize: isMobile ? 12 : theme.typography.labelSize}]}>{stock.name}</Text>
                                    </View>
                                </View>
                            </DataTable.Cell>
                            <DataTable.Cell style={[styles.priceColumn, { paddingRight: 0 }, isMobile && {flex: 1}]} numeric>
                                <Text numberOfLines={1} style={{fontWeight: '700', fontSize: isMobile ? 15 : 17}}>
                                    {formattedPrice}
                                </Text>
                            </DataTable.Cell>
                            <DataTable.Cell style={[styles.todayColumn, { paddingRight: 0 }]} numeric>
                                <View style={{flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-end' :  'center', gap: isMobile ?  2 : 5}}>
                                    <Text 
                                        style={[styles.changeText, (changePercentage ?? 0) >= 0 ? 
                                            styles.positive : styles.negative, {fontSize: isMobile ? 13 : 16}]}>
                                        {formattedChange} ({formattedPercentage})
                                    </Text>
                                </View>
                            </DataTable.Cell>
                           {!isMobile && <DataTable.Cell style={[styles.volumeColumn, { paddingRight: 0 }]} numeric>
                                <Text style={{ fontWeight: '600', fontSize: isMobile ? 15 : 17 }}>
                                    {volume}
                                </Text>
                            </DataTable.Cell>}
                            {!isMobile && <DataTable.Cell style={styles.trendColumn}numeric><View style={{paddingLeft: 24}}>{historicalStockData ? <Sparkline historicalData={historicalStockData}/> : <Text>--</Text>}</View></DataTable.Cell>}
                            <DataTable.Cell style={styles.exitColumn}>
                                <IconButton
                                    icon='close'
                                    iconColor={MD3Colors.error50}
                                    size={20}
                                    onPress={() => removeStock(stock)}
                                    accessibilityLabel={`Remove ${stock.symbol} from watchlist`}
                                />
                            </DataTable.Cell>
                        </DataTable.Row>
                    )
                    }
                )}
            </DataTable>
        </Card>
    )
}

const styles = StyleSheet.create({
    stockNameStyle:{
        color: theme.colors.labelColor,
        fontWeight: theme.typography.labelWeight,
    },
    symbolStyle:{
        color: 'black',
        fontSize: 17,
        fontWeight: '700',
    },
    changeText:{
        fontSize: 16,
        fontWeight: '600',
    },
    positive:{
        color: theme.colors.positive,
    },
    negative:{
        color: theme.colors.negative,
    },
    exitColumn:{
        flexGrow: 0,
        flexBasis: 44,
        flexShrink: 0,
    },
    mobileHeader: {
        flex: 2,
        paddingRight: 8,
    },
    companyColumn: { 
        flex: 1.2 
    },
    priceColumn: { 
        flex: 0.6 
    },
    todayColumn: { 
        flex: 1.4 
    },
    volumeColumn: { 
        flex: 1 
    },
    trendColumn: { 
        flex: 1 
    },

});