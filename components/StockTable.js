import { DataTable, IconButton, MD3Colors } from 'react-native-paper';
import { theme } from "../constants/theme";
import {StyleSheet, View, Text, Image} from 'react-native';

export default function StockTable({watchlistArray, removeStock, profileData}) {

    return (
    <DataTable>
        <DataTable.Header>
            <DataTable.Title>Company</DataTable.Title>
            <DataTable.Title>Price</DataTable.Title>
            <DataTable.Title>Today</DataTable.Title>
            <DataTable.Title>7-Day Trend</DataTable.Title>
            <DataTable.Title></DataTable.Title>
        </DataTable.Header>

        {watchlistArray.length > 0 && watchlistArray.map((stock) => {

            const profile = profileData[stock.symbol];
            const changePercentage = profile?.changePercentage;
            const plusOrMinus = changePercentage > 0 ? '+' : '';
            return (
                <DataTable.Row key={stock.symbol}>
                    <DataTable.Cell>
                        <View style={{flexDirection: 'row', alignItems: 'center', gap: 7}}>
                            <Image
                                style={{width: 37, height: 37, alignContent: 'center', borderRadius: 6,}}
                                source={{uri: profile?.image}}
                                resizeMode='contain'></Image>
                            <View style={{flexDirection: 'column', gap: 2, padding: 10}}>
                                <Text style={styles.symbolStyle}>{stock.symbol}</Text>
                                <Text style={styles.stockNameStyle}>{stock.name}</Text>
                            </View>
                        </View>
                    </DataTable.Cell>
                    <DataTable.Cell ><Text style={{fontWeight: '700', fontSize: 17}}>{`$${profile?.price}` ?? '--'}</Text></DataTable.Cell>
                    <DataTable.Cell ><View style={{flexDirection: 'row', gap: 5}}><Text style={[styles.changeText, changePercentage >= 0 ? styles.positive : styles.negative]}>{`$${profile?.change ?? '--'}`}</Text><Text style={[styles.changeText, changePercentage >= 0 ? styles.positive : styles.negative]}>({`${plusOrMinus}${profile?.changePercentage?.toFixed(2)}%` ?? '--'})</Text></View></DataTable.Cell>
                    <DataTable.Cell>--</DataTable.Cell>
                    <DataTable.Cell>
                        <IconButton
                            icon='close'
                            iconColor={MD3Colors.error50}
                            size={20}
                            onPress={() => removeStock(stock)}
                        />
                    </DataTable.Cell>
                </DataTable.Row>
            )
            }
        )}
        <DataTable.Pagination 
            onPageChange={page => {
            console.log(page);
        }}/>
    </DataTable>)
}

const styles = StyleSheet.create({
    stockNameStyle:{
        color: theme.colors.labelColor,
        fontSize: theme.typography.labelSize,
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
});