import DarkModeToggle from "./DarkModeToggle";

export default function Header() {
    return (
        <header className="border-b dark:border-gray-300">
            <div className="container mx-auto px-4 sm:px-6 py-4">
                <div className="flex items-center justify-between text-black-700 dark:text-gray-300">
                    <span
                        className="font-bold text-lg tracking-light whitespace-nowrap"
                    >
                        Time Since...
                    </span>
                    <DarkModeToggle />
                </div>
            </div>
        </header>
    )
}