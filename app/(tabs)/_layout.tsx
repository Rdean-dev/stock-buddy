import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{tabBarActiveTintColor: 'blue'}}>
      <Tabs.Screen 
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({color}) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen 
        name="daily-report"
        options={{
          title: 'Daily Report',
          tabBarIcon: ({color}) => <FontAwesome size={28} name="line-chart" color={color} />,
        }}
      />
      <Tabs.Screen 
        name="watchlist"
        options={{
          title: 'Watchlist',
          tabBarIcon: ({color}) => <FontAwesome size={28} name="star" color={color} />,
        }}
      />
      <Tabs.Screen 
        name="pattern-scanner"
        options={{
          title: 'Pattern Scanner',
          tabBarIcon: ({color}) => <FontAwesome6 size={28} name="magnifying-glass-chart" color={color} iconStyle="solid" />
        }}
      />
      <Tabs.Screen 
        name="news"
        options={{
          title: 'News',
          tabBarIcon: ({color}) => <FontAwesome6 size={28} name="newspaper" color={color} />,
        }}
      />

    </Tabs>
  );
}
