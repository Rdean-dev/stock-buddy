# Stock Buddy — Project Notes

**Last Updated:** October 9, 2026  
**Project:** Stock Buddy  
**Technology:** React Native, Expo, Expo Router, JavaScript

---

## 1. Project Overview

Stock Buddy is a cross-platform stock research and educational application designed to help users track stocks, understand market movements, identify candlestick patterns, and make more informed investment decisions.

The application aims to combine financial research tools with an approachable, beginner-friendly user experience.

**Product direction:** A friendly investing companion that makes technical stock analysis easier to understand.

### Planned Features

- Home dashboard
- Personalized watchlist
- Stock Detail pages
- Daily AI market report
- Interactive stock charts and historical prices
- AI-powered research summaries
- Recent stock news
- Price action summaries
- Technical and candlestick pattern signals
- Analyst sentiment
- Pattern Scanner
- Stock trend and risk information
- Stock Screener (future)
- Global stock search
- User accounts and authentication
- Public landing page
- Light and dark themes
- Responsive web and mobile layouts

---

# 2. Current Project Status

**Development stage:** Functional prototype and ongoing UI development.

Stock Buddy has progressed beyond its original static UI prototype.

The Pattern Scanner now performs actual candlestick pattern detection against historical stock data and displays results on an interactive chart.

### Current Progress

**Watchlist**
- UI implemented.
- Reusable stock cards.
- Navigation to Stock Detail.
- Further real-data integration and functionality needed.

**Stock Detail**
- Initial UI sections implemented.
- Stock-specific navigation and data integration need continued verification and development.

**Pattern Scanner**
- Historical data processing implemented.
- Multiple candlestick detection algorithms implemented.
- Date-range filtering implemented.
- Interactive candlestick chart implemented.
- Pattern annotations and legend implemented.
- Responsive controls implemented.
- UI redesign in progress.

**Navigation**
- Expo Router tab navigation implemented.
- Desktop uses left-positioned tabs.
- Mobile uses bottom tabs.
- Collapsible desktop sidebar planned.

**Backend and Authentication**
- No production backend or user authentication system implemented yet.

---

# 3. Watchlist

## Implemented

- Stock cards rendered from an array using `.map()`.
- Reusable `StockCard` component.
- Pressable stock cards.
- Expo Router navigation to Stock Detail.
- Initial mock stocks included BALL and AAPL.

### StockCard

Receives a `stock` prop and displays:

- Ticker
- Price
- Daily percentage change
- Trend
- Risk category
- Pattern count

### Remaining Work

- Connect watchlist to real stock data.
- Add and remove stocks.
- Persist watchlist selections.
- Associate saved watchlists with user accounts.
- Handle loading and API errors.
- Verify stock-specific navigation and data loading.

---

# 4. Stock Detail

## Existing UI Sections

- Stock header
- AI Research Summary
- Stock Chart
- Price Action Summary
- Technical Pattern Signals
- Analyst Sentiment
- Recent News Summary

### Remaining Work

- Complete stock-specific data integration.
- Connect historical and current stock information.
- Integrate relevant news.
- Implement AI-generated summaries.
- Handle loading and error states.
- Improve responsive layouts.

**Important:** The original project notes identified passing the selected ticker from Watchlist to Stock Detail as a priority. This should be rechecked against the current implementation rather than assumed unfinished.

---

# 5. Pattern Scanner

**Status: Core functionality implemented; UI improvements and testing ongoing.**

The Pattern Scanner allows users to select a stock, choose a date range, select candlestick patterns, and identify matching formations in historical price data.

## Stock Search

- Implemented stock symbol search using Alpha Vantage's `SYMBOL_SEARCH`.
- Search input uses a debounce delay.
- Search results include ticker and company name.
- Selected stock is passed to the scanner.

## Historical Data Processing

The scanner processes Alpha Vantage daily time-series data.

Processing includes:

1. Extracting `"Time Series (Daily)"`.
2. Converting the response into an array using `Object.entries()`.
3. Ordering candles chronologically.
4. Converting OHLC and volume values into numbers.
5. Filtering candles by the selected date range.
6. Producing normalized candle objects.

Normalized structure:

`{ date, open, high, low, close, volume }`

## Pattern Detection

The scanner iterates through the selected candles and chosen patterns.

Detection logic evaluates the relevant candle windows and records matching formations.

Implemented or previously developed patterns include:

- Doji
- Hammer
- Bullish Engulfing
- Bearish Engulfing
- Morning Star
- Evening Star
- Bullish Harami
- Bearish Harami

Additional patterns and visual configurations have been explored, including Shooting Star, Inverted Hammer, Hanging Man, Piercing Line, and Dark Cloud Cover.

**Verification needed:** Confirm that every selectable pattern has a working detection function and corresponding visual configuration.

## Date Range Controls

Implemented:

- Start Date picker
- End Date picker
- Date validation
- Preset date ranges:
  - 1M
  - 3M
  - 6M
  - 1Y

### Recent UI Improvements

- Created a reusable `datePresets` configuration array.
- Rendered preset buttons using `.map()`.
- Added selected-state styling.
- Added hover styling for web.
- Connected presets to `dateInterval()`.
- Cleared preset selection when dates are manually changed.
- Improved button spacing and alignment.

## Pattern Selection

Uses `MultiSelect` from `react-native-element-dropdown`.

Implemented:

- Multiple pattern selection.
- Customized dropdown appearance.
- Customized dropdown items through `renderItem`.
- Pattern-specific markers beside pattern names.
- Custom selected-pattern chips using `renderSelectedItem`.
- Pattern removal controls.

### Reusable Marker Component

The `Marker` component is used to render pattern-specific symbols.

Visual properties are defined through `patternAnnotationVisuals`.

This separates:

- Visual configuration: pattern shape and color.
- Marker rendering: drawing the symbol.
- Feature-specific layout: dropdowns, selected chips, and chart legends.

The same visual definitions can eventually be used in Pattern Cards.

## Interactive Stock Chart

Uses `react-native-wagmi-charts`.

Implemented functionality includes:

- Historical candlestick rendering.
- Responsive chart sizing.
- Date-range filtering.
- Crosshair interaction.
- Price and date information.
- OHLC information.
- Pattern annotations.
- Pattern legend.

### Pattern Annotations

Pattern matches are mapped to candle indices.

Annotations are positioned using chart information such as:

- Candle index
- Chart step
- Price domain
- Chart height
- Candle high price

### Remaining Chart Work

- Improve annotation overlap handling.
- Verify marker positioning across screen sizes.
- Improve chart readability.
- Continue reviewing price and date axis presentation.
- Test different date ranges and stocks.

---

# 6. Pattern Scanner UI Redesign

**Current priority: Finish the Pattern Scanner interface.**

A desktop and mobile design direction has been established.

### Completed Improvements

- Date preset styling.
- Active and hover states.
- Pattern dropdown styling.
- Pattern-specific colored markers.
- Custom selected-pattern chips.
- Reusable visual configuration.
- More consistent colors, borders, and spacing.

### Remaining UI Improvements

1. Redesign `PatternCard` components.
2. Replace large, plain result rectangles with compact, informative cards.
3. Display pattern markers consistently in results.
4. Improve Start Date and End Date typography.
5. Refine spacing between scanner controls, results, and chart.
6. Review the mobile layout.
7. Verify selected-chip removal and chart legend behavior.
8. Test the complete scanner workflow.

### PatternCard

The existing component receives a pattern and displays:

- Pattern name
- Match count
- Pattern type
- Matching dates

**Planned redesign:** Present a compact pattern summary with a recognizable marker and match count. Consider expandable details or a drawer for individual matching dates.

The chart should remain the primary visual focus.

---

# 7. Navigation and Application Layout

## Current Implementation

Stock Buddy uses Expo Router's `Tabs` navigator.

Current destinations:

- Home
- Daily Report
- Watchlist
- Pattern Scanner
- News
- Settings

Responsive navigation currently uses `useWindowDimensions()`.

At widths of 768px and above, tabs are positioned on the left. Smaller screens use bottom tabs.

## Planned Navigation Redesign

**Desktop: Collapsible sidebar**

Expanded state:
- Approximately 220–240px wide.
- Icons and navigation labels.
- Active route highlighted.

Collapsed state:
- Approximately 64–72px wide.
- Icons only.
- Tooltips for navigation labels.
- More space available for charts.

**Mobile:**
- Explore hamburger-menu drawer navigation.
- Retain working bottom tabs until a replacement is implemented and tested.

### Implementation Direction

- Preserve Expo Router navigation.
- Create a custom desktop tab bar/sidebar.
- Use navigator state for active routes.
- Introduce expanded/collapsed state.
- Keep navigation logic separate from visual presentation.

---

# 8. Global Application Header

## Planned Feature: Global Stock Search

Add a search field to the overall application header.

Purpose:
- Search stocks by ticker or company name.
- Display matching stock suggestions.
- Navigate directly to the selected stock's detail page.

### Important Distinction

**Global search:** Finds a stock and opens Stock Detail.

**Pattern Scanner search:** Selects a stock to analyze for candlestick patterns.

Both should eventually share underlying search functionality without duplicating API logic.

### Possible Future Header Features

- Notifications
- User profile
- Account settings
- Keyboard shortcut for search on desktop

---

# 9. Landing Page and Authentication

## New Product Requirement

Stock Buddy needs a public-facing landing page that introduces the application before users create accounts.

### Landing Page Goals

- Explain what Stock Buddy does.
- Communicate its educational value.
- Highlight the Pattern Scanner and other key features.
- Show product previews.
- Encourage users to create an account.
- Provide login and registration links.

### Planned User Journey

Landing Page → Sign Up / Log In → Stock Buddy Application

### Architectural Considerations

- Separate public and authenticated routes.
- Use a simpler public website header.
- Protect personalized application features.
- Store user-specific watchlists and preferences.
- Consider allowing limited exploration without an account.

### Status

Planning stage. Authentication provider and backend architecture have not been selected.

---

# 10. Branding and Visual Identity

## Brand Direction

Stock Buddy should feel:

- Friendly
- Approachable
- Modern
- Trustworthy
- Educational
- Professional without being intimidating

### Logo Concept

Two stylized stacks of dollar bills with arms extending toward each other in a handshake.

Design preferences:
- No cartoon faces.
- Simple, recognizable shapes.
- Green and dark navy color palette.
- Friendly without appearing childish.
- Recognizable at small icon sizes.

The logo should work in:
- Landing page header
- Expanded desktop sidebar
- Collapsed sidebar
- Mobile application icon

**Status:** Concept only; final logo not selected.

### Design Inspiration

Explore:
- TradingView for charting and screening workflows.
- Robinhood for approachable financial interfaces.
- Webull for stock analysis layouts.
- Coinbase Advanced for information-dense interfaces.
- Dribbble and Behance for dashboard styling.

Focus on how professional applications organize filters, results, and charts without overwhelming users.

---

# 11. Future Feature: Stock Screener

**Status: Roadmap — not currently in development.**

A stock screener would allow users to discover stocks matching selected criteria.

### Potential Filters

- Price range
- Trading volume
- Market capitalization
- Sector
- Technical indicators
- Candlestick patterns

### Difference From Pattern Scanner

**Pattern Scanner:** Analyze selected patterns for one stock over a chosen period.

**Stock Screener:** Discover multiple stocks matching financial or technical criteria.

### Recommended Development Sequence

**Phase 1 — Complete Pattern Scanner**

Finish UI styling, pattern detection verification, and chart interactions.

**Phase 2 — Multi-stock Pattern Screening**

Extend existing detection logic to analyze a small group of stocks.

**Phase 3 — Full Stock Screener**

Introduce broader financial filters and technical indicators.

### Backend Considerations

Market-wide screening requires more than the current single-stock workflow.

Consider:
- API rate limits
- Data caching
- Server-side scanning
- Scheduled data updates
- Query performance
- Data freshness

Do not attempt large-scale scanning until the data architecture can support it.

---

# 12. Data and API Integration

## Selected Provider

**Alpha Vantage**

Previously selected for historical stock data and ticker search.

Current integration includes:
- Historical daily time-series processing.
- Symbol search.
- Local historical test data used during development.

### Important Limitation

Stock Buddy is not yet connected to a complete production market-data backend.

Historical data processing should not be confused with fully implemented live quotes, real-time streaming, or production-ready API integration.

### Remaining Data Work

- Current stock prices.
- Daily price changes.
- Watchlist data integration.
- Stock Detail data integration.
- News data.
- Loading and error handling.
- Caching.
- Refresh strategy.
- API key and quota management.

### Refreshing Stock Data

The refresh strategy remains undecided.

Potential approaches:
- Polling
- WebSockets, if supported by a future provider
- Cached backend responses
- Scheduled updates

The choice should depend on provider capabilities, data requirements, and rate limits.

---

# 13. Technical Architecture

## Current Technology

- React Native
- Expo
- Expo Router
- JavaScript
- React hooks
- React Native SVG
- react-native-wagmi-charts
- react-native-element-dropdown
- react-native-paper
- Alpha Vantage

## Existing Component Concepts

- `StockCard`
- `PatternCard`
- `StockChart`
- `PatternLegend`
- `Marker`
- `DateRangePicker`
- `StockSearchbar`

## Important Engineering Principles

- Separate data processing from presentation.
- Keep reusable components focused on a single responsibility.
- Share pattern visual configurations.
- Avoid duplicating stock-search logic.
- Use responsive layouts for web and mobile.
- Verify functionality before making large architectural changes.
- Avoid premature abstractions.

### Maintenance

Re-run `npm audit` during the next Expo SDK upgrade.

The earlier audit reported 27 transitive vulnerabilities whose available fixes required potentially breaking Expo or Expo Router changes. Recheck the current dependency status rather than assuming that count is unchanged.

---

# 14. Development Roadmap

## Immediate Priorities

1. Finish Pattern Scanner result-card styling.
2. Improve date-picker typography.
3. Verify reusable marker behavior across the scanner and chart.
4. Test responsive layouts.
5. Verify detection results and chart annotations.
6. Improve scanner loading and error states.

## Near-Term Priorities

7. Finish Watchlist functionality.
8. Complete stock-specific Stock Detail integration.
9. Improve API integration and data management.
10. Implement the collapsible desktop sidebar.
11. Add global stock search.
12. Establish consistent light and dark themes.

## Product Expansion

13. Design the public landing page.
14. Implement authentication and user accounts.
15. Add persistent watchlists.
16. Develop Daily Report and news features.
17. Integrate AI research summaries.
18. Prototype multi-stock pattern screening.
19. Expand toward a full Stock Screener.

---

# 15. Before I Stop Working

**Date:** October 9, 2026

## Last Worked On

Stock Buddy's Pattern Scanner UI, followed by broader product design and architecture planning.

### Recent Development Accomplishments

- Improved date-range preset controls.
- Styled the pattern-selection dropdown.
- Added colored markers to dropdown items.
- Reused pattern marker visuals.
- Developed custom selected-pattern chips.
- Continued integrating chart and scanner presentation.

### Recent Product Decisions

- Use a collapsible desktop sidebar.
- Plan a global stock-search field.
- Add a public landing page before account registration.
- Explore a handshake-themed money-stack logo.
- Keep the Pattern Scanner as a central feature.
- Add a Stock Screener to the future roadmap.

## Next Development Session

**Primary task: Redesign `PatternCard`.**

Start by reviewing the existing component and its styles.

Desired outcome:
- Compact, modern result cards.
- Matching pattern marker and name.
- Clear match counts.
- Better organization of matching dates.
- Consistent appearance with the rest of the Pattern Scanner.

Afterward:
- Update date-picker typography.
- Refine layout spacing.
- Verify responsive behavior.
- Test the complete scanner workflow.

## Current Focus

**Finish and polish the Pattern Scanner before expanding into major new features.**

Stock Buddy now has a clearer long-term direction: a stock research and education platform with approachable design, interactive analysis tools, personalized features, and eventually multi-stock screening.