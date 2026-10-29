import type {AlphaVantageDailyResponse} from '../types/stock'
import { LineChart } from "react-native-wagmi-charts";
import normalizeLineChartData from '../utils/normalizeLineChartData';
import { useState } from "react";
import { View } from "react-native";
import type { LayoutChangeEvent } from "react-native";
type SparklineProps = {
    historicalData: AlphaVantageDailyResponse;
}

export default function Sparkline({historicalData}: SparklineProps) {
    const [chartWidth, setChartWidth] = useState<number>(0);
    const lineChartData = normalizeLineChartData(historicalData);
    return (
        
        <View onLayout={(event: LayoutChangeEvent) => 
            setChartWidth(event.nativeEvent.layout.width)}
            style={{width: '100%', height: 35}}>
            {chartWidth > 0 && 
                <LineChart.Provider data={lineChartData}>
                    <LineChart width={chartWidth} height={35}>
                        <LineChart.Path />
                    </LineChart>
                </LineChart.Provider>
            }
        </View>
        
    );    
}