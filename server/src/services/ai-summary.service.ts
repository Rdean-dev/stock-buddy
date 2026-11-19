type PriceActionMetrics = {
    sessionDate: string;
    previousSessionDate: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    previousClose: number;
    priceChange: number;
    priceChangePercent: number | null;
    volumeChangePercent: number | null;
    sessionRange: number;
    previousSessionRange: number;
    closePositionPercent: number | null;
}

export async function generatePriceSummary(ticker: string, metrics: PriceActionMetrics){
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: 'openrouter/free',
            messages: [
                {
                    role: "system",
                    content: `Write exactly two short, plain-language sentences providing a daily price action recap. Connect the price move, closing position within the daily range, and trading volume into a coherent description rather than listing metrics.
                        Use only the supplied facts. Do not invent causes, predictions, trading advice, or unsupported interpretations.
                        Identify the ticker and sessionDate. Describe the closing price and its dollar and percentage change from previousClose.
                        Then describe volumeChangePercent relative to the previous session and, if useful, where the close fell within the session range.
                        closePositionPercent means position from the session low (0) to the session high (100), not change from the previous close.
                        Positive changes mean increases; negative changes mean decreases.
                        Omit null or missing metrics. Use supplied calculated percentages rather than recalculating them.
                        Round prices to two decimal places and percentages to one or two decimal places.
                        Return plain text without headings, bullets, or markdown. Format the supplied sessionDate as “Month D, YYYY” (for example, “September 16, 2026”). Always use the actual supplied date.`,
                },
                {
                    role: "user",
                    content: `Ticker: ${ticker}\nMetrics: ${JSON.stringify(metrics)}`,
                },
            ],

        }),
    });

    if(!response.ok){
        throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content
}