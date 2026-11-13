
import type { WatchlistStock, StockProfile, AlphaVantageDailyResponse } from '../types/stock';

export default function formatStockProfile(profile:StockProfile | undefined | null, ) {

    const changePercentage = profile?.changePercentage;
    const plusOrMinus = changePercentage == null ? '' : changePercentage > 0 ? '+' : changePercentage < 0 ? '-' : '';
    const formattedPrice = profile?.price != null ? `$${profile.price.toFixed(2)}` : '--';
    const formattedChange = profile?.change != null ? `${plusOrMinus}$${Math.abs(profile?.change).toFixed(2)}` : '--';
    const formattedPercentage = changePercentage != null ? `${plusOrMinus}${Math.abs(changePercentage).toFixed(2)}%` : '--';
    const volume = profile?.volume != null ? `${profile.volume.toLocaleString('en-US')}` : '--'
    const companyName = profile?.companyName
    const description = profile?.description
    const exchange = profile?.exchange
    const exchangeFullName = profile?.exchangeFullName
    const symbol = profile?.symbol
    
    return {formattedPrice, formattedChange, changePercentage, formattedPercentage, volume, companyName, description, exchange, exchangeFullName, symbol};
}