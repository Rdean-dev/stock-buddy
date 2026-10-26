import type {Candle} from '../types/stock';

export function isDoji(candle: Candle){

    const bodySize = Math.abs(candle.open - candle.close);
    const candleRange = candle.high - candle.low;

    return candleRange > 0 && bodySize <= candleRange * 0.05;
}

export function isHammer(candle: Candle) {
    const bodySize = Math.abs(candle.open - candle.close);
    const lowerRange = Math.min(candle.open, candle.close) - candle.low;
    const upperRange = candle.high - Math.max(candle.open, candle.close);

    return lowerRange >= 2 * bodySize && upperRange <= bodySize && bodySize > 0;

}

export function isBullishEngulfing(previousCandle: Candle, currentCandle: Candle) {
    return (
        previousCandle.close < previousCandle.open &&
        currentCandle.close > currentCandle.open &&
        currentCandle.open <= previousCandle.close &&
        currentCandle.close >= previousCandle.open
    );
}

export function isBearishEngulfing(previousCandle: Candle, currentCandle: Candle) {
    return (
        previousCandle.close > previousCandle.open &&
        currentCandle.close < currentCandle.open &&
        currentCandle.open >= previousCandle.close &&
        currentCandle.close <= previousCandle.open
    );
}

export function isMorningStar(firstCandle: Candle, secondCandle: Candle, thirdCandle: Candle) {
    
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


export function isEveningStar(firstCandle: Candle, secondCandle: Candle, thirdCandle: Candle) {
    
    const firstBody = Math.abs(firstCandle.close - firstCandle.open);
    const secondBody = Math.abs(secondCandle.close - secondCandle.open);
    
    const midpoint = (firstCandle.open + firstCandle.close) / 2;

    
    return (
        (firstCandle.close > firstCandle.open) && 
        (secondBody <= 0.3 * firstBody) && 
        (thirdCandle.close < thirdCandle.open) &&
        (thirdCandle.close < midpoint) 
    );
}

export function isShootingStar(candle: Candle) {
    
    const bodySize = Math.abs(candle.open - candle.close);
    const lowerRange = Math.min(candle.open, candle.close) - candle.low;
    const upperRange = candle.high - Math.max(candle.open, candle.close);

    
    return (
        (bodySize > 0) && 
        (upperRange >= 2 * bodySize) && 
        (lowerRange <= bodySize) 
    );
}

export function isInvertedHammer(candle: Candle) {
    
    const bodySize = Math.abs(candle.open - candle.close);
    const lowerRange = Math.min(candle.open, candle.close) - candle.low;
    const upperRange = candle.high - Math.max(candle.open, candle.close);

    
    return (
        (bodySize > 0) && 
        (upperRange >= 2 * bodySize) && 
        (lowerRange <= bodySize) 
    );
}

export function isHangingMan(candle: Candle) {
    
    const bodySize = Math.abs(candle.open - candle.close);
    const lowerRange = Math.min(candle.open, candle.close) - candle.low;
    const upperRange = candle.high - Math.max(candle.open, candle.close);

    
    return (
        (bodySize > 0) && 
        (lowerRange >= 2 * bodySize) && 
        (upperRange <= bodySize) 
    );
}

export function isBearishHarami(previousCandle: Candle, currentCandle: Candle) {
    return (
        previousCandle.close > previousCandle.open &&
        currentCandle.close < currentCandle.open &&
        currentCandle.open < previousCandle.close &&
        currentCandle.close > previousCandle.open
    );
}

export function isBullishHarami(previousCandle: Candle, currentCandle: Candle) {
    return (
        previousCandle.close < previousCandle.open &&
        currentCandle.close > currentCandle.open &&
        currentCandle.open > previousCandle.close &&
        currentCandle.close < previousCandle.open
    );
}

export function isPiercingLine(previousCandle: Candle, currentCandle: Candle) {
    const midpoint = (previousCandle.open + previousCandle.close) / 2;

    return (
        previousCandle.close < previousCandle.open &&
        currentCandle.close > currentCandle.open &&
        currentCandle.open < previousCandle.low &&
        midpoint < currentCandle.close && currentCandle.close < previousCandle.open
    );
}

export function isDarkCloudCover(previousCandle: Candle, currentCandle: Candle) {
    const midpoint = (previousCandle.open + previousCandle.close) / 2;

    return (
        previousCandle.close > previousCandle.open &&
        currentCandle.close < currentCandle.open &&
        currentCandle.open > previousCandle.high &&
        previousCandle.open < currentCandle.close  && currentCandle.close < midpoint
    );
}

export function isThreeWhiteSoldiers(firstCandle: Candle, secondCandle: Candle, thirdCandle: Candle) {
    const isBullish = (firstCandle.close > firstCandle.open) && (secondCandle.close > secondCandle.open) && (thirdCandle.close > thirdCandle.open);
    
    
    return (
        isBullish && 
        (firstCandle.close < secondCandle.close && secondCandle.close < thirdCandle.close) && 
        (firstCandle.open < secondCandle.open && secondCandle.open < firstCandle.close) &&
        (secondCandle.open < thirdCandle.open && thirdCandle.open < secondCandle.close) 
    );
}

export function isThreeBlackCrows(firstCandle: Candle, secondCandle: Candle, thirdCandle: Candle) {
    
    const isBearish = (firstCandle.close < firstCandle.open) && (secondCandle.close < secondCandle.open) && (thirdCandle.close < thirdCandle.open);

    
    return (
        isBearish && 
        (firstCandle.close > secondCandle.close && secondCandle.close > thirdCandle.close) && 
        (firstCandle.close < secondCandle.open && secondCandle.open < firstCandle.open) &&
        (secondCandle.close < thirdCandle.open && thirdCandle.open < secondCandle.open) 
    );
}