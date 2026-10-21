import { DataTable, IconButton, MD3Colors } from 'react-native-paper';
import { theme } from "../constants/theme";
import {StyleSheet, View, Text, Image, useWindowDimensions} from 'react-native';
import { Breakpoints } from '../constants/breakpoints';

export default function StockTable({watchlistArray, removeStock, profileData}) {
    const { width } = useWindowDimensions();
    
    const isMobile = width < Breakpoints.mobile;


    return (
    <DataTable>
        <DataTable.Header>
            <DataTable.Title style={isMobile && styles.mobileHeader}>Company</DataTable.Title>
            <DataTable.Title numeric>Price</DataTable.Title>
            <DataTable.Title numeric>Today</DataTable.Title>
            {!isMobile && <DataTable.Title style={{paddingLeft: 24,}}>7-Day Trend</DataTable.Title>}
            <DataTable.Title style={styles.exitColumn}></DataTable.Title>
        </DataTable.Header>

        {watchlistArray.length > 0 && watchlistArray.map((stock) => {

            const profile = profileData[stock.symbol];
            const changePercentage = profile?.changePercentage;
            const plusOrMinus = changePercentage > 0 ? '+' : changePercentage < 0 ? '-' : '';
            const formattedPrice = profile?.price != null ? `$${profile.price.toFixed(2)}` : '--';
            const formattedChange = profile?.change != null ? `${plusOrMinus}$${Math.abs(profile?.change).toFixed(2)}` : '--';
            const formattedPercentage = changePercentage != null ? `${plusOrMinus}${Math.abs(changePercentage).toFixed(2)}%` : '--';
            
            return (
                <DataTable.Row key={stock.symbol} style={{paddingVertical: 10}}>
                    <DataTable.Cell style={isMobile && styles.mobileHeader}>
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
                    <DataTable.Cell numeric>
                        <Text style={{fontWeight: '700', fontSize: isMobile ? 15 : 17}}>
                            {formattedPrice}
                        </Text>
                    </DataTable.Cell>
                    <DataTable.Cell numeric>
                        <View style={{flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-end' :  'center',gap: isMobile ?  2 : 5}}>
                            <Text 
                                style={[styles.changeText, changePercentage >= 0 ? 
                                    styles.positive : styles.negative, {fontSize: isMobile ? 13 : 16}]}>
                                {formattedChange}
                            </Text>
                            <Text style={[styles.changeText, changePercentage >= 0 ? 
                                styles.positive : styles.negative, {fontSize: isMobile ? 13 : 16}]}>
                                ({formattedPercentage})
                            </Text>
                        </View>
                    </DataTable.Cell>
                    {!isMobile && <DataTable.Cell style={{paddingLeft: 24,}}>--</DataTable.Cell>}
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
    </DataTable>)
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
});