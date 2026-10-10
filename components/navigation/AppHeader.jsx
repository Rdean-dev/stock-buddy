import {View, Text} from 'react-native';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import StockSearchBar from "../StockSearchbar";
import { router } from "expo-router";

function navigationToStock(stock) {

    router.push({
        pathname: "/stock-detail",
        params: {ticker: stock.symbol}
    })

}

export default function AppHeader(params) {
    return(
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 20, minHeight: 70, padding: 20,}}>
            <Text style={{flex: 1, fontSize: 32, fontWeight: 700, color: '#0F172A',}}>{params.options.title}</Text>
            <StockSearchBar onSelectedStockChange={navigationToStock} variant="global" placeholder='Search any stock...'/>
            <FontAwesome size={20} name="bell-o" color='black' />
            <Ionicons name="person-circle" color="black" size={20} />
        </View>
    );
}
