import DarkModeToggle from "./DarkModeToggle";

export default function Header() {
    return (
        <header className="border-b border-gray-100">
            <div className="container mx-auto px-4 sm:px-6 py-4">
                <p className="flex items-center space-x-1 text-black-700 dark:text-gray-300">
                    <span
                        className="font-bold text-lg tracking-light whitespace-nowrap"
                    >
                        Time Since...
                    </span>
                </p>
                <DarkModeToggle />
            </div>
        </header>
    )
}