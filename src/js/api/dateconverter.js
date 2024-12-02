function calculateMinutesToHours(totalMinutes) {
    let hours = Math.floor(totalMinutes / 60);
    let minutes = totalMinutes % 60;
    return hours + "H " + minutes + "M";
}

// Format date from (YYYY-MM-DD) to (MM-DD-YYYY)
function formatDateToShortMonth(releaseDateString) {
    const date = new Date(releaseDateString);
    let month = date.toLocaleDateString('default', { month: 'short' });
    return month + " " + date.getDate() + ", " + date.getFullYear();
}

// Receives a date
function getHourMinuteFromDateTime(dateTime) {
    const timeString = dateTime.split('T')[1];
    const timeFormatted = timeString.split(':');

    const hour = timeFormatted[0];
    const minute = timeFormatted[1];
    return hour + ":" + minute;
}

export {calculateMinutesToHours, formatDateToShortMonth, getHourMinuteFromDateTime};