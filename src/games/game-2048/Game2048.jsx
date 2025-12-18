import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

    // Flatten board to list of tiles with coordinates
    const tiles = [];
    board.forEach((row, r) => {
        row.forEach((tile, c) => {
            if (tile) {
                tiles.push({ ...tile, r, c });
            }
        });
    });

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
                    {/* Grid Background */}
                    <div className="grid grid-cols-4 gap-3 bg-gaming-800/30 p-3 rounded-lg relative h-[350px] sm:h-[400px]">
                        {/* Empty Cells for visual grid */}
                        {Array(16).fill(null).map((_, i) => (
                            <div key={i} className="bg-gaming-card rounded-md w-full h-full opacity-50" />
                        ))}

                        {/* Interactive Tiles Layer */}
                        <div className="absolute inset-0 p-3 pointer-events-none">
                            <AnimatePresence>
                                {tiles.map((tile) => (
                                    <motion.div
                                        key={tile.id}
                                        initial={tile.isNew ? { scale: 0 } : { scale: 1 }}
                                        animate={{
                                            scale: 1,
                                            // Calculate position based on percentage (100% / 4 rows/cols)
                                            // Gap calculation is tricky in absolute percentage.
                                            // Easier to use CSS Grid for layout, but wait...
                                            // If I use absolute position, I need to know exact pixel or % values including gaps.
                                            // Alternative: Use layout prop within the same grid?
                                            // If I use layout prop, I need to flatten the list and rely on FLIP.
                                            // BUT, with grid, empty cells mess up the order.
                                            // Absolute positioning is safer for 2048.

                                            // Let's assume uniform grid with gap.
                                            // Top = (Row Index * 25)%
                                            // Left = (Col Index * 25)%
                                            // But we have gaps.
                                            // Let's use calc.
                                            left: `calc(${tile.c * 25}% + ${tile.c * 0.75}rem)`, // 0.75rem is approximate gap-3
                                            top: `calc(${tile.r * 25}% + ${tile.r * 0.75}rem)`,
                                        }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        transition={{
                                            // The user explicitly requested 0.1s delay/duration for movement
                                            type: "tween",
                                            ease: "easeInOut", // easeInOut for smooth sliding
                                            duration: 0.1
                                        }}
                                        className={`absolute w-[calc(25%-0.56rem)] h-[calc(25%-0.56rem)] rounded-md flex items-center justify-center text-3xl font-bold ${getTileColor(tile.value)} z-10`}
                                        style={{
                                            // Fine tuning the size calculation to account for gaps
                                            // gap-3 = 0.75rem. Total gap space = 3 * 0.75rem = 2.25rem
                                            // Cell width = (100% - 2.25rem) / 4. 
                                            // For simplicity, let the calc in tailwind handle it or use style
                                        }}
                                    >
                                        {tile.value}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    {(gameOver || hasWon) && (
                        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center rounded-xl z-20 backdrop-blur-sm">
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
