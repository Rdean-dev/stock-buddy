import StockDetailScreen from "../screens/StockDetailScreen.jsx";
import { useLocalSearchParams } from 'expo-router';


export default function StockDetail(){
    const {ticker} = useLocalSearchParams<{ ticker:string}>();
    return <StockDetailScreen ticker={ticker}/>;
}