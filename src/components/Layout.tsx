import Header from './Header'
import Footer from './Footer'

interface Props {
    children: React.ReactNode
}

const Layout: React.FunctionComponent<Props> = ( props ) => {
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-800">
            <Header />
                <main className="flex-grow container mx-auto ox-4 px-1 sm:px-4">
                    {props.children}
                </main>
            <Footer />
        </div>
    )
}

export default Layout