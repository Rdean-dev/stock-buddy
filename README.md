# Stock Buddy 

Stock Buddy is a cross-platform stock tracking and technical analysis application built with React Native and TypeScript. The project is designed to help users monitor stocks, explore historical market data, and identify common candlestick patterns through an interactive mobile interface.

> **Status:**  In active development

## Features

### Currently Implemented

* Cross-platform interface built with React Native and Expo
* Watchlist with reusable stock card components
* Stock detail navigation using Expo Router
* Responsive layouts for mobile and web
* Pattern Scanner interface for analyzing historical stock data
* Custom date range selection with 1M, 3M, 6M, and 1Y presets
* Processing and normalization of Alpha Vantage-formatted OHLC market data
* Multi-pattern candlestick scanning
* Doji and Hammer pattern detection
* Display of detected patterns and corresponding dates

### In Development

* Live Alpha Vantage API integration
* Stock ticker search
* Additional candlestick pattern recognition
* Expanded stock detail information
* Daily market reporting and insights
* Watchlist management and persistence

## Pattern Scanner

The Pattern Scanner analyzes historical OHLC (Open, High, Low, Close) market data within a user-selected date range.

Market data is transformed from the Alpha Vantage response format into structured candle objects:

```text
{
  date,
  open,
  high,
  low,
  close,
  volume
}
```

The scanner processes candles chronologically and evaluates each candle against the patterns selected by the user. Pattern calculations are separated from the scanner logic to keep the analysis system modular and extensible.

Currently supported patterns include:

* Doji
* Hammer

Additional candlestick patterns are being added as development continues.

## Tech Stack

* React Native
* TypeScript
* JavaScript
* Expo
* Expo Router
* REST API integration
* Git / GitHub

## Data

Stock Buddy is being developed for integration with the Alpha Vantage market data API.

During development, the Pattern Scanner currently uses locally stored sample Alpha Vantage daily market data. This allows the parsing, filtering, and pattern-recognition logic to be developed and tested before live API integration.

## Running the Project

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npx expo start
```

The application can then be run through Expo Go, an Android/iOS development environment, or the web.

## Project Goals

Stock Buddy is an ongoing personal software development project focused on building experience with:

* Cross-platform application development
* TypeScript and React Native
* Component-based application architecture
* REST API integration
* Financial market data processing
* Algorithmic candlestick pattern recognition
* Responsive mobile and web interfaces

## Roadmap

Future development includes live market data integration, additional candlestick patterns, improved watchlist functionality, expanded stock information, and market analysis features.
