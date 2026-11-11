# Stock Buddy — Project Notes

**Last updated:** November 10, 2026  
**Stage:** Functional prototype; UI refinement and data integration in progress  
**Stack:** React Native, Expo, Expo Router, TypeScript migration in progress, React Native Paper, SVG (web sparklines), react-native-wagmi-charts (candlestick chart)

## 1. Project overview
Stock Buddy is a cross-platform stock research and educational app designed to make stock tracking, price action, and candlestick-pattern analysis approachable. The intended experience includes a watchlist, stock details, pattern scanner, market report, news, and eventually AI-assisted research explanations. It is **not yet a production-ready market-data application**.

## 2. Current status at a glance
| Area | Current status | Next work |
|---|---|---|
| Watchlist UI | Desktop watchlist rendered with five mock stocks; price, daily change, volume, 7-day trend, remove affordance, search input | Connect data and interactions; verify mobile behavior |
| 7-day sparklines | **Implemented and visually verified with mock data** | Validate live historical responses and edge cases |
| Market status | Market-open/closed/unavailable display connected to Twelve Data status request per Oct 26 notes | Automatic refresh, cleanup, app foreground handling |
| Pattern Scanner | Core historical processing, pattern detection, date controls, and interactive candlestick chart implemented | Finish result-card UI, verify detections and annotations, test workflow |
| Stock Detail | Initial sections and navigation exist | Verify stock-specific data and integration |
| Global search | Header/search design visible; complete functionality not established | Integrate suggestions and stock-detail navigation |
| Backend/auth | Not implemented | Decide architecture later |
| TypeScript | Conversion ongoing | Continue incremental migration and type checks |

## 3. Watchlist — current implementation
The current desktop watchlist displays five mock entries: **AAPL, TSLA, AMZN, MSFT, and DELL**. The latest screenshot shows columns for **Company, Price, Today, Volume, and 7-Day Trend**, plus a remove icon. The interface also shows a stock search input and market status. These visuals do **not** establish that adding/removing stocks, searching, or persisting selections is fully implemented.

### Custom SVG sparkline — completed November 10
The former sparkline/chart-library approach had clipping problems. Replaced it with a small **web SVG** `Sparkline` component (120 × 35 px), with:
- Seven chronological closing-price points supplied by `normalizeLineChartData()`.
- X/Y normalization using minimum and maximum close, with 3 px padding on each side.
- Green line for a rising first-to-last trend, red for falling, gray for unchanged; trend color is independent of the **Today** column.
- Polygon beneath the polyline with a top-to-bottom transparent gradient; each instance has its own gradient ID via React `useId()`.
- Guard for fewer than two prices (`return null`).
- Flat, vertically centered line when all closing prices are equal (avoids dividing by zero).
- Visual verification in the watchlist screenshot: five sparklines render with gradient shading and no apparent clipping.

**Implementation notes:** Render `<polygon>` before `<polyline>` so the line stays on top. Use `fill={`url(#${gradientId})`}` and `id={gradientId}` on the gradient definition. No memoization or additional chart dependency needed for the current small dataset. Cleaned up imports, equality comparison, and formatting during the session (per user confirmation).

**Still to verify:** The screenshot uses **mock** historical data, not live Alpha Vantage responses. Check date ordering, missing/invalid values, fewer-than-two records, flat series, and responsive behavior against real data before calling integration complete. SVG component currently uses web `<div>`/`<svg>` elements; do not assume it works natively on mobile without a separate implementation or platform handling.

### Watchlist remaining work
- Connect quote, change, volume, and historical trend to real market-data sources.
- Wire up and test add/remove stock behavior and persistence.
- Handle loading, empty, and API-error states.
- Verify watchlist-to-stock-detail navigation and responsive/mobile layout.
- Implement reliable market-status refresh, if still outstanding.

## 4. Market-status integration
**Recorded October 26:** Added Twelve Data NYSE market-status request, HTTP and boolean validation for `is_market_open`, and watchlist labels for open, closed, and unavailable. Request fires when Watchlist mounts. **Not yet verified complete:** scheduled refresh using `time_to_close` / `time_to_open`, timer cleanup, foreground refresh, and neutral unavailable-state styling.

## 5. Pattern Scanner
Core functionality documented as implemented:
- Stock search; historical Alpha Vantage daily time-series normalization.
- Candlestick pattern detection, including Doji, Hammer, Bullish/Bearish Engulfing, Morning/Evening Star, and Bullish/Bearish Harami; other patterns have been explored or implemented but need per-pattern verification.
- Date selection, validation, 1M/3M/6M/1Y presets, and selected-pattern multi-select controls.
- Interactive candlestick chart with crosshair, price/date/OHLC information, annotations, and legend.
- Responsive scanner controls and a shared visual marker configuration.

**Next:** Improve compact PatternCard results, date typography, spacing, and mobile layout; verify every selectable detection function and annotation alignment; test end-to-end scanner workflow and loading/error states. `react-native-wagmi-charts` is still used for the candlestick chart; replacing the watchlist sparkline did **not** replace this chart.

## 6. Stock Detail
Existing/planned sections: stock header, AI Research Summary, stock chart, Price Action Summary, Technical Pattern Signals, Analyst Sentiment, and Recent News Summary. Navigation from the watchlist has been worked on; current stock-specific loading, live market data, news, and AI summaries still need verification or implementation. Do not mark them complete solely because the UI exists.

## 7. Navigation and layout
Expo Router is used. Earlier notes document desktop left-side tabs and mobile bottom tabs. A collapsible desktop sidebar and global stock search remain future work. Current watchlist screenshot confirms a left navigation rail and global header on desktop, but not full functionality of every header control.

## 8. Data sources and architecture
- **Alpha Vantage:** daily historical time-series format, normalization, and earlier scanner symbol-search work; live watchlist historical integration pending.
- **Twelve Data:** symbol-search exploration/integration and NYSE market status.
- **FMP:** company-profile API considered/planned; implementation status not verified.
- **Current data strategy:** mock data supports UI development; production quote, historical, news, caching, refresh, API quota, and error strategy remain to be designed and validated.
- **Architecture principle:** keep normalization/data fetching separate from presentation; avoid premature abstractions.

## 9. Roadmap — recommended next sequence
1. **Commit the completed SVG sparkline work** as a standalone change, if not already committed.
2. **Finish watchlist behavior and data integration:** verify normalization against actual Alpha Vantage responses, decide quote/volume sources, implement loading/error/empty states, add/remove behavior, and persistence plan.
3. **Return to Pattern Scanner UI and verification:** compact result cards, mobile layout, pattern tests, annotation alignment.
4. **Verify Stock Detail data flow** and selected ticker handling.
5. **Address broader infrastructure:** shared stock search, market-status refresh, caching, authentication/backend, and eventually landing page.

The order above is a recommendation based on the latest watchlist work, **not** a claim that earlier Pattern Scanner priorities have been abandoned.

## 10. Future product ideas (not current deliverables)
Daily AI market report; AI research summaries; analyst sentiment; stock news; stock screener/multi-stock pattern scanning; user accounts; persistent personalized watchlists; public landing page; dark theme; collapsible sidebar. Prior branding concept: approachable green/navy identity and a handshake-like money-stack logo; final logo not selected in the supplied notes.

## 11. Next-session handoff
**Just completed:** Custom SVG 7-day sparklines with gradient fill, unique IDs, padding, trend colors, flat-series guard, and insufficient-data guard; visually checked on desktop with five mock stocks. User confirmed cleanup/formatting.

**Start next time:** Check Git commit status, then inspect `normalizeLineChartData()` and the watchlist's data flow before connecting live history. Confirm whether the component is web-only by design and how the mobile watchlist should handle the trend column. Do not revisit the old clipping issue unless it reappears.

**Open questions:** Which provider supplies current quotes and volume? How will add/remove selections persist? How should requests be cached within provider limits? Which Pattern Scanner UI items have been completed since the October notes?

---
*Basis: original Stock Buddy notes last updated October 9 with October 26 market-status addendum, plus the November 10 sparkline implementation discussion and desktop screenshot. Items without fresh verification remain explicitly pending.*
