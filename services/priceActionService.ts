import { PriceActionSummary } from "@/types/stock";


export async function getPriceActionSummary(symbol:string): Promise<PriceActionSummary | null>{
    
    try {
        const response = await fetch(
            `http://localhost:3000/api/price-action-summary/${encodeURIComponent(symbol)}`
        );

        if(!response.ok){
            throw new Error(`Summary request failed: ${response.status}`);
        }

        const data = await response.json();

        
        return data.data;
        

    } catch (error) {
        console.error('Error fetching price Summary:', error);
        return null;
    }
}