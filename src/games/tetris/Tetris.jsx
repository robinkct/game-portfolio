import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createStage, checkCollision } from './hooks';
import { useInterval, usePlayer, useStage, useGameStatus } from './hooks';
import { TETROMINOS } from './tetronimos';

// Styled Components
const Stage = ({ stage }) => (
    <div className="grid grid-cols-12 grid-rows-20 gap-[1px] border border-gaming-900 bg-gaming-900/50 backdrop-blur-sm w-full h-full aspect-[12/20]">
        {stage.map(row => row.map((cell, x) => <Cell key={x} type={cell[0]} />))}
    </div>
);

const Cell = ({ type }) => {
    const color = TETROMINOS[type] ? TETROMINOS[type].color : '0, 0, 0';
    const isFilled = type !== 0;

    return (
        <div
            className={`w-full h-full ${isFilled ? 'border-b-4 border-r-4 border-black/20' : ''}`}
            style={{
                backgroundColor: `rgba(${color}, ${isFilled ? 1 : 0.1})`,
                boxShadow: isFilled ? `0 0 10px rgba(${color}, 0.5)` : 'none'
            }}
        />
    );
};

const Display = ({ text, subtext }) => (
    <div className="bg-gaming-800/80 p-4 rounded-lg border border-gaming-500/30 w-full mb-4">
        <p className="text-gray-400 text-xs uppercase">{subtext}</p>
        <p className="text-xl font-bold text-white font-mono">{text}</p>
    </div>
);

const Tetris = () => {
    const [dropTime, setDropTime] = useState(null);
    const [gameOver, setGameOver] = useState(false);

    const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
    const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
    const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(rowsCleared);

    useEffect(() => {
        if (checkCollision(player, stage, { x: 0, y: 0 })) {
            setGameOver(true);
            setDropTime(null);
        }
    }, [player, stage]);

    const movePlayer = dir => {
        if (!checkCollision(player, stage, { x: dir, y: 0 })) {
            updatePlayerPos({ x: dir, y: 0 });
        }
    };

    const startGame = () => {
        // Reset everything
        setStage(createStage());
        setDropTime(1000);
        resetPlayer();
        setGameOver(false);
        setScore(0);
        setRows(0);
        setLevel(0);
    };

    const drop = () => {
        // Increase level when player has cleared 10 rows
        if (rows > (level + 1) * 10) {
            setLevel(prev => prev + 1);
            // Also increase speed
            setDropTime(1000 / (level + 1) + 200);
        }

        if (!checkCollision(player, stage, { x: 0, y: 1 })) {
            updatePlayerPos({ x: 0, y: 1, collided: false });
        } else {
            // Game Over
            if (player.pos.y < 1) {
                setGameOver(true);
                setDropTime(null);
            }
            updatePlayerPos({ x: 0, y: 0, collided: true });
        }
    };

    const keyUp = ({ keyCode }) => {
        if (!gameOver) {
            // Activate the interval again when user releases down arrow
            if (keyCode === 40) {
                setDropTime(1000 / (level + 1) + 200);
            }
        }
    };

    const dropPlayer = () => {
        setDropTime(null); // Stop interval when user presses down
        drop();
    };

    // Feature: Hard Drop
    const hardDrop = () => {
        let tempY = 0;
        // Keep checking collision while moving down until we hit something
        while (!checkCollision(player, stage, { x: 0, y: tempY + 1 })) {
            tempY += 1;
        }

        // Update position to the lowest point
        updatePlayerPos({ x: 0, y: tempY, collided: true });
        setDropTime(null);
    };

    const move = ({ keyCode }) => {
        if (!gameOver) {
            if (keyCode === 37) { // Left
                movePlayer(-1);
            } else if (keyCode === 39) { // Right
                movePlayer(1);
            } else if (keyCode === 40) { // Down
                dropPlayer();
            } else if (keyCode === 38) { // Up
                playerRotate(stage, 1);
            } else if (keyCode === 32) { // Space - Hard Drop
                // Prevent default scrolling behavior for space
                if (window.event) window.event.preventDefault();
                hardDrop();
            }
        }
    };

    useInterval(() => {
        drop();
    }, dropTime);

    // Touch Handling
    let touchStartX = 0;
    let touchStartY = 0;
    let lastTapTime = 0; // For double tap detection

    const handleTouchStart = (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
        if (!touchStartX || !touchStartY) return;

        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;

        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTapTime;

        // Check for double tap (Hard Drop)
        // If the movement is very small (it's a tap, not a swipe) AND time difference is small
        if (Math.abs(touchEndX - touchStartX) < 10 && Math.abs(touchEndY - touchStartY) < 10) {
            if (tapLength < 300 && tapLength > 0) {
                // Double tap detected
                if (window.event) window.event.preventDefault();
                hardDrop();
                lastTapTime = 0; // Reset
                return;
            } else {
                lastTapTime = currentTime;
            }
        }

        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal
            if (Math.abs(deltaX) > 30) {
                if (deltaX > 0) move({ keyCode: 39 }); // Right
                else move({ keyCode: 37 }); // Left
            }
        } else {
            // Vertical
            if (Math.abs(deltaY) > 30) {
                if (deltaY > 0) move({ keyCode: 40 }); // Down
                else move({ keyCode: 38 }); // Up (Rotate)
            }
            // Tap (Single tap could rotate too, but let's stick to swipe up for rotate to avoid conflict with double tap)
        }
    };

    return (
        <div
            className="h-[100dvh] w-full bg-gaming-dark flex flex-col lg:flex-row items-center justify-center p-2 lg:p-8 relative outline-none touch-none overflow-hidden"
            role="button"
            tabIndex="0"
            onKeyDown={e => move(e)}
            onKeyUp={keyUp}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            ref={div => div && div.focus()}
        >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/30 via-gaming-dark to-gaming-dark -z-10" />

            {/* Mobile Header: Back + Stats */}
            <div className="lg:hidden w-full max-w-[350px] flex justify-between items-center mb-1 z-10 shrink-0 h-[5vh]">
                <Link to="/" className="text-gray-400 text-sm">← Back</Link>
                <div className="flex gap-4 text-xs font-mono text-white">
                    <div className="bg-gaming-800 px-3 py-1 rounded border border-gaming-500/30">SCORE: {score}</div>
                    <div className="bg-gaming-800 px-3 py-1 rounded border border-gaming-500/30">LEVEL: {level}</div>
                </div>
            </div>

            {/* Main Content Area - Responsive Flex */}
            <div className="flex w-full max-w-5xl justify-center lg:justify-between items-start gap-8 flex-1 min-h-0 lg:h-auto overflow-hidden">
                {/* Desktop Sidebar Left */}
                <div className="hidden lg:flex flex-col gap-4">
                    <Link to="/" className="text-gray-400 hover:text-white transition-colors mb-8 text-lg font-bold">← BACK</Link>
                    <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-purple-800 opacity-50">
                        TETRIS
                    </div>
                </div>

                {/* Game Area Wrapper - Takes remaining space on mobile */}
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-center h-full w-full min-h-0">
                    {/* Stage - Flexible container with aspect ratio preservation */}
                    <div className="h-full w-auto aspect-[12/20] max-h-full lg:h-[70vh] shadow-2xl relative shrink-0 flex items-center justify-center">
                        <Stage stage={stage} />

                        {/* Mobile Game Over Overlay */}
                        {gameOver && (
                            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 backdrop-blur-sm lg:hidden rounded lg:rounded-none">
                                <p className="text-red-500 font-bold text-2xl mb-2">GAME OVER</p>
                                <p className="text-white mb-4">Score: {score}</p>
                                <button
                                    onClick={startGame}
                                    className="bg-white text-black px-6 py-2 rounded-full font-bold active:scale-95 transition-transform"
                                >
                                    Try Again
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Desktop Sidebar Right */}
                    <div className="hidden lg:flex flex-col w-full max-w-[200px]">
                        {gameOver ? (
                            <div className="bg-red-500/20 border border-red-500 p-4 rounded-lg mb-4 text-center">
                                <p className="text-red-500 font-bold text-xl">GAME OVER</p>
                                <p className="text-white">Score: {score}</p>
                            </div>
                        ) : (
                            <>
                                <Display text={score} subtext="Score" />
                                <Display text={rows} subtext="Rows" />
                                <Display text={level} subtext="Level" />
                            </>
                        )}

                        <button
                            onClick={startGame}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-4 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all mt-4 text-lg"
                        >
                            {gameOver ? 'Try Again' : 'Start'}
                        </button>

                        <div className="mt-8 text-sm text-gray-500">
                            <p className="mb-2">Controls:</p>
                            <ul className="space-y-1">
                                <li>↑ Rotate</li>
                                <li>← → Move</li>
                                <li>↓ Accelerate</li>
                                <li>Space Drop</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Bar: Start Button */}
            <div className="lg:hidden w-full max-w-[350px] py-3 z-10 shrink-0 flex items-center justify-center h-[auto]">
                <button
                    onClick={startGame}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 rounded-lg shadow-lg active:scale-95 transition-transform border border-white/10"
                >
                    {gameOver ? 'New Game' : 'Start Game'}
                </button>
            </div>
        </div>
    );
};

export default Tetris;
