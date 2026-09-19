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
                <Pressable style={styles.date} onPress={() => setShowStartPicker(!showStartPicker)}><Text style={styles.title}>Start Date</Text><Text>{(startDate) ? startDate.toLocaleDateString() : "Select a date"}</Text></Pressable>
                {showStartPicker && (<DateTimePicker 
                    mode="date" onChange={handleStartDateChange} value={startDate ?? new Date()}/>)}
            </View>
            <View style={styles.dateSection}>
                <Pressable style={styles.date} onPress={() => setShowEndPicker(!showEndPicker)}><Text style={styles.title}>End Date</Text><Text>{(endDate) ? endDate.toLocaleDateString() : " Select a date"}</Text></Pressable>
                {showEndPicker && (<DateTimePicker 
                    mode="date" onChange={handleEndDateChange} value={endDate ?? new Date()}/>)}
            </View>   
        </View>
        
    
    );


}

const styles = StyleSheet.create({

    dateRow: {
        flexDirection: 'row',
        gap: 16,
    },                                                                                                                        

    title:{
        fontSize: 20
    },

    dateSection: {
        flexDirection: "column",
        flex: 1,
        gap: 6,
    },
    
    date: {
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'blue',
        padding: 8,
        borderRadius: 6,
    },
})