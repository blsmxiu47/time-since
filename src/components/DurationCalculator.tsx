export default function DurationCalculator() {
    return (
        <main>
            <h1 className="text-black dark:text-gray-300">Duration Calculator</h1>
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
                />
                <button
                    className="text-black dark:text-gray-300"
                    type='submit'
                >
                    Calculate
                </button>
            </form>
        </main>
    )
}