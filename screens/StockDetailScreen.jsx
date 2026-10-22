import React from "react";
import {Text, StyleSheet, View, ScrollView } from 'react-native';


export default function StockDetailScreen({ ticker }) {
    
    return (
        <>
            <ScrollView style={styles.container}>
                <Text style={styles.header}>{ticker}</Text>
                
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>AI Research Summary</Text>
                </View>
                <View style={styles.chartContainer}>
                    <Text style={styles.sectionTitle}>Stock Chart</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Price Action Summary</Text>
                </View>
                <View style={styles.rowContainer}>
                    <View style={styles.halfSection}>
                        <Text style={styles.sectionTitle}>Technical Pattern Signals</Text>
                    </View>
                    <View style={styles.halfSection}>
                        <Text style={styles.sectionTitle}>Analyst Sentiment</Text>
                    </View>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Recent News Summary</Text>
                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({

    container: {
        backgroundColor: "#0a0a0a",
        flex: 1,
        padding: 12,
    },
    
    section: {
        backgroundColor: "#1a1a1a",
        borderRadius: 16,
        padding: 15,
        marginBottom: 12,
    },

    chartContainer: {
        backgroundColor: "#1a1a1a",
        borderRadius: 16,
        height: 250,
        padding: 15,
        marginBottom: 12,
    },

    rowContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },

    halfSection: {
        backgroundColor: "#1a1a1a",
        borderRadius: 16,
        padding: 15,
        width: "48%",
    },

    sectionTitle: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },

    header: {
        color: "white",
        fontSize: 25,
    },
})