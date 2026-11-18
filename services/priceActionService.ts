

export async function getPriceActionSummary(symbol:string) {
    
    const encodedSymbol  = encodeURIComponent(symbol);
    
    try {
        const response = await fetch(
            `http://localhost:3000/api/price-action-summary/${encodeURIComponent(symbol)}`
        );

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