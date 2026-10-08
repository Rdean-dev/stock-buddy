import datas from '../data/mockDailyIBMData.json';
import data from '../data/mockSearchDataBA.json';
const apiKey = process.env.EXPO_PUBLIC_ALPHA_VANTAGE_API_KEY;

export async function searchStocksData(searchKeyword) {

    const encodedSearchKeyword = encodeURIComponent(searchKeyword);
    const apiUrl =`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodedSearchKeyword}&apikey=${apiKey}`;


    try {
        //const response = await fetch(apiUrl);

        //const data = await response.json();
        const filteredArrayOfMatches = data["bestMatches"].map((matchEntry) => {
            return {symbol: matchEntry["1. symbol"], name: matchEntry["2. name"]}
        });

        return filteredArrayOfMatches;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }


}

export async function getStockData(company) {
    const encodedCompany= encodeURIComponent(company.symbol);
    const apiUrl =`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${encodedCompany}&apikey=${apiKey}`;



    try {
        //const response = await fetch(apiUrl);

        //const data = await response.json();
        

        if (datas["Time Series (Daily)"]){
            return datas;
        }
        else{
            console.log("Alpha Vantage incorrect response:", datas);
            return null;
        }
    } catch (error) {
        console.error('Error fetching company data:', error);
        return null;
    }
}