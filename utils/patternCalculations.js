
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

export function isBullishEngulfing(previousCandle, currentCandle) {
    
    return ((previousCandle.close < previousCandle.open) && 
        (currentCandle.close > currentCandle.open) && 
        (currentCandle.open <= previousCandle.close) && 
        (currentCandle.close >= previousCandle.open) && 
        (currentCandle.open <= previousCandle.close || currentCandle.close >= previousCandle.open));
}

export function isBearishEngulfing(previousCandle, currentCandle) {
    
    return ((previousCandle.close > previousCandle.open) && 
        (currentCandle.close < currentCandle.open) && 
        (currentCandle.open >= previousCandle.close) && 
        (currentCandle.close <= previousCandle.open) && 
        (currentCandle.open >= previousCandle.close || currentCandle.close <= previousCandle.open));
}

export function isMorningStar(firstCandle, secondCandle, thirdCandle) {
    
    const firstBody = Math.abs(firstCandle.close - firstCandle.open);
    const secondBody = Math.abs(secondCandle.close - secondCandle.open);
    
    const midpoint = (firstCandle.open + firstCandle.close) / 2;

    
    return (
        (firstCandle.close < firstCandle.open) && 
        (secondBody <= 0.3 * firstBody) && 
        (thirdCandle.close > thirdCandle.open) &&
        (thirdCandle.close > midpoint) 
    );
}