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

# Before I Stop Working

Last worked on:

Building the Pattern Scanner logic using saved Alpha Vantage IBM data.

Finished:

- Pattern Scanner page renders correctly on web and physical Android.
- PatternCard mock results work.
- Native DateRangePicker works on physical Android.
- Start/end date validation works.
- Fixed mobile DateRangePicker layout issue.
- Added date range preset controls.
- Pattern Scanner date controls are responsive between mobile and web.
- Saved Alpha Vantage IBM daily data locally for development/testing.
- Started `patternScanner.js`.
- Scanner extracts `"Time Series (Daily)"` from Alpha Vantage data.
- Converts Alpha Vantage data into an array using `Object.entries()`.
- Reverses candle data into oldest → newest chronological order.
- Converts open/high/low/close/volume strings into numbers.
- Filters candles using the selected start and end dates.
- Converts Alpha Vantage entries into clean candle objects:
  `{ date, open, high, low, close, volume }`
- Scanner loops through the filtered candles and selected patterns.
- Added the initial connection for calling a pattern detector such as `isDoji(candle)`.

Still working on:

- Actual candlestick pattern calculations have not been implemented yet.
- Ticker search is still a placeholder.
- Pattern checkbox/multi-select UI is still a placeholder.
- Scanner results still need to be connected to the PatternCard UI.
- Live Alpha Vantage API integration has not been added yet; scanner currently uses saved mock data.

Next thing to do:

Create `patternCalculations.js`.

Start with:

`isDoji(candle)`

The function should receive one clean candle object and return `true` or `false`.

Then import `isDoji` into `patternScanner.js` and test the scanner using the saved IBM data.

After Doji works:
- Add additional single-candle patterns.
- Add multi-candle patterns such as Bullish Engulfing using the candle index to access the previous candle.
- Build the pattern checkbox/multi-select UI and pass the selected patterns into the scanner.
- Connect scanner results to PatternCard.

Important architecture:

`PatternScannerScreen`
→ owns user selections/state
→ calls scanner

`patternScanner.js`
→ prepares/filter candle data
→ coordinates selected pattern detection
→ returns results

`patternCalculations.js`
→ contains the actual mathematical definitions for candlestick patterns
→ examples: `isDoji`, `isHammer`, `isBullishEngulfing`

`PatternCard`
→ presentation only
→ displays scanner results

Alpha Vantage returns daily data newest → oldest. The scanner reverses it so the clean candle array is oldest → newest. This is important for multi-candle patterns because `index - 1` can represent the previous trading candle.

Web and mobile share the same DateRangePicker feature contract but use platform-specific UI. Native uses `@react-native-community/datetimepicker@8.4.4` with `onChange`; web uses HTML `<input type="date">` with local date conversion to avoid UTC date-shift bugs.

Web layout direction is top navigation + left-side navigation + main content area. Mobile uses bottom tabs.