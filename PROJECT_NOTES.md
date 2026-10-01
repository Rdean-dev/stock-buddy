# Stock Buddy — Project Notes

**Last Updated:** September 8, 2026

## What Is This?

Stock Buddy is a React Native / Expo stock research app designed to make it easier to track stocks and quickly understand important market information.

### Planned Features

* Watchlist
* Stock Detail
* Daily AI Report
* Stock charts / historical prices
* AI research summaries
* Recent stock news
* Price action summaries
* Technical/candlestick pattern signals
* Analyst sentiment
* Pattern Scanner
* Stock trend & risk information

---

# Where the Project Is Now

The project is still in the **UI / prototype stage**.

The Watchlist and Stock Detail layouts are built with mock/static data. Pattern Scanner has also been started.

**Live stock data/API integration has NOT been done yet.**

Maintenance: Re-run npm audit during next Expo SDK upgrade; 27 transitive vulnerabilities remained because current fixes required breaking Expo/Expo Router changes.
---

## ✅ Watchlist

**Built. Needs real data/functionality next.**

Currently:

* Displays stock cards from a `stockData` array using `.map()`
* Mock stocks: **BALL and AAPL**
* Each card uses the reusable `StockCard` component
* Cards are pressable
* Pressing either card navigates to `/stock-detail`
* Navigation currently uses **Expo Router**

### StockCard

`StockCard` receives a `stock` prop and displays:

* Ticker
* Price
* Daily % change
* Trend
* Risk category
* Pattern count

### Important

Both stock cards currently open the **same static Stock Detail screen**.

The selected ticker is **NOT being passed yet.**

---

## ✅ Stock Detail

**Layout built. Needs real data/functionality next.**

Current sections:

* Header
* AI Research Summary
* Stock Chart
* Price Action Summary
* Technical Pattern Signals
* Analyst Sentiment
* Recent News Summary

Currently these are UI sections/placeholders.

The screen does **not yet know which stock was selected** and is not connected to live stock data.

---

## 🟡 Pattern Scanner

**Started, not finished.**

Currently has:

* Ticker dropdown placeholder
* Date range placeholder
* Pattern type placeholder
* Pattern Results section
* Annotated Chart placeholder
* Mock Doji data
* Mock Bullish Engulfing data
* Reusable `PatternCard` component

### PatternCard

Receives a `pattern` prop and displays:

* Pattern name
* Count
* Type
* Dates

### Known Problems

`PatternScannerScreen` currently has two code problems:

* `useState` uses incorrect destructuring.
* The `.map()` is not passing the individual pattern correctly to `PatternCard`.

Fix these when returning to Pattern Scanner.

---

# Navigation

Currently using **Expo Router**.

Current flow:

```text
Watchlist
   ↓
Press stock card
   ↓
router.push("/stock-detail")
   ↓
Stock Detail
```

### NEXT navigation step

Pass the selected ticker when navigating.

Goal:

```text
Press AAPL
   ↓
Navigate + pass "AAPL"
   ↓
Stock Detail receives "AAPL"
   ↓
Eventually load AAPL data
```

Same process should work for any stock.

---

# Data

**Everything is currently mock/static data.**

No stock market API has been selected or connected yet.

Eventually need:

* Current stock prices
* Daily % changes
* Historical/chart data
* News
* Other data needed by Stock Detail
* Loading states
* Error handling

### Refreshing Stock Data

Refresh strategy is **not decided yet**.

Do not choose a polling interval until the stock API/provider is selected. API rate limits, quote delays, and available streaming features will determine the best approach.

---

# Files to Know

```text
app/
├── _layout.tsx
├── index.tsx
└── stock-detail.tsx

components/
├── StockCard.js
└── PatternCard.js

screens/
├── DailyAIReportScreen.js
├── HomeScreenScreen.js
├── NewsScreen.js
├── PatternScannerScreen.js
├── SettingsScreen.js
├── StockDetailScreen.js
└── WatchlistScreen.js
```

---

# 🚩 WHERE I STOPPED

The Watchlist UI and Stock Detail UI are built.

Watchlist cards already navigate to Stock Detail, **but they do not tell Stock Detail which stock was clicked.**

Pattern Scanner was also started but has not been finished.

## NEXT TASK

### Pass the selected ticker from Watchlist → Stock Detail.

Start in:

`WatchlistScreen.js`

Current code:

```js
function handlePress(){
    router.push("/stock-detail");
}
```

The next goal is for the navigation to also identify the stock that was pressed.

After that:

**Stock Detail should receive the ticker.**

Do this **before starting API integration.**

---

# After That

Rough order:

1. Pass ticker → Stock Detail
2. Fix unfinished Pattern Scanner code
3. Choose stock market API
4. Connect Watchlist to real data
5. Connect Stock Detail to real data
6. Add loading/error handling
7. Decide stock refresh strategy
8. Continue remaining app features
9. dark and light theme using native hooks
10. web layout
---

Before I Stop Working — Stock Buddy
Last worked on:
Building and styling the Pattern Scanner candlestick chart.
Finished:
- Created reusable StockChart component.
- Integrated react-native-wagmi-charts.
- Connected the chart to normalized Alpha Vantage candle data.
- Chart responds to selected stock and selected date range.
- Added responsive chart sizing using useWindowDimensions().
- Added selected ticker symbol to chart header.
- Added chart range controls:
  - 1m
  - 3m
  - 6m
  - 1Y
- Connected range controls to existing dateInterval() behavior.
- Added candlestick crosshair and tooltip.
- Added interactive OHLC information:
  - Open
  - High
  - Low
  - Close
- Confirmed PriceText values populate when a candle is selected with the crosshair.
- Added interactive candle date using DatetimeText.
- Created a separate inspection/footer section for date + OHLC information.
- Added divider between chart and OHLC information.
- Improved chart card styling:
  - White card
  - Rounded corners
  - Shadow/elevation
  - Better spacing
  - Modernized ticker typography
  - Muted OHLC labels
- Tested WAGMI startup performance. Cold Expo Web startup is slower with the library, but chart functionality is working; no library change made yet.
- Identified how pattern annotations will work conceptually:
  - filteredArrayOfCandlestickObjects determines all candles displayed.
  - patternResults determines which candles should be marked.
  - Candle dates can be matched against pattern-result dates.
Important architecture:
Alpha Vantage stock data
        ↓
normalizeCandleData()
        ↓
normalized candle array
        ↓
     StockChart
        ↓
CandlestickChart.Provider

Chart needs two different datasets/responsibilities:
normalized candles → draw the chart
patternResults      → annotate detected patterns

Next time:
Continue adding pattern detection markers to the candlestick chart.
First problem to solve:
patternResults
{
    Doji: [...],
    Hammer: [...],
    ...
}

Need to iterate through the pattern names/results and associate each match with its chart candle using:
candle.date === patternMatch.date

We stopped right before reviewing how Object.entries() can help iterate through patternResults.
After that:
- Decide how detected patterns should visually appear on candles.
- Implement annotations/markers without changing the underlying candle data.
- Then continue overall Pattern Scanner styling/responsiveness.