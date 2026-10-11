import DateTimePicker, {DateTimePickerEvent}  from "@react-native-community/datetimepicker"
import {Text, View, StyleSheet, Button, Pressable} from 'react-native';
import {useState} from 'react';

type DateRangePickerProps = {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
};

export default function DateRangePicker({startDate, endDate, onStartDateChange, onEndDateChange}: DateRangePickerProps) {

    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    const handleStartDateChange = (event: DateTimePickerEvent, date: Date | undefined) => {
        if (date){
            onStartDateChange(date);
            setShowStartPicker(false);
        }
        
    }

    const handleEndDateChange = (event: DateTimePickerEvent, date: Date | undefined) => {
        if (date){
            onEndDateChange(date);
            setShowEndPicker(false);
        }
        
    }


    return(
        <View style={styles.dateRow}>
            <View style={styles.dateSection}>
                <Text style={styles.title}>Start Date</Text>
                <Pressable style={styles.date} onPress={() => setShowStartPicker(!showStartPicker)}><Text style={(startDate) ? styles.dateValueText : styles.valueText}>{(startDate) ? startDate.toLocaleDateString() : "Select a date"}</Text></Pressable>
                {showStartPicker && (<DateTimePicker 
                    mode="date" onChange={handleStartDateChange} value={startDate ?? new Date()}/>)}
            </View>
            <View style={styles.dateSection}>
                <Text style={styles.title}>End Date</Text>
                <Pressable style={styles.date} onPress={() => setShowEndPicker(!showEndPicker)}><Text style={(endDate) ? styles.dateValueText : styles.valueText}>{(endDate) ? endDate.toLocaleDateString() : "Select a date"}</Text></Pressable>
                {showEndPicker && (<DateTimePicker 
                    mode="date" onChange={handleEndDateChange} value={endDate ?? new Date()}/>)}
            </View>   
        </View>
        
    
    );


}

const styles = StyleSheet.create({

    dateRow: {
        flexDirection: 'row',
        width: '100%',
        gap: 12,
        paddingTop: 0,
        
    },                                                                                                                        

    title:{
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '400',
        color: '#475569',
    },

    dateSection: {
        flexDirection: "column",
        flex: 1,
        gap: 6,
        minWidth: 0,
    },
    
    date: {
        height: 40,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#D9E1EA',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 0,
        justifyContent: 'center'
    },
    dateValueText:{
        fontSize: 14,
        color: '#0F172A',
    },
    valueText:{
        fontSize: 14,
        color: '#64748B',
    },
})