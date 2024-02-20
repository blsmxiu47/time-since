import DarkModeToggle from "./DarkModeToggle";

const Header: React.FC = () => {
    return (
        <header className="border-b dark:border-gray-300">
            <div className="container mx-auto px-4 sm:px-6 py-4">
                <div className="flex items-center justify-between text-black-700 dark:text-gray-300">
                    <a href="#" className="focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700">
                        <span
                            className="font-bold text-[1.5rem] tracking-wide whitespace-nowrap"
                        >
                            Time Since...
                        </span>
                    </a>
                    <DarkModeToggle />
                </div>
            </div>
        </header>
    )
}

export default Header;