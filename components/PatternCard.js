import React from 'react';

import {Text, StyleSheet, View, ScrollView } from 'react-native';

export function PatternCard({pattern}){
    

    return(
        <View>
            <Text>{pattern.name}</Text>
            <Text>Count: {pattern.count}</Text>
            <Text>Type: {pattern.type}</Text>
            <Text>Dates: {pattern.dates.join(', ')}</Text>
        </View>
    );


}