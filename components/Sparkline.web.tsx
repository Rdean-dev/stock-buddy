import type { AlphaVantageDailyResponse } from '../types/stock'
import normalizeLineChartData from '../utils/normalizeLineChartData';
import { theme } from "../constants/theme";
import { useId } from "react";

type SparklineProps = {
    historicalData: AlphaVantageDailyResponse;
}

export default function Sparkline({ historicalData }: SparklineProps) {

    const lineChartData = normalizeLineChartData(historicalData);

    const width = 120;
    const height = 35;
    const padding = 3;
    const chartHeight = height - 2 * padding
    const chartWidth = width - 2 * padding
    const gradientId = useId()

    const values = lineChartData.map(point => point.value)
    if (values.length < 2) return null;


    const min = Math.min(...values);
    const max = Math.max(...values)

    const points = values.map((value, index) => {
        const x = (index / (values.length - 1)) * chartWidth + padding;

        const y = max === min ? chartHeight / 2 : ((value - min) / (max - min)) * chartHeight;

        return `${x},${height - padding - y}`;
    }).join(' ');
    const strokeColor = (values[values.length - 1] > values[0]) ? theme.colors.positive : (values[values.length - 1] < values[0]) ? theme.colors.negative : 'grey'
    const rightX = width - padding
    const leftX = padding
    const shadedPoints = `${points} ${rightX},${height} ${leftX},${height}`
    return (
        <div>
            <svg width={width} height={height}>
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={strokeColor} stopOpacity={0.35} />
                        <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <polygon
                    points={shadedPoints}
                    fill={`url(#${gradientId})`}
                    stroke='none'
                />
                <polyline
                    points={points}
                    fill='none'
                    stroke={strokeColor}
                    strokeWidth='2' />

            </svg>
        </div>


    );
}