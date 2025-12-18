import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createStage, checkCollision } from './hooks';
import { useInterval, usePlayer, useStage, useGameStatus } from './hooks';
import { TETROMINOS } from './tetronimos';

// Styled Components
const Stage = ({ stage }) => (
    <div className="grid grid-cols-12 grid-rows-20 gap-[1px] border border-gaming-900 bg-gaming-900/50 backdrop-blur-sm w-full h-[60vh] md:h-[70vh] aspect-[12/20]">
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

    return (
        <div
            className="min-h-screen bg-gaming-dark flex flex-col items-center justify-center p-4 relative outline-none"
            role="button"
            tabIndex="0"
            onKeyDown={e => move(e)}
            onKeyUp={keyUp}
            ref={div => div && div.focus()}
        >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/30 via-gaming-dark to-gaming-dark -z-10" />

            <div className="flex w-full max-w-5xl justify-between items-start gap-8 h-full">
                <div className="hidden lg:flex flex-col gap-4">
                    <Link to="/" className="text-gray-400 hover:text-white transition-colors mb-8 text-lg font-bold">← BACK</Link>
                    <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-purple-800 opacity-50">
                        TETRIS
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start justify-center flex-1">
                    <Stage stage={stage} />

                    <div className="flex flex-col w-full max-w-[200px]">
                        {/* Mobile Back Button */}
                        <Link to="/" className="lg:hidden text-gray-400 hover:text-white mb-4">← Back</Link>

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

                        <div className="mt-8 text-sm text-gray-500 hidden md:block">
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
        </div>
    );
};

export default Tetris;
