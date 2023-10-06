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
        if (!startDate || !endDate) return;

        // convert components of start time to datetime
        const startTime = new Date(startDate);
        startTime.setHours(Number(startTimeHour));
        startTime.setMinutes(Number(startTimeMinute));
        startTime.setSeconds(Number(startTimeSecond));

        // convert components of end time to datetime
        const endTime = new Date(endDate);
        endTime.setHours(Number(endTimeHour));
        endTime.setMinutes(Number(endTimeMinute));
        endTime.setSeconds(Number(endTimeSecond));

        if (startDate > endDate) {
            alert('Start date must be before end date');
            return;
        }

        // Calculate the time difference in milliseconds
        const msDiff = Math.abs(endTime.getTime() - startTime.getTime());

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

    const hasResults = Object.values(duration).some((value) => value !== null);
    
    // To set the start date to the current date (via TODAY button)
    const setToToday = (target: "start" | "end") => {
        const now = new Date();
        const formattedDate = now.toISOString().split('T')[0];
        if (target === "start") setStartDate(formattedDate);
        else if (target === "end") setEndDate(formattedDate);
        else return;
    }
    
    // To set the start datetime to the current date and time (via NOW button)
    const setToNow = (target: "start" | "end") => {
        const now = new Date();
        const formattedDate = now.toISOString().split('T')[0];
        if (target === "start") {
            setStartDate(formattedDate);
            setStartTimeHour(now.getHours());
            setStartTimeMinute(now.getMinutes());
            setStartTimeSecond(now.getSeconds());
        }
        else if (target === "end") {
            setEndDate(formattedDate);
            setEndTimeHour(now.getHours());
            setEndTimeMinute(now.getMinutes());
            setEndTimeSecond(now.getSeconds());
        }
        else {
            return;
        }
    };

    return (
        <div className="mt-4 mx-2">
            <h1 className="text-xl text-black dark:text-gray-300">Duration Calculator</h1>
            <p className="text-black dark:text-gray-300">Calculate duration between two times or dates</p>
            <form className="mb-4" onSubmit={(e) => e.preventDefault()}>
                <div className="my-4 border-b max-w-lg">
                    <div className="block my-2">
                        <label
                            className="block mb-2 font-bold text-black dark:text-gray-300"
                            htmlFor='start-date'
                        >
                            Start Date:
                        </label>
                        <input
                            id='start-date'
                            className='rounded-lg bg-gray-100 dark:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700'
                            type='date'
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                        <button
                            className="bg-red-500 dark:bg-red-600 hover:bg-red-400 dark:hover:bg-red-500 text-white font-bold my-2 py-2 px-4 border-b-4 border-red-700 dark:border-red-900 hover:border-red-500 dark:hover:border-red-700 rounded active:border-b-2 active:h-11 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 ml-2"
                            onClick={()=>setToToday("start")}
                        >
                            TODAY
                        </button>
                    </div>
                    <span className='mb-2 font-bold text-black dark:text-gray-300'>Start Time (optional):</span>
                    <div className="flex flex-row my-2">
                        <div className='block px-2'>
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
                        <div className='block px-2'>
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
                        <div className='block px-2'>
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
                        <button
                            className="bg-red-500 dark:bg-red-600 hover:bg-red-400 dark:hover:bg-red-500 text-white font-bold my-2 py-2 px-4 border-b-4 border-red-700 dark:border-red-900 hover:border-red-500 dark:hover:border-red-700 rounded active:border-b-2 active:h-11 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 ml-2"
                            onClick={()=>setToNow("start")}
                        >
                            NOW
                        </button>
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
                            className="bg-red-500 dark:bg-red-600 hover:bg-red-400 dark:hover:bg-red-500 text-white font-bold my-2 py-2 px-4 border-b-4 border-red-700 dark:border-red-900 hover:border-red-500 dark:hover:border-red-700 rounded active:border-b-2 active:h-11 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 ml-2"
                            onClick={()=>setToToday("end")}
                        >
                            TODAY
                        </button>
                    </div>
                    <span className='mb-2 font-bold text-black dark:text-gray-300'>End Time (optional):</span>
                    <div className="flex flex-row my-2">
                        <div className='block px-2'>
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
                        <div className='block px-2'>
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
                        <div className='block px-2'>
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
                            className="bg-red-500 dark:bg-red-600 hover:bg-red-400 dark:hover:bg-red-500 text-white font-bold my-2 py-2 px-4 border-b-4 border-red-700 dark:border-red-900 hover:border-red-500 dark:hover:border-red-700 rounded active:border-b-2 active:h-11 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 ml-2"
                            onClick={()=>setToNow("end")}
                        >
                            NOW
                        </button>
                    </div>
                </div>
                <button
                    className="bg-teal-500 dark:bg-teal-600 hover:bg-teal-400 dark:hover:bg-teal-500 text-white font-bold my-2 py-2 px-4 border-b-4 border-teal-700 dark:border-teal-900 hover:border-teal-500 dark:hover:border-teal-700 rounded active:border-b-2 active:h-11 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700"
                    type='submit'
                    onClick={calculateDuration}
                >
                    Calculate
                </button>
            </form>
            {hasResults &&
                <div className="rounded-lg mx-2 sm:mx-4 max-w-fit p-2 sm:px-4 dark:text-gray-300 bg-black dark:bg-white bg-opacity-10 dark:bg-opacity-10">
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
    )
}

export default DurationCalculator;