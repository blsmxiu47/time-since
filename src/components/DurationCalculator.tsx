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
    const [startTimeHour, setStartTimeHour] = useState<number | null>(null);
    const [startTimeMinute, setStartTimeMinute] = useState<number | null>(null);
    const [startTimeSecond, setStartTimeSecond] = useState<number | null>(null);
    const [endDate, setEndDate] = useState<string>('');
    const [endTimeHour, setEndTimeHour] = useState<number | null>(null);
    const [endTimeMinute, setEndTimeMinute] = useState<number | null>(null);
    const [endTimeSecond, setEndTimeSecond] = useState<number | null>(null);
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
        if (!startDate || !endDate) {
            return;
        }
        const startTime = new Date(startDate);
        startTime.setHours(Number(startTimeHour), Number(startTimeMinute), Number(startTimeSecond));
        const endTime = new Date(endDate);
        endTime.setHours(Number(endTimeHour), Number(endTimeMinute), Number(endTimeSecond));
        if (startDate > endDate) {
            // TODO: Show an error message to the user in a better UI/UX way
            alert('Start date must be before end date');
            return;
        }

        const msDiff = Math.abs(endTime.getTime() - startTime.getTime());
        const secondsDiff = msDiff / 1000;
        const minutesDiff = secondsDiff / 60;
        const hoursDiff = minutesDiff / 60;
        const daysDiff = hoursDiff / 24;
        const weeksDiff = daysDiff / 7;

        // Calculate the total years, months, and days difference
        const startYear = startTime.getFullYear();
        const endYear = endTime.getFullYear();
        const startMonth = startTime.getMonth();
        const endMonth = endTime.getMonth();
        const startDateOfMonth = startTime.getDate();
        const endDateOfMonth = endTime.getDate(); 
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

        // Set the state variable with the calculated differences
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

    const hasResults = Object.values(duration).some((value) => value !== null);
    
    // To set the start date to the current date (via TODAY button)
    const setToToday = (target: "start" | "end") => {
        const now = new Date();
        const formattedDate = now.toISOString().split('T')[0];
        switch (target) {
            case "start":
                setStartDate(formattedDate);
                break;
            case "end":
                setEndDate(formattedDate);
                break;
            default:
                return;
        }
    }
    
    // To set the start datetime to the current date and time (down to seconds grain, via NOW button)
    const setToNow = (target: "start" | "end") => {
        const now = new Date();
        const formattedDate = now.toISOString().split('T')[0];
        switch (target) {
            case "start":
                setStartDate(formattedDate);
                setStartTimeHour(now.getHours());
                setStartTimeMinute(now.getMinutes());
                setStartTimeSecond(now.getSeconds());
                break;
            case "end":
                setEndDate(formattedDate);
                setEndTimeHour(now.getHours());
                setEndTimeMinute(now.getMinutes());
                setEndTimeSecond(now.getSeconds());
                break;
            default:
                return;
        }
    };

    return (
        <div className="mt-4 mx-2">
            <h1 className="text-xl text-black dark:text-gray-300">Duration Calculator</h1>
            <p className="text-black dark:text-gray-300">Calculate duration between two times or dates</p>
            <div className='lg:flex lg:flex-row lg:justify-between'>
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="my-4 border-b max-w-lg">
                        <div className="block my-2 h-20">
                            <label
                                className="block mb-2 font-bold text-black dark:text-gray-300"
                                htmlFor='start-date'
                            >
                                Start Date:
                            </label>
                            <input
                                id='start-date'
                                className="rounded-lg bg-gray-100 dark:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700"
                                type='date'
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                            <button
                                className="bg-emerald-500 dark:bg-emerald-600 hover:bg-emerald-400 dark:hover:bg-emerald-500 text-white font-bold my-2 py-2 px-4 border-b-4 border-emerald-700 dark:border-emerald-900 hover:border-emerald-500 dark:hover:border-emerald-700 rounded active:border-b-2 h-[2.65rem] focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 ml-2"
                                onClick={()=>setToToday("start")}
                            >
                                TODAY
                            </button>
                        </div>
                        <span className='mb-2 font-bold text-black dark:text-gray-300'>Start Time (optional):</span>
                        <div className="flex flex-row my-2">
                            <div className='px-2 text-center'>
                                <label
                                    className="inline-block mr-2 text-black dark:text-gray-300"
                                    htmlFor='start-time-hour'
                                >
                                    Hour:
                                </label>
                                <input
                                    id='start-time-hour'
                                    pattern='\d{0,2}'
                                    className='w-[4.5rem] text-center rounded-lg bg-gray-100 dark:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700'
                                    type='number'
                                    min='0'
                                    max='23'
                                    value={startTimeHour?.toString()}
                                    onChange={(e) => setStartTimeHour(parseInt(e.target.value))}
                                    placeholder='0'
                                />
                            </div>
                            <div className='px-2 text-center'>
                                <label
                                    className="inline-block mr-2 text-black dark:text-gray-300"
                                    htmlFor='start-time-minute'
                                >
                                    Minute:
                                </label>
                                <input
                                    id='start-time-minute'
                                    pattern='\d{0,2}'
                                    className='w-[4.5rem] text-center rounded-lg bg-gray-100 dark:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700'
                                    type='number'
                                    min='0'
                                    max='59'
                                    value={startTimeMinute?.toString()}
                                    onChange={(e) => setStartTimeMinute(parseInt(e.target.value))}
                                    placeholder='00'
                                />
                            </div>
                            <div className='px-2 text-center'>
                                <label
                                    className="inline-block mr-2 text-black dark:text-gray-300"
                                    htmlFor='start-time-second'
                                >
                                    Second:
                                </label>
                                <input
                                    id='start-time-second'
                                    pattern='\d{0,2}'
                                    className='w-[4.5rem] text-center rounded-lg bg-gray-100 dark:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700'
                                    type='number'
                                    min='0'
                                    max='59'
                                    value={startTimeSecond?.toString()}
                                    onChange={(e) => setStartTimeSecond(parseInt(e.target.value))}
                                    placeholder='00'
                                />
                            </div>
                            <div className="flex flex-col justify-center">
                                <button
                                    className="mt-6 mb-3 w-[4.5rem] bg-emerald-500 dark:bg-emerald-600 hover:bg-emerald-400 dark:hover:bg-emerald-500 text-white font-bold my-2 py-2 px-4 border-b-4 border-emerald-700 dark:border-emerald-900 hover:border-emerald-500 dark:hover:border-emerald-700 rounded active:border-b-2 h-[2.65rem] focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700"
                                    onClick={()=>setToNow("start")}
                                >
                                    NOW
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="my-4 border-b max-w-lg">
                        <div className="block my-2">
                            <label
                                className="block mb-2 font-bold text-black dark:text-gray-300"
                                htmlFor='end-date'
                            >
                                End Date:
                            </label>
                            <input
                                id='end-date'
                                className='rounded-lg bg-gray-100 dark:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700'
                                type='date'
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                            <button
                                className="bg-emerald-500 dark:bg-emerald-600 hover:bg-emerald-400 dark:hover:bg-emerald-500 text-white font-bold my-2 py-2 px-4 border-b-4 border-emerald-700 dark:border-emerald-900 hover:border-emerald-500 dark:hover:border-emerald-700 rounded active:border-b-2 h-[2.65rem] focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 ml-2"
                                onClick={()=>setToToday("end")}
                            >
                                TODAY
                            </button>
                        </div>
                        <span className='mb-2 font-bold text-black dark:text-gray-300'>End Time (optional):</span>
                        <div className="flex flex-row my-2">
                            <div className='px-2 text-center'>
                                <label
                                    className="inline-block mr-2 text-black dark:text-gray-300"
                                    htmlFor='end-time-hour'
                                >
                                    Hour:
                                </label>
                                <input
                                    id='end-time-hour'
                                    pattern='\d{0,2}'
                                    className='w-[4.5rem] text-center rounded-lg bg-gray-100 dark:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700'
                                    type='number'
                                    min='0'
                                    max='23'
                                    value={endTimeHour?.toString()}
                                    onChange={(e) => setEndTimeHour(parseInt(e.target.value))}
                                    placeholder='0'
                                />
                            </div>
                            <div className='px-2 text-center'>
                                <label
                                    className="inline-block mr-2 text-black dark:text-gray-300"
                                    htmlFor='end-time-minute'
                                >
                                    Minute:
                                </label>
                                <input
                                    id='end-time-minute'
                                    pattern='\d{0,2}'
                                    className='w-[4.5rem] text-center rounded-lg bg-gray-100 dark:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700'
                                    type='number'
                                    min='0'
                                    max='59'
                                    value={endTimeMinute?.toString()}
                                    onChange={(e) => setEndTimeMinute(parseInt(e.target.value))}
                                    placeholder='00'
                                />
                            </div>
                            <div className='px-2 text-center'>
                                <label
                                    className="inline-block mr-2 text-black dark:text-gray-300"
                                    htmlFor='end-time-second'
                                >
                                    Second:
                                </label>
                                <input
                                    id='end-time-second'
                                    pattern='\d{0,2}'
                                    className='w-[4.5rem] text-center rounded-lg bg-gray-100 dark:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700'
                                    type='number'
                                    min='0'
                                    max='59'
                                    value={endTimeSecond?.toString()}
                                    onChange={(e) => setEndTimeSecond(parseInt(e.target.value))}
                                    placeholder='00'
                                />
                            </div>
                            <button
                                className="mt-6 mb-3 py-2 px-4 w-[4.5rem] h-[2.65rem] bg-emerald-500 dark:bg-emerald-600 hover:bg-emerald-400 dark:hover:bg-emerald-500 text-white font-bold border-b-4 border-emerald-700 dark:border-emerald-900 hover:border-emerald-500 dark:hover:border-emerald-700 rounded active:border-b-2 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700"
                                onClick={()=>setToNow("end")}
                            >
                                NOW
                            </button>
                        </div>
                    </div>
                    <button
                        className="my-2 py-2 px-4 h-[2.65rem] text-white bg-teal-500 dark:bg-teal-600 hover:bg-teal-400 dark:hover:bg-teal-500 font-bold  border-b-4 border-teal-700 dark:border-teal-900 hover:border-teal-500 dark:hover:border-teal-700 rounded active:border-b-2 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700"
                        type='submit'
                        onClick={calculateDuration}
                    >
                        Calculate
                    </button>
                </form>
                {hasResults &&
                    <div className="rounded-lg mx-2 sm:mx-4 max-w-fit max-h-[12rem] p-2 sm:px-4 dark:text-gray-300 bg-black dark:bg-white bg-opacity-10 dark:bg-opacity-10">
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
                    </div>}
            </div>
        </div>
    )
}

export default DurationCalculator;