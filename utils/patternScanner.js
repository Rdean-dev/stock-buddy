import { isDoji, isHammer, isMorningStar, isEveningStar, isBearishEngulfing, isBullishEngulfing, isShootingStar, isHangingMan, isBullishHarami, isBearishHarami, isPiercingLine, isDarkCloudCover, isThreeWhiteSoldiers, isThreeBlackCrows, isInvertedHammer } from './patternCalculations.js';
import  normalizeCandleData  from "../utils/normalizeCandleData.js";

export default function scanPatterns (startDate, endDate, selectedPatterns, stockData) {
    
    const filteredArrayOfCandlestickObjects = normalizeCandleData(stockData, startDate, endDate);

    const patternDetectors = {
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

    const results = {};

    selectedPatterns.forEach((pattern) => {
        results[pattern] = [];
    });

    filteredArrayOfCandlestickObjects.forEach((candle, index) => {
        selectedPatterns.forEach((pattern) => {
            const patterns = patternDetectors[pattern];
            const detector = patterns.detector;
            const candlesRequired = patterns.candlesRequired;
            const previousCandle = filteredArrayOfCandlestickObjects[index - 1];
            const firstCandle = filteredArrayOfCandlestickObjects[index - 2];


            if (index >= 2 && candlesRequired === 3 && detector(firstCandle, previousCandle, candle)) {
                results[pattern].push(candle);
            }
            else if (index >= 1 && candlesRequired === 2 && detector(previousCandle, candle)) {
                results[pattern].push(candle);
            }
            else if (candlesRequired === 1 && detector(candle)) {
                results[pattern].push(candle);
            }
            
        });
    });

    return results;
    
    

    
    

    


    

}

