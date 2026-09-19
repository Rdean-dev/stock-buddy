import React from 'react';

import { StyleSheet, Pressable} from "react-native";

type DateRangePickerProps = {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
};

export default function DateRangePicker({startDate, endDate, onStartDateChange, onEndDateChange}: DateRangePickerProps) {

    const formatDateForInput = (date: Date | null) => {
        if (date == null){
            return ""
        }
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value){
            const [year, month, day] = event.target.value.split('-').map(Number);
            const date = new Date (year, month - 1, day);
        
            onStartDateChange(date);
            
        }else{
            onStartDateChange(null);
        }
        
    }

    const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        if (event.target.value){
            const [year, month, day] = event.target.value.split('-').map(Number);
            const date = new Date (year, month - 1, day);
            
            onEndDateChange(date);
            
        }else{
            onEndDateChange(null);
        }
        
    }


    return(
        <div style={styles.dateRow}>
            <div style={styles.dateSection}>
                <label htmlFor='startDate' style={styles.title}>Start Date</label>
                <Pressable><input id='startDate' type="date" style={styles.date} onChange={handleStartDateChange} value={formatDateForInput(startDate)} max={(endDate) ? formatDateForInput(endDate) : ""}/></Pressable>
            </div>
            <div style={styles.dateSection}>
                <label htmlFor='endDate' style={styles.title}>End Date</label>
                <input id='endDate' type='date' style={styles.date} onChange={handleEndDateChange} value={formatDateForInput(endDate)} min={(startDate) ? formatDateForInput(startDate) : ""}/>
            </div>   
        </div>
        
    
    );


}

const styles = StyleSheet.create({

    dateRow: {
        display: 'flex',
        flexDirection: 'row',
        gap: 16,
    },

    title:{
        fontSize: 20
    },

    dateSection: {
        display: 'flex',
        flexDirection: "column",
        flex: 1,
        gap: 6,
    },
    
    date: {
        backgroundColor: 'white',
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: 'blue',
        padding: 8,
        borderRadius: 6,
        height: 20,

    },
});