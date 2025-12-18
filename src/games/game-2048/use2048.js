import { useState, useCallback, useEffect, useRef } from 'react';
import * as Logic from './logic';

export const use2048 = () => {
    // We keep state for rendering
    const [board, setBoard] = useState(Logic.generateBoard());
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [hasWon, setHasWon] = useState(false);

    // We keep a ref for the *latest* board state to avoid stale closures in event handlers
    const boardRef = useRef(board);

    // Throttle ref to prevent moving faster than animation
    const isMovingRef = useRef(false);

    // Buffer for the next move if pressed during animation
    const pendingMoveRef = useRef(null);

    // Sync ref when state changes
    useEffect(() => {
        boardRef.current = board;
    }, [board]);

    const initGame = useCallback(() => {
        let newBoard = Logic.generateBoard();
        newBoard = Logic.placeRandomTile(newBoard);
        newBoard = Logic.placeRandomTile(newBoard);
        setBoard(newBoard);
        setScore(0);
        setGameOver(false);
        setHasWon(false);
        isMovingRef.current = false;
        pendingMoveRef.current = null;
    }, []);

    useEffect(() => {
        initGame();
    }, [initGame]);

    const executeMove = useCallback((direction) => {
        if (gameOver) {
            console.log('Game Over, ignoring move');
            return;
        }

        const currentBoard = boardRef.current;
        console.log(`Attempting move: ${direction}`);

        let result;

        try {
            switch (direction) {
                case 'ArrowLeft': result = Logic.moveLeft(currentBoard); break;
                case 'ArrowRight': result = Logic.moveRight(currentBoard); break;
                case 'ArrowUp': result = Logic.moveUp(currentBoard); break;
                case 'ArrowDown': result = Logic.moveDown(currentBoard); break;
                default: return;
            }
        } catch (e) {
            console.error("Move calculation failed", e);
            return;
        }

        console.log(`Move result: changed=${result.hasChanged}, score=${result.score}`);

        if (result.hasChanged) {
            isMovingRef.current = true;
            let newBoard = result.board;
            newBoard = Logic.placeRandomTile(newBoard);

            setBoard(newBoard);
            setScore(prev => prev + result.score);

            if (Logic.checkGameOver(newBoard)) {
                console.log("Game Over detected!");
                setGameOver(true);
            }

            // Unlock input after animation duration (100ms)
            setTimeout(() => {
                isMovingRef.current = false;

                // If there was a pending move, execute it immediately
                if (pendingMoveRef.current) {
                    const nextMove = pendingMoveRef.current;
                    console.log(`Executing buffered move: ${nextMove}`);
                    pendingMoveRef.current = null;
                    // Recursive call safe because it's in setTimeout (new stack)
                    executeMove(nextMove);
                }
            }, 100);
        } else {
            console.log("Move resulted in no change.");
        }
    }, [gameOver]);

    // Public move handler that decides whether to execute or buffer
    const move = useCallback((direction) => {
        if (gameOver) return;

        if (isMovingRef.current) {
            // Buffer the input
            pendingMoveRef.current = direction;
            return;
        }

        executeMove(direction);
    }, [gameOver, executeMove]);

    return { board, score, move, initGame, gameOver, hasWon };
};
