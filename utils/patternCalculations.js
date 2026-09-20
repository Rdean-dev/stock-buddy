
export function isDoji(candle){

    const bodySize = Math.abs(candle.open - candle.close);
    const candleRange = candle.high - candle.low;

    return candleRange > 0 && bodySize <= candleRange * 0.05;
}

export function isHammer(candle) {
    const bodySize = Math.abs(candle.open - candle.close);
    const lowerRange = Math.min(candle.open, candle.close) - candle.low;
    const upperRange = candle.high - Math.max(candle.open, candle.close);

    return lowerRange >= 2 * bodySize && upperRange <= bodySize && bodySize > 0;

}