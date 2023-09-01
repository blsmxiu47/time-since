import { useState } from 'react';

type Duration = {
    milliseconds: number | null;
    seconds: number | null;
    minutes: number | null;
    hours: number | null;
    days: number | null;
    weeks: number | null;
    yearsPart: number | null;
    monthsPart: number | null;
    daysPart: number | null;
};

const DurationCalculator: React.FC = () => {
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [duration, setDuration] = useState<Duration>({
        milliseconds: null,
        seconds: null,
        minutes: null,
        hours: null,
        days: null,
        weeks: null,
        yearsPart: null,
        monthsPart: null,
        daysPart: null,
    });

    const calculateDuration = () => {
        if (!startDate || !endDate) return;

        const start = new Date(startDate);
        const end = new Date(endDate);

        // Calculate the time difference in milliseconds
        const msDiff = Math.abs(end.getTime() - start.getTime());

        // Calculate the number of seconds
        const secondsDiff = msDiff / 1000;
        // Calculate the number of minutes
        const minutesDiff = secondsDiff / 60;
        // Calculate the number of hours
        const hoursDiff = minutesDiff / 60;
        // Calculate the number of days
        const daysDiff = hoursDiff / 24;
        // Calculate the number of weeks
        const weeksDiff = daysDiff / 7;

        // Calculate the total years, months, and days difference
        const startYear = start.getFullYear();
        const endYear = end.getFullYear();
        const startMonth = start.getMonth();
        const endMonth = end.getMonth();
        const startDateOfMonth = start.getDate();
        const endDateOfMonth = end.getDate(); 
        // Example: 1990-08-14~2021-01-05
        // Years: 30
        // Months: 4
        // Days: 22
        const yearsPart = endYear - startYear - Number(startMonth > endMonth);
        let monthsPart = endMonth - startMonth;
        let daysPart = endDateOfMonth - startDateOfMonth
        if (startDateOfMonth > endDateOfMonth) {
            monthsPart = 11 + startMonth - endMonth;
            // Need to know the number of days in the particular start month in 
            // the particular start year, including handling Feb for leap years
            const isLeapYear = (startYear % 4 === 0 && startYear % 100 !== 0) 
                    || startYear % 400 === 0;
            const daysInMonth = 28 + (startMonth + (startMonth/8)) % 2 + 
                2 % startMonth + 2 * (1/startMonth) + 
                (Number(startMonth === 2) * Number(isLeapYear))
            daysPart = daysInMonth - startDateOfMonth + endDateOfMonth;
        } else {
            monthsPart = endMonth - startMonth;
            daysPart = endDateOfMonth - startDateOfMonth;
        }

        // Set the state variable with the calculated number of days
        setDuration({
            milliseconds: msDiff,
            seconds: secondsDiff,
            minutes: minutesDiff,
            hours: hoursDiff,
            days: daysDiff,
            weeks: weeksDiff,
            yearsPart: yearsPart,
            monthsPart: monthsPart,
            daysPart: daysPart,
        });
    };

    return (
        <div>
            <h1 className="text-xl text-black dark:text-gray-300">Duration Calculator</h1>
            <p className="text-black dark:text-gray-300">Calculate duration between two times or dates</p>
            <form>
                <label
                    className="text-black dark:text-gray-300"
                    htmlFor='start-date'
                >
                    Start Date
                </label>
                <input
                    id='start-date'
                    type='date'
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <label
                    className="text-black dark:text-gray-300"
                    htmlFor='end-date'
                >
                    End Date
                </label>
                <input
                    id='end-date'
                    type='date'
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                <button
                    className="text-black dark:text-gray-300"
                    type='submit'
                    onClick={calculateDuration}
                >
                    Calculate
                </button>
            </form>
            {
                duration.yearsPart !== null && duration.monthsPart !== null && duration.daysPart !== null &&
                <p>Total Duration: {duration.yearsPart} years, {duration.monthsPart} months, {duration.daysPart} days</p>
            }
            {duration.weeks !== null && <p>Total Weeks: {duration.weeks}</p>}
            {duration.days !== null && <p>Total Days: {duration.days}</p>}
            {duration.hours !== null && <p>Total Hours: {duration.hours}</p>}
            {duration.minutes !== null && <p>Total Minutes: {duration.minutes}</p>}
            {duration.seconds !== null && <p>Total Seconds: {duration.seconds}</p>}
            {duration.milliseconds !== null && <p>Total Milliseconds: {duration.milliseconds}</p>}
        </div>
    )
}

export default DurationCalculator;