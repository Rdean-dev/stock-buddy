import { Stack } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    
    <GestureHandlerRootView style={{flex: 1}}>
      <QueryClientProvider client={queryClient}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{headerShown: false }}/>
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}



