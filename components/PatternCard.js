import React from 'react';
import  Marker  from "../components/Marker";
import {Text, StyleSheet, View, ScrollView,useWindowDimensions, Pressable } from 'react-native';
import { patternAnnotationVisuals } from "../constants/patternAnnotationVisuals";
import { Breakpoints } from '../constants/breakpoints';
import { useState} from "react";
import { theme } from "../constants/theme";

export default function PatternCard({pattern}){
    const { width } = useWindowDimensions();
    const isMobile = width < Breakpoints.mobile;
    const [expanded, setExpanded] = useState(false);
    const visibleDates = expanded ? pattern.dates : pattern.dates.slice(-3);

    return isMobile ? (
        <View style={[styles.patternCard,{gap: 6, paddingHorizontal: 12, paddingVertical: 12, flexDirection: 'column', alignItems: 'stretch',}]}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 12,}}>
                <View style={[styles.patternSection, {width: 'auto', flex: 1, minWidth: 0,}]}>
                    <Marker 
                        shape={patternAnnotationVisuals[pattern.name].shape} 
                        color={patternAnnotationVisuals[pattern.name].color}/>
                    <Text style={styles.header}>{pattern.name}</Text>
                </View>
                <Text style={[styles.patternText, styles.matches, {width: 'auto', flexShrink: 0}]}>{pattern.count === 1 ? `${pattern.count} match` : `${pattern.count} matches`}</Text>
            </View>
            <View>
                <Text style={[styles.patternText, styles.dates, {fontSize: 13, width: '100%'}]}>{(pattern.dates.length > 0) ? visibleDates.join(', ') : '--'}</Text>
                {pattern.dates.length > 3 && 
                    <Pressable onPress={() => setExpanded(!expanded)}>
                        <Text style={{fontSize: 13, fontWeight: '500', color: '#059669', marginTop: 4,}}>{expanded ? "Show less": `+${pattern.dates.length - 3} more`}</Text>
                    </Pressable>}
            </View>
        </View>

    ) : (
        <View style={styles.patternCard}>
            <View style={styles.patternSection}>
                <Marker 
                    shape={patternAnnotationVisuals[pattern.name].shape} 
                    color={patternAnnotationVisuals[pattern.name].color}/>
                <Text style={styles.header}>{pattern.name}</Text>
            </View>
            <Text style={[styles.patternText, styles.matches]}>{pattern.count}</Text>
            <View style={{width: '45%'}}>
                <Text style={[styles.patternText, styles.dates, {width: '100%'}]}>{(pattern.dates.length > 0) ? visibleDates.join(', ') : '--'}</Text>
                {pattern.dates.length > 3 && 
                    <Pressable onPress={() => setExpanded(!expanded)}>
                        <Text style={{fontSize: 13, fontWeight: '500', color: '#059669', marginTop: 4,}}>{expanded ? "Show less": `+${pattern.dates.length - 3} more`}</Text>
                    </Pressable>}
            </View>
        </View>
    );


}

const styles = StyleSheet.create({
    patternCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.cardBorderColor
        
    },

    patternText: {
        fontSize: 14,
    },
    header: {
        fontSize: 14,
        fontWeight: "500",
        color: "#0F172A",
        flexShrink: 1,
    },
    matches:{
        width: '15%',
        fontWeight: "600",
        color: '#0F172A'
    },
    dates:{
        width: '45%',
        fontWeight: theme.typography.labelWeight,
        color: '#64748B',
    },
    patternSection:{
        width: '40%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    }
})