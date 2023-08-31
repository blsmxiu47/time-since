export default function DurationCalculator() {
    return (
        <main>
            <h1>Duration Calculator</h1>
            <p>Calculate duration between two times or dates</p>
            <form>
                <label htmlFor='start-date'>
                    Start Date
                </label>
                <input
                    id='start-date'
                    type='date'
                />
                <label htmlFor='end-date'>
                    End Date
                </label>
                <input
                    id='end-date'
                    type='date'
                />
                <button type='submit'>
                    Calculate
                </button>
            </form>
        </main>
    )
}