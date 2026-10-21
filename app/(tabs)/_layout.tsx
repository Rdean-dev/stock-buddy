import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { Tabs } from "expo-router";
import { useWindowDimensions, View, Text, Pressable } from "react-native";
import {BottomTabBar} from '@react-navigation/bottom-tabs';
import { Suspense, lazy } from 'react';
import AppHeader from '../../components/navigation/AppHeader';
import { PlatformPressable } from '@react-navigation/elements';


export default function TabLayout() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

  return (
    <Tabs   tabBar={(props) => isLargeScreen ? (
      <View style={{ width: 240, minWidth: 0, backgroundColor: 'white',}}>
        <View style={{flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          padding: 20,}}>
          <MaterialDesignIcons name="finance" color="#059669" size={24} />
          <Text
            style={{
              fontSize: 22,
              fontWeight: 'bold',
              color: '#059669',
              
            }}
          >
            Stock Buddy
          </Text>
        </View>
        <BottomTabBar {...props} />
      </View>
    ) : (
      <BottomTabBar {...props} insets={{ ...props.insets, bottom: 0 }}/>
    )} screenOptions={{header: (props) => <AppHeader {...props} />, 
                      tabBarButton: isLargeScreen ? undefined : (props) => (
                        <PlatformPressable 
                          {...props}
                          style={[props.style, { justifyContent: 'center' }]}
                        />
                      ),
                      tabBarLabelStyle: isLargeScreen ? undefined :{fontSize: 11},
                      tabBarStyle: isLargeScreen ? {width: 240, minWidth: 0,} : {paddingHorizontal: 15, borderRadius: 40, marginBottom: 30, marginHorizontal: 10, paddingBottom: 0, height: 70},
                      tabBarActiveTintColor: '#059669', 
                      tabBarPosition: isLargeScreen ? 'left' : 'bottom', 
                      tabBarVariant: isLargeScreen ? 'material' : 'uikit', 
                      sceneStyle: { backgroundColor: '#F5F7FA' },
                      tabBarItemStyle: isLargeScreen? {} : {alignItems: 'center', justifyContent: 'center'},}}>
      
      <Tabs.Screen 
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({color}) => <FontAwesome size={24} name="home" color={color} />,
        }}
      />
      <Tabs.Screen 
        name="daily-report"
        options={{
          title: 'Report',
          tabBarIcon: ({color}) => <FontAwesome size={24} name="line-chart" color={color} />,
        }}
      />
      <Tabs.Screen 
        name="watchlist"
        options={{
          title: 'Watchlist',
          tabBarIcon: ({color}) => <FontAwesome size={24} name="star" color={color} />,
        }}
      />
      <Tabs.Screen 
        name="pattern-scanner"
        options={{
          title: 'Scanner',
          tabBarIcon: ({color}) => <FontAwesome6 size={24} name="magnifying-glass-chart" color={color} iconStyle="solid" />
        }}
      />
      <Tabs.Screen 
        name="news"
        options={{
          title: 'News',
          tabBarIcon: ({color}) => <FontAwesome6 size={24} name="newspaper" color={color} />,
        }}
      />

    </Tabs>
  );
}
