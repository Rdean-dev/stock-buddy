import { isDoji, isHammer, isMorningStar, isEveningStar, isBearishEngulfing, isBullishEngulfing, isShootingStar, isHangingMan, isBullishHarami, isBearishHarami, isPiercingLine, isDarkCloudCover, isThreeWhiteSoldiers, isThreeBlackCrows, isInvertedHammer } from './patternCalculations';
import  normalizeCandleData  from "./normalizeCandleData";
import type {PatternName, AlphaVantageDailyResponse, Candle} from '../types/stock';

type PatternDetector = 
    | {
        candlesRequired: 1;
        detector: (candle: Candle) => boolean;
    }
    | {
        candlesRequired: 2;
        detector: (previousCandle: Candle, currentCandle: Candle) => boolean;
    }
    |{
        candlesRequired: 3;
        detector: (firstCandle: Candle, secondCandle: Candle, thirdCandle: Candle) => boolean;
    }

export default function scanPatterns (startDate: string, endDate:string, selectedPatterns: PatternName[], stockData: AlphaVantageDailyResponse) {
    
    const filteredArrayOfCandlestickObjects = normalizeCandleData(stockData, startDate, endDate);

    const patternDetectors: Record<PatternName, PatternDetector> = {
        Doji: {
            detector: isDoji,
            candlesRequired: 1
        },
        Hammer: {
            detector: isHammer,
            candlesRequired: 1
        },
        'Shooting Star': {
            detector: isShootingStar,
            candlesRequired: 1
        },
        'Inverted Hammer': {
            detector: isInvertedHammer,
            candlesRequired: 1
        },
        'Hanging Man': {
            detector: isHangingMan,
            candlesRequired: 1
        },
        'Bullish Engulfing': {
            detector: isBullishEngulfing,
            candlesRequired: 2
        },
        'Bearish Engulfing': {
            detector: isBearishEngulfing,
            candlesRequired: 2
        },
        'Bullish Harami': {
            detector: isBullishHarami,
            candlesRequired: 2
        },
        'Bearish Harami': {
            detector: isBearishHarami,
            candlesRequired: 2
        },
        'Piercing Line': {
            detector: isPiercingLine,
            candlesRequired: 2
        },
        'Dark Cloud Cover': {
            detector: isDarkCloudCover,
            candlesRequired: 2
        },
        'Morning Star': {
            detector: isMorningStar,
            candlesRequired: 3,
        },
        'Evening Star': {
            detector: isEveningStar,
            candlesRequired: 3,
        },

        'Three White Soldiers': {
            detector: isThreeWhiteSoldiers,
            candlesRequired: 3,
        },
        'Three Black Crows': {
            detector: isThreeBlackCrows,
            candlesRequired: 3,
        }
    };

    const results: Partial<Record<PatternName, Candle[]>> = {};

    selectedPatterns.forEach((pattern) => {
        results[pattern] = [];
    });

    filteredArrayOfCandlestickObjects.forEach((candle, index) => {
        selectedPatterns.forEach((pattern) => {
            const patternResults = results[pattern];
            if (!patternResults) return;
            const patterns = patternDetectors[pattern];
            const previousCandle = filteredArrayOfCandlestickObjects[index - 1];
            const firstCandle = filteredArrayOfCandlestickObjects[index - 2];


            if (index >= 2 && patterns.candlesRequired === 3 && patterns.detector(firstCandle, previousCandle, candle)) {
                patternResults.push(candle);
            }
            else if (index >= 1 && patterns.candlesRequired === 2 && patterns.detector(previousCandle, candle)) {
                patternResults.push(candle);
            }
            else if (patterns.candlesRequired === 1 && patterns.detector(candle)) {
                patternResults.push(candle);
            }

            
        });
    });

    return results;
    
    

    
    

    


    

}

