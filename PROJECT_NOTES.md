# Stock Buddy — Project Notes

**Last updated:** November 11, 2026  
**Stage:** Functional prototype; UI refinement and data integration in progress  
**Stack:** React Native, Expo, Expo Router, TypeScript migration in progress, React Native Paper, SVG (web sparklines), react-native-wagmi-charts (candlestick chart)

## 1. Project overview
Stock Buddy is a cross-platform stock research and educational app designed to make stock tracking, price action, and candlestick-pattern analysis approachable. The intended experience includes a watchlist, stock details, pattern scanner, market report, news, and eventually AI-assisted research explanations. It is **not yet a production-ready market-data application**.

## 2. Current status at a glance
| Area | Current status | Next work |
|---|---|---|
| Watchlist | User verified it works with live data; desktop column alignment fixed; mobile refinements completed during session | Treat as complete for now; revisit only concrete issues |
| Sparklines | Custom web SVG implementation working; Android import issue addressed with a native placeholder approach | Confirm native placeholder is saved and Android loads; no native sparkline rendering required yet |
| Pattern Scanner | Pattern chart extracted into a wrapper around shared StockChart | Regression-check markers, legend, date ranges, and native behavior |
| Stock Detail | Shared chart renders for route ticker after reload; summary sections exist | Apply existing theme and Figma layout; finish header and responsive layout |
| Backend / AI | Not implemented; all current app code runs in Expo | Begin after Stock Detail UI; first target is price-action summary |
| TypeScript | Incremental migration ongoing | Keep shared component contracts accurate |

## 3. Watchlist — November 11 update
User confirmed live-data use works. Earlier notes describing the watchlist as mock-only are superseded by that confirmation; not every individual provider or edge case was audited this session.

Completed/refined:
- Company, Price, Today, Volume, and 7-Day Trend columns, plus remove control.
- Matched column flex styles between titles and row cells; brought Price closer to Company.
- Fixed numeric header alignment by removing outer paddingLeft: 24 from the Trend title. The Trend cell had padding on an inner View, so header and row flex allocation differed. Changing Volume text padding was not the actual fix.
- Mobile subtitle/status alignment: alignItems: center and override subtitle paddingBottom: 20 to zero on mobile.
- Price text constrained to one line; mobile price-column width increased to avoid truncation. Mobile left alignment discussed through justifyContent: flex-start.
- Android could not resolve web-only Sparkline.web.tsx. Proposed Sparkline.native.tsx with matching props and return null, keeping the extensionless import. Native placeholder implementation was not separately shown or verified.

Custom web SVG sparkline implementation retained:
- Seven chronological closing prices, 120 × 35 px SVG, 3 px padding.
- Independent first-to-last trend color; gradient under line; unique useId gradient IDs.
- Fewer-than-two-points guard and centered flat-series handling.
- Web-only SVG elements; mobile trend hidden by responsive UI.

Watchlist persistence, loading/error handling, market-status refresh, and global search remain broader follow-up items where not already implemented. They do not block the current decision to move on from Watchlist styling.

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

## 6. Stock Detail and chart refactor — November 11
### Figma and UI
Learned basic Figma frame, zoom, text, rectangles, fill, border, and spacing controls. Desktop frame started at 1440 × 1024 and was extended vertically to fit scrolling content. The current mockup includes:
- Stock identity, ticker/exchange, price, daily change.
- Large chart card with 1M/3M/6M/1Y controls and chart placeholder.
- Full-width Price Action Summary.
- Technical Pattern Signals and Analyst Sentiment side by side, with 24 px gap.
- Full-width Recent News Summary.
- Shared targets: white cards, 12 px corners, E2E8F0 borders, 24 px gaps/insets; body text 14 px Regular in 475569.

User chose to leave out the AI Research Summary button. The existing screen still contained an empty AI Research Summary section; reconcile this when styling. Sample prose, dates, analyst counts, and news in Figma are fictional layout content, not verified financial information.

Figma work mostly became a wireframe. User wanted visual decisions resolved before coding, not a prolonged recreation of the paper sketch. Reuse the established Watchlist design language; avoid repeating low-value placeholder work.

### Component responsibilities
- StockChart: reusable candles, axes, crosshair/tooltip, OHLC inspection, date-range controls, chart provider and shared layout.
- PatternStockChart: pattern-match calculation, PatternAnnotations, PatternLegend, and their styles; composes StockChart.
- StockChart accepts optional annotations and legend as React.ReactNode props. Render annotations inside CandlestickChart and its Provider; render legend below. No variant needed for this composition.
- StockChart now takes symbol: string instead of selectedStock: WatchlistStock; wrapper should pass selectedStock.symbol.
- Pattern props belong in the wrapper, not the shared chart.
- Both currently normalize the same stock data and dates; duplicate normalization is intentionally tolerated for this refactor. Later consider passing one normalized Candle[] rather than changing scope now.
- PatternAnnotations uses flatMap: skip missing candles or nonpositive price ranges with []; return one annotation in an array otherwise. Existing marker stacking by date remains.
- Remove obsolete imports/types/styles from each file as cleanup; completion of all cleanup was not independently verified.

### Stock Detail data flow
- Read ticker from useLocalSearchParams.
- Fetch getStockData(ticker) in effect depending on ticker; guard with !ticker; reset selectedStockData and ignore stale results during cleanup.
- startDate/endDate and selectedStockData currently begin as null.
- Mount-only effect calls dateInterval(1). Do NOT depend on the dates this function changes: that caused a render loop in an intermediate version.
- dateInterval updates start/end dates and selectedInterval for month presets.
- Render StockChart only once dates and selectedStockData exist; pass stockData={selectedStockData}, symbol={ticker}, and dateInterval.
- Removed scanner-only custom-date handlers that referenced undefined setDateError.

The reported stockData-is-not-defined error persisted despite corrected pasted code; reloading resolved it. User confirmed chart works, with screenshot showing AAPL candles and dates without pattern markers. Screenshot alone does not establish whether this historical response is live or mocked.

Latest screenshot still shows dark page/section styling, white chart, default stock-detail navigation header, and largely empty summary cards. This has NOT yet been styled to match the light Figma/Watchlist design.

### AI/backend decision
Goal: a short price-action summary generated from supplied market facts. Proposed architecture: Expo UI -> small TypeScript/Node backend -> hosted AI API via SDK -> summary returned to UI. No backend, model provider, SDK, hosting, or endpoint has been implemented/chosen conclusively. Express was proposed as a starting server library.

Keep secret AI keys server-side. Calculate numeric facts in code and ask AI to explain those facts; do not ask a model for current stock facts from ticker alone. Initial scope discussed: latest completed trading day, OHLCV and prior close; no news explanations or predictions. No database/auth required for the initial learning endpoint, though public deployment needs separate consideration.

User wants UI first, then backend integration, and is interested but nervous about backend learning. Teach through small working checkpoints; let user write code. Do not start backend setup before the current UI milestone unless user changes priority.

## 7. Navigation and layout
Expo Router is used. Earlier notes document desktop left-side tabs and mobile bottom tabs. A collapsible desktop sidebar and global stock search remain future work. Current watchlist screenshot confirms a left navigation rail and global header on desktop, but not full functionality of every header control.

## 8. Data sources and architecture
- **Alpha Vantage:** daily historical time-series format, normalization, and earlier scanner symbol-search work; user reports live Watchlist works; exact per-provider coverage not independently audited.
- **Twelve Data:** symbol-search exploration/integration and NYSE market status.
- **FMP:** company-profile API considered/planned; implementation status not verified.
- **Current data strategy:** live Watchlist use confirmed by user; mocks remain useful for UI development. Caching, refresh, quota handling, and exact provider coverage need review as backend work begins.
- **Architecture principle:** keep normalization/data fetching separate from presentation; avoid premature abstractions.

## 9. Next work sequence
1. Style Stock Detail using existing theme and Figma reference: background, stock header, card spacing, chart container, and responsive stacked mobile summaries.
2. Confirm time-range buttons and crosshair/OHLC interaction; regression-check scanner annotations after extraction.
3. Add clear loading/error/empty handling for Stock Detail fetching as needed.
4. Begin backend learning with one endpoint returning a fixed response; connect Expo before introducing AI.
5. Replace fixed response with price-action generation using validated market facts; add summary loading/error handling.
6. Broader later work: persistence, caching/quotas, market-status refresh, search, authentication.

## 10. Future product ideas (not current deliverables)
Daily AI market report; AI research summaries; analyst sentiment; stock news; stock screener/multi-stock pattern scanning; user accounts; persistent personalized watchlists; public landing page; dark theme; collapsible sidebar. Prior branding concept: approachable green/navy identity and a handshake-like money-stack logo; final logo not selected in the supplied notes.

## 11. Next-session handoff
**Stop point:** User reloaded Stock Detail and confirmed the extracted shared chart renders successfully. Session ended November 11, local time.

**Start next time:** Continue Stock Detail UI styling, not backend yet. Reuse the Watchlist theme and existing chart. Review current files before editing; snippets in these notes describe the session, not an authoritative repository snapshot.

**Verification still worth doing:** 1M/3M/6M/1Y ranges, scanner annotations/legend after the refactor, and Android rendering. User said done after earlier checks, but no complete test record or commit hash was provided.

Suggested commit messages discussed:
- Refine watchlist column spacing and header alignment
- Extract reusable stock chart and connect stock detail screen

**Collaboration preference:** Mentor/senior-engineer guidance; user implements. No full code unless requested. Explain architectural reasoning and provide targeted corrections without slow-walking familiar UI tasks.


