import StockDetailScreen from "../../screens/StockDetailScreen.js";
import { useLocalSearchParams } from 'expo-router';


export default function StockDetail(){
    const {ticker} = useLocalSearchParams<{ ticker:string}>();
    return <StockDetailScreen ticker={ticker}/>;
}