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
        if (gameOver) return;

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

                // If there was a pending move, execute it immediately
                if (pendingMoveRef.current) {
                    const nextMove = pendingMoveRef.current;
                    pendingMoveRef.current = null;
                    // Recursive call safe because it's in setTimeout (new stack)
                    executeMove(nextMove);
                }
            }, 100);

            // Optional: Check win (2048 tile)
            // if (newBoard.flat().some(tile => tile && tile.value === 2048)) setHasWon(true);
        } else {
            // If move didn't change anything, we don't lock input. 
            // But if we had a pending move (unlikely if we just arrived here directly), we should clear it?
            // Actually if I press Left (No change), then Right (Change).
            // Left shouldn't lock. Right should lock.
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
