

const apiKey = process.env.EXPO_PUBLIC_ALPHA_VANTAGE_API_KEY;

export async function searchStocksData(searchKeyword) {

    const encodedSearchKeyword = encodeURIComponent(searchKeyword);
    const apiUrl =`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodedSearchKeyword}&apikey=${apiKey}`;


    try {
        const response = await fetch(apiUrl);

        const data = await response.json();
        console.log("Alpha Vantage response:", data);
        const filteredArrayOfMatches = data["bestMatches"].map((matchEntry) => {
            return {symbol: matchEntry["1. symbol"], name: matchEntry["2. name"]}
        });

        return filteredArrayOfMatches;
    } catch (error) {
        console.error('Error fetching data:', error);
    }


}