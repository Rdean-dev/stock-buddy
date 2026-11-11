import type { AlphaVantageDailyResponse } from '../types/stock';

export const mockWatchlist = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'TSLA', name: 'Tesla, Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com, Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'DELL', name: 'Dell Technologies Inc.' },
];

export const mockProfileData = {
  AAPL: {
    price: 343.58,
    change: 4.08,
    changePercentage: 1.2,
    image: 'https://images.financialmodelingprep.com/symbol/AAPL.png',
    volume: 4981981
  },
  TSLA: {
    price: 386.28,
    change: 12.57,
    changePercentage: 3.36,
    image: 'https://images.financialmodelingprep.com/symbol/TSLA.png',
    volume: 4125232
  },
  AMZN: {
    price: 262.43,
    change: -0.2,
    changePercentage: -0.08,
    image: 'https://images.financialmodelingprep.com/symbol/AMZN.png',
    volume: 2365481
  },
  MSFT: {
    price: 531.64,
    change: -0.23,
    changePercentage: -0.04,
    image: 'https://images.financialmodelingprep.com/symbol/MSFT.png',
    volume: 3659847
  },
  DELL: {
    price: 481.71,
    change: 20.15,
    changePercentage: 4.37,
    image: 'https://images.financialmodelingprep.com/symbol/DELL.png',
    volume: 5654891
  },
};

// Fictional daily data, ordered newest first.
const mockDates = [
  '2026-11-06',
  '2026-11-05',
  '2026-11-04',
  '2026-11-03',
  '2026-11-02',
  '2026-10-30',
  '2026-10-29',
];

function createMockHistory(
  closes: [number, number, number, number, number, number, number]
): AlphaVantageDailyResponse {
  return {
    'Time Series (Daily)': Object.fromEntries(
      mockDates.map((date, index) => {
        const close = closes[index]!;

        return [
          date,
          {
            '1. open': String(close - 1),
            '2. high': String(close + 2),
            '3. low': String(close - 2),
            '4. close': String(close),
            '5. volume': '1000000',
          },
        ];
      })
    ),
  };
}

export const mockHistoricalData: Partial<
  Record<string, AlphaVantageDailyResponse>
> = {
  AAPL: createMockHistory([343.58, 341, 344, 338, 336, 339, 334]),
  TSLA: createMockHistory([386.28, 380, 375, 382, 370, 365, 360]),
  AMZN: createMockHistory([262.43, 265, 260, 263, 268, 270, 272]),
  MSFT: createMockHistory([531.64, 535, 533, 538, 540, 536, 542]),
  DELL: createMockHistory([481.71, 475, 478, 470, 465, 468, 460]),
};
