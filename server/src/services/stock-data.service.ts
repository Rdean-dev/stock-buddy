import datas from '../mockdata/mockDailyIBMData.json' with {type: "json"};
//import datas from '../mockdata/mockSearchDataBA.json' with {type: "json"};


import type {WatchlistStock, StockProfile, AlphaVantageDailyResponse, MarketState} from '../types/stock.js';


const avApiKey = process.env.EXPO_PUBLIC_ALPHA_VANTAGE_API_KEY;
const fmpApiKey = process.env.EXPO_PUBLIC_FINANCIAL_MODELING_PREP_API_KEY;
const tvApiKey = process.env.EXPO_PUBLIC_TWELVE_DATA_API_KEY;
const finnhubApiKey = process.env.FINNHUB_API_KEY;
type TwelveDataSearchMatch = {
    symbol: string,
    instrument_name: string
};


export async function searchStocksData(searchKeyword: string) : Promise<WatchlistStock[]> {

    const encodedSearchKeyword = encodeURIComponent(searchKeyword);
    //const searchBySymbolapiUrl =`https://financialmodelingprep.com/stable/search-symbol?query=${encodedSearchKeyword}&apikey=${apiKey2}`;
    //const searchByNameapiUrl =`https://financialmodelingprep.com/stable/search-name?query=${encodedSearchKeyword}&apikey=${apiKey2}`;
    //const apiUrl =`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodedSearchKeyword}&apikey=${apiKey}`;
    const tDataApiUrl = `https://api.twelvedata.com/symbol_search?symbol=${encodedSearchKeyword}&outputsize=10&apikey=${tvApiKey}`;

    try {
        const response = await fetch(tDataApiUrl);

        const data = await response.json();
        const filteredArrayOfMatches = data["data"].map((matchEntry: TwelveDataSearchMatch) => {
            return {symbol: matchEntry["symbol"], name: matchEntry["instrument_name"]}
        });
        console.log("TV Response", data);
        console.log("TV Responsefiltered", filteredArrayOfMatches);
        return filteredArrayOfMatches;
        
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }


}

export async function getStockData(symbol: string) : Promise<AlphaVantageDailyResponse | null>{
    const encodedSymbol  = encodeURIComponent(symbol);
    const apiUrl =`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${encodedSymbol}&apikey=${avApiKey}`;



    try {
        const response = await fetch(apiUrl);

        const data = await response.json();
        

        if (data["Time Series (Daily)"]){
            return data;
        }
        else{
            console.log("Alpha Vantage incorrect response:", data);
            return null;
        }
    } catch (error) {
        console.error('Error fetching company data:', error);
        return null;
    }
}

export async function getStockProfile(company: string) : Promise<StockProfile | null> {
    const encodedCompany = encodeURIComponent(company);
    const apiUrl = `https://financialmodelingprep.com/stable/profile?symbol=${encodedCompany}&apikey=${fmpApiKey}`;

    try {
        const response = await fetch(apiUrl);

        const data = await response.json();
        

        if (data[0]){
            console.log("profile:",data);
            return data[0];
        }
        else{
            console.log("FMP incorrect response:", data);
            return null;
        }
    } catch (error) {
        console.error('Error fetching company data:', error);
        return null;
    }
}

export async function getMarketStatus(): Promise<MarketState | null>{

    
    
    const tDataApiUrl = `https://api.twelvedata.com/market_state?exchange=NYSE&apikey=${tvApiKey}`;

    try {
        const response = await fetch(tDataApiUrl);

        if (!response.ok) {
            console.error('Market status request failed:', response.status);
            return null;
        }

        const data = await response.json();
        

        if (typeof data?.[0]?.is_market_open === 'boolean'){
            console.log("Market Status:",data);
            return data[0];
        }
        else{
            console.log("Twelve Data incorrect response:", data);
            return null;
        }
    } catch (error) {
        console.error('Error fetching market status:', error);
        return null;
    }


}

export async function getCompanyNews(symbol:string, startDate: string, endDate: string,) {

    if( startDate > endDate){
        console.log("Start date must be on or before the end date.");
        return null;
    }
    const encodedSymbol  = encodeURIComponent(symbol);
    
    const finnhubApiUrl = `https://finnhub.io/api/v1/company-news?symbol=${encodedSymbol}&from=${startDate}&to=${endDate}&token=${finnhubApiKey}`;

    try{
        const response = await fetch(finnhubApiUrl);

        if(!response.ok) {
            console.error('Company News request failed: ', response.status);
            return null;
        }

        const data = await response.json();

        if (Array.isArray(data)){
            console.log("Company News:", data);
            return data
        }else {
            console.log("FinnHub Incorrect Response:", data);
            return null;
        }
    } catch (error) {
        console.error('Error fetching company news: ',error);
        return null;
    }
}