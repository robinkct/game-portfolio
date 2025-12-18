import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const GameCard = ({ title, description, color, image, link }) => {
    return (
        <Link to={link}>
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gaming-card rounded-xl overflow-hidden shadow-lg border border-gaming-900/50 group cursor-pointer h-full flex flex-col"
            >
                <div className={`h-48 w-full ${color} flex items-center justify-center relative overflow-hidden`}>
                    {image ? (
                        <>
                            <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300" />
                        </>
                    ) : (
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-300" />
                    )}
                    <h4 className="text-3xl font-bold text-white drop-shadow-lg z-10 relative">{title}</h4>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold mb-2 text-gaming-100">{title}</h3>
                    <p className="text-gray-400 text-sm mb-4 flex-1">{description}</p>
                    <button className="w-full bg-gaming-900 hover:bg-gaming-500 text-white py-2 rounded-lg font-medium transition-colors border border-gaming-500/30">
                        Play Now
                    </button>
                </div>
            </motion.div>
        </Link>
    )
}

export default GameCard
