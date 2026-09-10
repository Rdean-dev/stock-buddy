import DateTimePicker, {DateTimePickerEvent}  from "@react-native-community/datetimepicker"
import {Text, View, StyleSheet, Button, Pressable} from 'react-native';
import {useState} from 'react';

type DateRangePickerProps = {
  startDate: Date;
  endDate: Date;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
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
        <View>
            {showStartPicker && (<DateTimePicker 
                mode="date" onChange={handleStartDateChange} value={startDate}/>)}
            <Pressable onPress={() => setShowStartPicker(!showStartPicker)}><Text>Start Date</Text></Pressable>
            {showEndPicker && (<DateTimePicker 
                mode="date" onChange={handleEndDateChange} value={endDate}/>)}
            <Pressable onPress={() => setShowEndPicker(!showEndPicker)}><Text>End Date</Text></Pressable>
        </View>
        
    
    );

}