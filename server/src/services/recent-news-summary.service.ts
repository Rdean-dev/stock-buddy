import { getCompanyNews } from './stock-data.service.js';
import {formatDateAsString} from '../utils/formatDate.js'
import type { Summary } from '../types/stock.js';
import {generateNewsSummary} from './ai-summary.service.js';
import { fileURLToPath } from 'node:url';

export async function getRecentNewsSummary(symbol:string): Promise<Summary>{
    
    const todayDate = new Date();

    const startDate = new Date(todayDate);
    
    startDate.setDate(todayDate.getDate() - 7);

    const companyNews = await getCompanyNews(symbol, formatDateAsString(startDate), formatDateAsString(todayDate));

    if (!companyNews){
        throw new Error("Company News data is unavailable");
    }

    const articleWithSummaries = companyNews.filter((article) => (article.summary.trim().length > 0))
    
    if(articleWithSummaries.length === 0){
        return {symbol, summary: "No recent company news found."};
    }
    const newsSummaries = articleWithSummaries.map((article) => ({headline: article.headline, summary: article.summary}));

    const summary = await generateNewsSummary(symbol, newsSummaries)

    return {symbol, summary}


}   
