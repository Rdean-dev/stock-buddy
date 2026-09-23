import React from 'react';

import {Text, StyleSheet, View, ScrollView } from 'react-native';

export default function PatternCard({pattern}){
    

    return(
        <View style={styles.patternCard}>
            <Text style={styles.header}>{pattern.name}</Text>
            <Text style={styles.patternText}>{pattern.count} found</Text>
            <Text style={styles.patternText}>Dates: {pattern.dates.join(', ')}</Text>
        </View>
    );


}

const styles = StyleSheet.create({
    patternCard: {
        backgroundColor: "#ccc7c7",
        margin: 8,
        borderRadius: 15,
        padding: 15,
    },

    patternText: {
        color: "#131010",
        fontWeight: "bold",
        fontSize: 15,
    },
    header: {
        fontSize: 22,
        fontWeight: "bold",
        color: "black",
        marginBottom: 4,
    },

})