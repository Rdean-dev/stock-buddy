import {View, Text} from 'react-native';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import StockSearchBar from "../StockSearchbar";
import { router } from "expo-router";
import { Breakpoints } from '../../constants/breakpoints';
import { StyleSheet, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';


function navigationToStock(stock) {

    router.push({
        pathname: "/stock-detail",
        params: {ticker: stock.symbol}
    })

}

export default function AppHeader(params) {
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const isMobile = width < Breakpoints.mobile;

    return isMobile ? (
        <View style={[styles.mobileHeaderStyle, { paddingTop: insets.top + 12 }]}>
            <View style={styles.mobileTopRow}>
                <Text style={styles.mobileTitle}>{params.options.title}</Text>
                <FontAwesome size={25} name="bell-o" color='#475569' style={{}}/>
                <Ionicons name="person-circle" color="#64748B" size={35} style={{marginLeft: 8}}/>
            </View>
            <StockSearchBar onSelectedStockChange={navigationToStock} variant="global" placeholder='Search any stock...' style={{width: '100%', height: 42, borderRadius: 10,}} inputStyle={{height: 42, fontSize: 16,}}/>
        </View>
    ) : (
        <View style={styles.headerStyle}>
            <Text style={styles.titleStyle}>{params.options.title}</Text>
            <StockSearchBar onSelectedStockChange={navigationToStock} variant="global" placeholder='Search any stock...'/>
            <FontAwesome size={24} name="bell-o" color='#475569' style={{}}/>
            <Ionicons name="person-circle" color="#64748B" size={40} />
        </View>
    );
}

    

const styles = StyleSheet.create({
    headerStyle:{
        backgroundColor: '#F5F7FA', 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 24, 
        minHeight: 50, 
        paddingHorizontal: 24, 
        paddingTop: 16, 
        paddingBottom: 0,
    },
    mobileHeaderStyle:{
        flexDirection: 'column',
        paddingHorizontal: 16,
        paddingTop: 12, 
        paddingBottom: 12,
        gap: 12,

    },
    titleStyle:{
        flex: 1, 
        fontSize: 35, 
        lineHeight: 35, 
        letterSpacing: -0.8, 
        fontWeight: 700, 
        color: '#0F172A',
    },
    mobileTitle:{
        flex: 1, 
        fontSize: 26, 
        lineHeight: 35, 
        letterSpacing: -0.3, 
        fontWeight: '700', 
        color: '#0F172A'
    },
    mobileTopRow: {
        flexDirection: 'row',
        alignItems: 'center', 
        width: '100%', 
        gap: 8
    },
});