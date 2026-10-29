const countdownToMilliseconds = (countdown: string): number => {
    const [hours, minutes, seconds] = countdown.split(':').map(Number);

    return (hours * 3600 + minutes * 60 + seconds) * 1000



}

console.log(countdownToMilliseconds("00:01:00"));