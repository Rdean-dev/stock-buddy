import { RecommendationTrends, StockSummary } from "@/types/stock";


export async function getPriceActionSummary(symbol:string): Promise<StockSummary | null>{
    
    try {
        const response = await fetch(
            `http://192.168.6.90:3000/api/price-action-summary/${encodeURIComponent(symbol)}`
        );

        if(!response.ok){
            throw new Error(`Price Summary request failed: ${response.status}`);
        }

        const data = await response.json();

        
        return data.data;
        

    } catch (error) {
        console.error('Error fetching price Summary:', error);
        return null;
    }
}

export async function getRecentNewsSummary(symbol:string): Promise<StockSummary | null>{
    
    try {
        const response = await fetch(
            `http://192.168.6.90:3000/api/recent-news-summary/${encodeURIComponent(symbol)}`
        );

        if(!response.ok){
            throw new Error(`Recent News Summary request failed: ${response.status}`);
        }

        const data = await response.json();

        
        return data.data;
        

    } catch (error) {
        console.error('Error fetching recent news Summary:', error);
        return null;
    }
}

export async function getAnalystRecommendations(symbol: string): Promise<RecommendationTrends[]> {
    const response = await fetch(
        `http://192.168.6.90:3000/api/analyst-recommendations/${encodeURIComponent(symbol)}`
    );

    if (!response.ok) {
        throw new Error(`Analyst recommendations request failed: ${response.status}`);
    }

    const { data } = await response.json();
    if (!Array.isArray(data)) {
        throw new Error("Invalid analyst recommendations response.");
    }

    return data;
}
