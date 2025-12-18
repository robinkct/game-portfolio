import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import GameCard from '../components/GameCard'
import { games } from '../data/games'

const Games = () => {
    return (
        <div className="min-h-screen bg-gaming-dark text-white font-sans selection:bg-gaming-500 selection:text-white">
            <header className="p-6 border-b border-gaming-900/50 backdrop-blur-md fixed w-full top-0 z-50 bg-gaming-dark/80">
                <div className="container mx-auto flex justify-between items-center">
                    <Link to="/" className="text-2xl font-black tracking-tighter bg-gradient-to-r from-gaming-500 to-purple-500 bg-clip-text text-transparent">
                        GAME<span className="text-white">PORTFOLIO</span>
                    </Link>
                    <nav>
                        <ul className="flex space-x-8 font-medium">
                            <li><Link to="/" className="text-gray-400 hover:text-gaming-500 transition-colors">Home</Link></li>
                            <li><Link to="/games" className="text-white hover:text-gaming-500 transition-colors">Games</Link></li>
                            <li><a href="https://github.com" target="_blank" className="text-gray-400 hover:text-white transition-colors">GitHub</a></li>
                        </ul>
                    </nav>
                </div>
            </header>

            <main className="pt-24 min-h-screen">
                <section className="py-12 container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-12 text-center"
                    >
                        <h1 className="text-5xl font-bold mb-4">All Games</h1>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Browsing our complete collection of classic web games.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {games.map((game, index) => (
                            <motion.div
                                key={game.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <GameCard {...game} />
                            </motion.div>
                        ))}
                    </div>
                </section>
            </main>

            <footer className="py-8 bg-gaming-card border-t border-gaming-900/50 mt-auto">
                <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
                    <p>© 2024 Game Portfolio. Built with React & Tailwind.</p>
                </div>
            </footer>
        </div>
    )
}

export default Games
