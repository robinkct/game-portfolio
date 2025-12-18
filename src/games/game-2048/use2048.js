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
    }, []);

    useEffect(() => {
        initGame();
    }, [initGame]);

    const move = useCallback((direction) => {
        if (gameOver) return;
        if (isMovingRef.current) return;

        const currentBoard = boardRef.current;
        let result;

        switch (direction) {
            case 'ArrowLeft': result = Logic.moveLeft(currentBoard); break;
            case 'ArrowRight': result = Logic.moveRight(currentBoard); break;
            case 'ArrowUp': result = Logic.moveUp(currentBoard); break;
            case 'ArrowDown': result = Logic.moveDown(currentBoard); break;
            default: return;
        }

        if (result.hasChanged) {
            isMovingRef.current = true;
            let newBoard = result.board;
            newBoard = Logic.placeRandomTile(newBoard);

            setBoard(newBoard);
            setScore(prev => prev + result.score);

            if (Logic.checkGameOver(newBoard)) {
                setGameOver(true);
            }

            // Unlock input after animation duration (100ms)
            setTimeout(() => {
                isMovingRef.current = false;
            }, 100);

            // Optional: Check win (2048 tile)
            // if (newBoard.flat().some(tile => tile && tile.value === 2048)) setHasWon(true);
        }
    }, [gameOver]); // Removed 'board' dependency to prevent re-binding

    return { board, score, move, initGame, gameOver, hasWon };
};
