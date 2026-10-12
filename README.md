# Stock Buddy — AI Stock Watchlist Assistant

Stock Buddy is an AI-focused stock research companion being built to bring stock tracking, technical analysis, and conversational market exploration into one cross-platform application.

The goal is to help users move from viewing market data to understanding it: explore a stock, identify candlestick patterns, and ask an AI assistant questions grounded in the data they are examining.

> **Status:** In active development. Stock tracking and technical analysis form the current foundation; LLM integration and AI-assisted analysis are planned capabilities.

## Product Vision

Stock Buddy combines interactive research tools with an AI assistant designed to help users explore market information in context.

The product direction includes:

- **AI-assisted analysis:** Generate understandable explanations of market data and detected technical patterns.
- **Conversational research:** Ask follow-up questions about a selected stock, chart, or analysis result.
- **Connected research tools:** Bring watchlists, stock details, historical charts, and pattern scanning into a shared workflow.
- **Daily market insights:** Develop reports that combine market information with AI-generated explanations.

The intended assistant will use application data and analysis results as context, helping users investigate what they see rather than relying on disconnected, generic responses.

## Current Development

The technical analysis foundation includes:

- Cross-platform interfaces built with React Native, TypeScript, and Expo
- Watchlist and stock-detail screens with reusable components
- Navigation using Expo Router
- Responsive mobile and web layouts
- Historical OHLC market-data normalization and date-range filtering
- Multi-pattern candlestick scanning
- Interactive candlestick charts with range presets, crosshair tooltips, and OHLC readouts
- Chart annotations and a legend connecting detected patterns to their locations

Development is continuing across stock information, watchlist functionality, market reporting, and the architecture needed to support AI features.

## Pattern Scanner

The Pattern Scanner lets users explore historical stock data within a selected date range and choose which candlestick patterns to detect.

Market data is normalized into chronological candle records containing date, open, high, low, close, and volume values. Modular pattern-recognition functions evaluate these records, while chart annotations show where matches occur.

This analysis layer provides a foundation for future AI features that explain detected patterns and answer questions about the selected data.

## AI Development Direction

Planned AI work includes:

- Integrating an LLM through a backend service
- Providing selected market data and scanner results as context
- Connecting conversational responses to stock research workflows
- Evaluating responses for accuracy, relevance, and clear communication of uncertainty

These capabilities are part of the product roadmap and are not yet implemented.

## Tech Stack

- React Native
- TypeScript / JavaScript
- Expo
- Expo Router
- react-native-wagmi-charts
- react-native-svg
- Alpha Vantage market-data formats
- Git / GitHub

## Running the Project

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npx expo start
```

Run the application using Expo Go, a compatible Android/iOS development environment, or the web. Configuration for market-data access depends on the current development setup.

## Roadmap

- Expand stock details and watchlist management
- Add persistent storage and backend services
- Develop daily market reporting
- Integrate LLM-powered analysis and conversational assistance
- Add automated tests for pattern recognition and data processing
- Refine chart interactions, accessibility, and responsive layouts

## About the Project

Stock Buddy is an independent software engineering project exploring how cross-platform interfaces, market-data processing, technical analysis, and LLM-powered assistance can work together in a useful research experience.
