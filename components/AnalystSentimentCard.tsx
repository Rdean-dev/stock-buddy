import type {RecommendationTrends} from "../types/stock"
import { View, Text} from "react-native";

type AnalystSentimentCardProps = {
    latestRecommends: RecommendationTrends;
}

export default function AnalystSentimentCard({latestRecommends}: AnalystSentimentCardProps) {
    
    const ratings = [
        {
            label: "Strong Buy",
            color: "#166534",
            count: latestRecommends.strongBuy,
        },
        {
            label: "Buy",
            color: "#16A34A",
            count: latestRecommends.buy,
        },
        {
            label: "Hold",
            color: "#64748B",
            count: latestRecommends.hold,
        },
        {
            label: "Sell",
            color: "#DC2626",
            count: latestRecommends.sell,
        },
        {
            label: "Strong Sell",
            color: "#991B1B",
            count: latestRecommends.strongSell,
        }]

    return(
        <View style={{flexDirection: "row", overflow: "hidden", height: 24, borderRadius: 4,}}>
            {ratings.filter((rating) => rating.count > 0).map((rating) => (
                <View key={rating.label} style={{flex: rating.count, backgroundColor: rating.color, alignItems: "center", justifyContent: "center"}}>
                    <Text numberOfLines={1}>{rating.count} {rating.label}</Text>
                </View>))}
        </View>
    );
}
