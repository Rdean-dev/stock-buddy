import React from 'react';

import { Pressable, StyleSheet } from "react-native";
import { formatDateAsISODate } from '../utils/formatDate';
import { theme } from "../constants/theme";

type DateRangePickerProps = {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
};


export default function DateRangePicker({startDate, endDate, onStartDateChange, onEndDateChange}: DateRangePickerProps) {



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
        <div style={dateRow}>
            <div style={dateSection}>
                <label htmlFor='startDate' style={title}>Start date</label>
                <input id='startDate' type="date" style={date} onChange={handleStartDateChange} value={formatDateAsISODate(startDate)} max={(endDate) ? formatDateAsISODate(endDate) : ""}/>
            </div>
            <div style={dateSection}>
                <label htmlFor='endDate' style={title}>End date</label>
                <input id='endDate' type='date' style={date} onChange={handleEndDateChange} value={formatDateAsISODate(endDate)} min={(startDate) ? formatDateAsISODate(startDate) : ""}/>
            </div>   
        </div>
        
    
    );


}



    const dateRow: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        gap: theme.spacing.formRowgap,
    };

    const title: React.CSSProperties = {
        fontSize: theme.typography.labelSize,
        lineHeight: '20px',
        fontFamily: 'Arial, sans-serif',
        fontWeight: theme.typography.labelWeight,
        color: theme.colors.labelColor,

    };

    const dateSection: React.CSSProperties = {
        display: 'flex',
        flexDirection: "column",
        flex: 1,
        gap: 6,
        minWidth: 0,
    };
    
    const date: React.CSSProperties = {
        boxSizing: 'border-box',
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: theme.colors.controlBorder,
        padding: '0 12px',
        borderRadius: theme.radii.controlRadius,
        height: theme.sizes.controlHeight,
        width: '100%',
        minWidth: 0,
        fontFamily: 'Arial, sans-serif',
        fontSize: theme.typography.labelSize,
        color: '#0F172A',

    };
