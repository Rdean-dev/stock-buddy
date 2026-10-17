//import datas from '../data/mockDailyIBMData.json';
//import data from '../data/mockSearchDataBA.json';
const apiKey = process.env.EXPO_PUBLIC_ALPHA_VANTAGE_API_KEY;
const apiKey2 = process.env.EXPO_PUBLIC_FINANCIAL_MODELING_PREP_API_KEY;

export async function searchStocksData(searchKeyword) {

    const encodedSearchKeyword = encodeURIComponent(searchKeyword);
    //const searchBySymbolapiUrl =`https://financialmodelingprep.com/stable/search-symbol?query=${encodedSearchKeyword}&apikey=${apiKey2}`;
    const searchByNameapiUrl =`https://financialmodelingprep.com/stable/search-name?query=${encodedSearchKeyword}&apikey=${apiKey2}`;
    //const apiUrl =`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodedSearchKeyword}&apikey=${apiKey}`;

    try {
        const response = await fetch(searchByNameapiUrl);

        const data = await response.json();
        const filteredArrayOfMatches = data.map((matchEntry) => {
            return {symbol: matchEntry["symbol"], name: matchEntry["name"]}
        });
        console.log("FMP Response", data);
        console.log("FMP Responsefiltered", filteredArrayOfMatches);
        return filteredArrayOfMatches.slice(0, 10);
        
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }


}

export async function getStockData(company) {
    const encodedCompany= encodeURIComponent(company.symbol);
    const apiUrl =`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${encodedCompany}&apikey=${apiKey}`;



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

export async function getStockProfile(company) {
    const encodedCompany = encodeURIComponent(company);
    const apiUrl = `https://financialmodelingprep.com/stable/profile?symbol=${encodedCompany}&apikey=${apiKey2}`;

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
