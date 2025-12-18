import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { use2048 } from './use2048';

const Game2048 = () => {
    const { board, score, move, initGame, gameOver, hasWon } = use2048();

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
                move(e.key);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [move]);

    const getTileColor = (value) => {
        const colors = {
            0: 'bg-gaming-card',
            2: 'bg-yellow-100 text-gray-800',
            4: 'bg-yellow-200 text-gray-800',
            8: 'bg-orange-300 text-white',
            16: 'bg-orange-400 text-white',
            32: 'bg-orange-500 text-white',
            64: 'bg-red-500 text-white',
            128: 'bg-red-600 text-white',
            256: 'bg-yellow-400 text-white shadow-[0_0_10px_rgba(250,204,21,0.5)]',
            512: 'bg-yellow-500 text-white shadow-[0_0_15px_rgba(234,179,8,0.5)]',
            1024: 'bg-yellow-600 text-white shadow-[0_0_20px_rgba(202,138,4,0.5)]',
            2048: 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-[0_0_30px_rgba(234,179,8,0.8)]',
        };
        return colors[value] || 'bg-gaming-900 text-white';
    };

    return (
        <div className="min-h-screen bg-gaming-dark flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-900/20 via-gaming-dark to-gaming-dark -z-10" />

            <div className="max-w-md w-full">
                <div className="flex justify-between items-center mb-6">
                    <Link to="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                        ← Back
                    </Link>
                    <div className="text-right">
                        <p className="text-gray-400 text-sm uppercase tracking-wider">Score</p>
                        <p className="text-4xl font-bold text-white">{score}</p>
                    </div>
                </div>

                <div className="bg-gaming-900/50 p-4 rounded-xl border border-gaming-900 backdrop-blur-sm relative">
                    <div className="grid grid-cols-4 gap-3 bg-gaming-800/30 p-3 rounded-lg">
                        {board.map((row, rIndex) => (
                            row.map((cell, cIndex) => (
                                <motion.div
                                    key={`${rIndex}-${cIndex}`}
                                    layout
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                    className={`w-full aspect-square rounded-md flex items-center justify-center text-3xl font-bold ${getTileColor(cell)}`}
                                >
                                    {cell !== 0 && cell}
                                </motion.div>
                            ))
                        ))}
                    </div>

                    {(gameOver || hasWon) && (
                        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center rounded-xl z-10 backdrop-blur-sm">
                            <h2 className={`text-5xl font-bold mb-4 ${hasWon ? 'text-yellow-400' : 'text-red-500'}`}>
                                {hasWon ? 'YOU WON!' : 'GAME OVER'}
                            </h2>
                            <button
                                onClick={initGame}
                                className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </div>

                <div className="mt-8 text-center text-gray-500">
                    <p>Use arrow keys to move tiles</p>
                </div>
            </div>
        </div>
    );
};

export default Game2048;
