# Stock Buddy — Project Notes

Last updated: November 19, 2026
Stage: Working frontend and first end-to-end AI backend feature; completing core research features and moving data responsibilities to the backend.

## Product direction

Stock Buddy is a cross-platform stock research and educational app built with React Native, Expo Router, and TypeScript. Its core experience is a watchlist, stock detail page, and candlestick pattern scanner, supported by news and market reporting.

The immediate goal is a coherent, working app for one other user. Build and validate locally, then deploy the backend to cloud hosting. A homelab remains a separate learning interest, not a prerequisite for delivering the app. No hosting provider has been selected. Keep recurring costs at zero where practical; check current free-tier limits before deployment or provider decisions.

AI is an implementation choice for features that benefit from synthesis, not a requirement for every feature. Keep the current price summary integration, but consider replacing this predictable recap with deterministic text later to reserve AI requests for richer news or research features.

## Current status

| Area | Status | Next milestone |
|---|---|---|
| Watchlist | User verified live-data use; desktop and mobile table refinements completed | Preserve working behavior; add persistence and consistent request states as needed |
| Stock Detail | Shared navigation, profile header, chart, company description, and research cards render | Fill remaining cards with useful data and handle unavailable sections explicitly |
| Price Action Summary | Express → market data/metrics → OpenRouter → Expo card works; browser screenshot confirms display | Validate edge cases, completed-session selection, and failure paths |
| Pattern Scanner | Existing client-side detection and chart annotations; shared chart extracted | Regression-check behavior, then migrate detection to backend |
| Backend | Express + TypeScript server and summary endpoint running locally | Introduce reusable market-data endpoints and caching |
| News / analyst sentiment / report | Planned research features; placeholder cards are not completed integrations | Select feasible data sources and deliver one feature at a time |
| Deployment / database | Not yet implemented | Deploy after local flow is stable; persist watchlists when ready |

## Working architecture

Frontend: Expo UI, navigation, rendering, chart interaction, selected date ranges, and request display states.

Backend: Express routes/controllers, provider calls and secrets, data validation/normalization, price calculations, AI requests, and eventually caching, pattern detection, and persistence.

The backend lives under `server/` with its own package.json, dependencies, tsconfig, and src folder. Source code is stored in the project; a running Node process serves requests. Cloud deployment will run that process on a remote host.

Do not import Expo service files into the backend. Their package/module settings and location are outside server/src. Keep backend implementations and required types under server/src for now. Consider a shared types package later only when duplication creates a concrete maintenance problem.

### Running locally

- Project root: `npx expo start`.
- Separate terminal, inside server/: `npm run dev`.
- Express currently uses localhost:3000; Expo web uses localhost:8081.
- Test the summary in Command Prompt with `curl.exe -i http://localhost:3000/api/price-action-summary/IBM`.
- localhost works for the computer's browser. Physical-device testing needs an address reachable from that device.
- Run the backend build before deployment to check the actual TypeScript compilation path.

NodeNext backend imports use explicit .js extensions for local TypeScript modules. JSON imports use `with { type: "json" }`. Keep required mock files within the backend source tree.

## Price action summary — implemented flow

1. Expo service `services/priceActionService.ts` requests GET /api/price-action-summary/:symbol.
2. Express router connects the route to the controller.
3. Controller validates the symbol with Zod and awaits getSummary; errors go to error middleware.
4. Backend price-action service gets historical data from stock-data.service.ts, checks availability, normalizes candles, calculates metrics, and calls generatePriceSummary.
5. ai-summary.service.ts sends a POST to https://openrouter.ai/api/v1/chat/completions using model openrouter/free.
6. Backend responds with `{ data: { symbol, summary } }`.
7. Frontend checks response.ok, parses JSON, returns data.data, and returns null on caught failure.
8. Stock Detail displays loading, error, or the summary text.

GET represents retrieving the symbol's recap. The separate backend-to-OpenRouter request uses POST to submit the prompt and metrics. If a future app endpoint accepts arbitrary metrics in a request body, reconsider POST for that endpoint rather than changing methods without an input-contract reason.

### Data and calculations

Backend normalizeCandleData accepts an optional limit, sorts date entries newest first, slices before parsing, and returns numeric candles in newest-first order. Latest candle is index 0; previous candle is index 1. This convention is specific to the backend utility; do not silently change the frontend chart's chronological ordering.

A limit reduces conversion work, not the size of the provider response. Use a compact historical response where appropriate; avoid fetching full history unnecessarily.

Metrics currently prepared:

| Metric | Definition |
|---|---|
| sessionDate / previousSessionDate | Dates from the selected daily candles |
| open, high, low, close, volume | Latest selected session |
| previousClose | Previous session close |
| priceChange | close − previousClose |
| priceChangePercent | priceChange / previousClose × 100 |
| volumeChangePercent | (volume − previousVolume) / previousVolume × 100 |
| sessionRange / previousSessionRange | Each session's high − low |
| closePositionPercent | (close − low) / sessionRange × 100 |

Zero denominators produce null for the affected percentage. Missing historical data or fewer than two candles stop summary generation with an error. These are different conditions: one unavailable metric need not invalidate the whole recap.

Completed-session selection remains unfinished. Latest two entries are not automatically two completed sessions. Filter/select completed sessions before limiting to two, or retrieve enough candidates to exclude an unfinished day. Use exchange dates/time zone and session information rather than the user's local date alone. Return sessionDate as structured response metadata when improving the contract, so the UI need not extract it from prose.

Validate parsed numeric data: finite prices/volume, valid OHLC relationships, nonnegative volume, and enough usable candles. Missing or malformed inputs must not silently become zero or misleading summary text.

### Prompt and output

Prompt requests exactly two short plain-language sentences providing a daily price action recap, connecting movement, closing position, and volume rather than listing all metrics. It identifies ticker and actual session date, displays date as Month D, YYYY, uses supplied computed percentages, omits missing/null values, rounds prices/percentages, and returns plain text.

Restrictions: no invented causes, predictions, trading advice, or unsupported interpretations. closePositionPercent is position between session low (0) and high (100), not percentage change from the prior close. Two daily candles support a daily recap, not a broader trend/support/resistance analysis.

An early output confused closing position with change from previous close. The prompt was clarified, and subsequent displayed price calculations and volume comparison were checked. A working prompt reduces errors but does not establish that every future output is correct.

Before calling this feature robust: ensure AI response content is a nonempty string; type PriceActionMetrics explicitly; validate required environment variables; add a bounded request timeout and sensible unavailable behavior. Cache by symbol/session/input version to avoid regenerating identical summaries on every visit. Avoid broad automatic retries that consume free quotas.

## Verification and debugging completed

- Initial sample endpoint returned 200 for valid input and 400 for invalid input using curl (before the route changed from POST to GET).
- Actual GET endpoint returned an AI-generated IBM recap using mock historical data.
- Wrong OpenRouter homepage URL returned HTML, causing JSON parsing failure; corrected to the chat completions endpoint.
- User independently verified the volume calculation against raw volumes.
- Browser integration initially failed because CORS headers were missing. Configured cors middleware before routes to allow http://localhost:8081; summary now displays in Stock Detail.
- Curl does not enforce browser CORS, so a curl success alone is not an end-to-end browser test.
- Expo transient closed-stream error appeared during page loading; page recovered. Do not assume it was caused by the Express endpoint.
- React useAnimations DOM warning remains a separate cleanup issue.

Latest screenshot shows AAPL summary dated November 18 while chart dates remain August–September. User knows the chart is mock. Summary service was previously IBM-mocked; latest screenshot suggests its source changed, but final backend fetch code was not reviewed. Confirm configuration rather than assuming every source is live.

## Request state decisions

Stock Detail uses separate summary data, loading boolean, and error string. This distinguishes no request, pending, success, and failure; null data alone cannot explain all of them.

On a new request: clear old data/error and set loading. On success: store data and clear loading. On failure: set error and clear loading. Cleanup ignore flag must be checked after await before state updates to prevent older results overwriting a different ticker's summary.

Three useState calls were chosen for readability, not as a universal rule. A combined discriminated-union status is a later option if transitions become difficult to maintain. Apply the same reasoning to other independent requests: identify what the UI must distinguish, then model it clearly.

## Existing UI and chart decisions

- Watchlist live-data use verified by user; Company/Price/Today/Volume/Trend alignment and mobile price sizing refined. Avoid reopening styling without a concrete problem.
- Web sparkline uses custom SVG with gradient, unique IDs, and flat/insufficient-data handling. Native fallback approach was discussed; Android verification remains worth doing.
- StockChart owns candles/provider, axes, crosshair/tooltip, OHLC inspection, date controls, optional title (default symbol), and configurable height.
- PatternStockChart composes StockChart with optional annotations and legend React nodes. Annotations render within the chart provider; no variant prop is required.
- Shared chart height must also reach YAxis; Stock Detail uses 250 rather than the shared default 350.
- Shared formatStockProfile utility supplies display formatting; it accepts missing/null profile data.
- Stock Detail profile header includes logo, company, ticker/exchange, price, and colored daily change. About Company uses a short description.
- White cards, subtle borders, 12px corners, 24px spacing; paired research cards stack on mobile.
- Stock Detail route moved into app/(tabs) so desktop sidebar and AppHeader remain visible; href:null hides it from menu items. Global search and Watchlist can both navigate to the same ticker route.
- Figma is a visual planning aid; reuse the app's established design language without prolonging placeholder work.

## Forward development plan

### 1. Finish the summary milestone

Confirm current frontend effect and backend response guards, test failure/loading behavior, add completed-session selection, and remove temporary debug logging. Retain AI for now. Keep chart mock data intentional until its source is switched. Commit this working milestone.

### 2. Establish backend market-data access

Move provider requests behind reusable server endpoints for historical candles and company profiles, followed by symbol search and market status. Keep rendering/formatting in Expo. Route chart and summary through consistent underlying data. Add HTTP/provider response validation, clear errors, caching, and quota handling. Avoid duplicate provider fetches for a single screen load.

Current providers: Alpha Vantage historical daily data, FMP company profiles, Twelve Data symbol search and market status. Reconfirm availability/limits when implementing; do not assume free-tier allowances are permanent.

### 3. Move pattern analysis to the backend

Reuse existing detection logic as pure functions over validated candles. Add a scan endpoint accepting the symbol/date range/selected patterns needed by the scanner. Keep selected controls, chart interaction, annotation positioning, and legends in Expo. Verify representative known matches, no-match cases, date boundaries, and alignment after migration. Populate Stock Detail's Technical Pattern Signals from the same detection logic rather than maintaining a second implementation.

### 4. Complete useful research content

Implement Recent News with source links and timestamps first; add summarization only if it adds value. Implement Analyst Sentiment only after confirming an accessible data source and clearly separating consensus from app-generated interpretation. Keep broader AI research and Daily Report scoped to available data and useful user questions; placeholders are not commitments to invent content.

### 5. Add persistence

Use PostgreSQL for saved watchlists and later preferences/accounts. Start with the actual one-user requirement; design ownership so accounts can be added cleanly if remote access requires them. API keys remain server-side. No database is necessary merely to call the summary service. Decide cache persistence separately from user data persistence.

### 6. Deploy and validate for the intended user

Compare current cloud free tiers, then deploy the Express backend with configured environment variables, production CORS origins, HTTPS, and an Expo API base URL configured per environment. Review authentication/access limits and request rate limits before exposing AI/provider-backed endpoints. Test the real user's browser/device, unavailable providers, cold starts, and quota exhaustion. Cloud remains the preferred delivery path; no hardware purchase is needed now.

## Next-session starting point

Do not restart the tutorial or redesign the working page. Review current code, close the summary correctness/response-validation gaps, then begin the reusable backend historical-data endpoint. The next substantial architecture milestone is sharing market data between chart, summary, and scanner without repeated provider calls.

Suggested milestone commit: `Integrate AI price action summaries into stock details`.

## Collaboration and engineering learning

User writes the code and wants ownership of decisions. Provide targeted examples when asked; avoid full implementations by default. Explain corrections in terms of assumption, possible failure, and chosen response. Review the working path, boundaries, and meaningful edge cases rather than adding guard clauses everywhere.

Keep plans forward-looking and practical. Distinguish implemented behavior from planned work, but do not turn notes into a word-for-word transcript or repeatedly qualify routine progress. Read current files before changes; these notes are a handoff, not an authoritative code snapshot.
