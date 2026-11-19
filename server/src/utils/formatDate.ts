export function formatDateAsISODate(date: Date | null){
    if (date == null){
        return ""
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export function formatDisplayDate(dateString: string) {
    const convertedDate = new Date(`${dateString}T00:00:00`);
    
    const formattedDate = convertedDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });

    return formattedDate;
}