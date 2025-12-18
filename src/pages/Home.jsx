import { motion } from 'framer-motion'
import GameCard from '../components/GameCard'

const Home = () => {
    const games = [
        {
            id: '2048',
            title: '2048',
            description: 'Join the numbers and get to the 2048 tile!',
            color: 'bg-yellow-500',
            link: '/games/2048'
        },
        {
            id: 'tetris',
            title: 'Tetris',
            description: 'The classic block-stacking puzzle game.',
            color: 'bg-purple-600',
            link: '/games/tetris'
        },
        {
            id: 'pikachu',
            title: 'Pikachu Volleyball',
            description: 'Legacy web version of the classic game.',
            color: 'bg-yellow-400',
            link: '/games/pikachu'
        }
    ]

    return (
        <div className="min-h-screen bg-gaming-dark text-white font-sans selection:bg-gaming-500 selection:text-white">
            <header className="p-6 border-b border-gaming-900/50 backdrop-blur-md fixed w-full top-0 z-50 bg-gaming-dark/80">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-gaming-500 to-purple-500 bg-clip-text text-transparent">
                        GAME<span className="text-white">PORTFOLIO</span>
                    </h1>
                    <nav>
                        <ul className="flex space-x-8 font-medium">
                            <li><a href="#" className="text-gray-400 hover:text-gaming-500 transition-colors">Home</a></li>
                            <li><a href="#games" className="text-gray-400 hover:text-gaming-500 transition-colors">Games</a></li>
                            <li><a href="https://github.com" target="_blank" className="text-gray-400 hover:text-white transition-colors">GitHub</a></li>
                        </ul>
                    </nav>
                </div>
            </header>

            <main className="pt-24">
                <section className="min-h-[70vh] flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gaming-900/40 via-gaming-dark to-gaming-dark z-0 pointer-events-none" />
                    <div className="container mx-auto px-4 z-10 text-center relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="text-7xl md:text-8xl font-black mb-6 tracking-tight">
                                PLAY. <span className="text-transparent bg-clip-text bg-gradient-to-r from-gaming-500 to-cyan-400">CREATE.</span>
                            </h2>
                            <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                                Experience the classics. Rebuilt for the modern web.
                            </p>
                            <button
                                onClick={() => document.getElementById('games').scrollIntoView({ behavior: 'smooth' })}
                                className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-gaming-500 px-8 font-medium text-white transition-all duration-300 hover:bg-gaming-600 hover:shadow-[0_0_20px_rgba(14,165,233,0.5)]"
                            >
                                <span className="mr-2">Start Playing</span>
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                        </motion.div>
                    </div>
                </section>

                <section id="games" className="py-24 container mx-auto px-4">
                    <div className="flex items-end justify-between mb-12 border-b border-gaming-900/50 pb-4">
                        <div>
                            <h3 className="text-4xl font-bold mb-2">Featured Games</h3>
                            <p className="text-gray-400">Select a game to start playing</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {games.map(game => (
                            <GameCard key={game.id} {...game} />
                        ))}
                    </div>
                </section>
            </main>

            <footer className="py-8 bg-gaming-card border-t border-gaming-900/50 mt-20">
                <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
                    <p>© 2024 Game Portfolio. Built with React & Tailwind.</p>
                </div>
            </footer>
        </div>
    )
}

export default Home
