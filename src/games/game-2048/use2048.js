import { useState, useCallback, useEffect } from 'react';
import * as Logic from './logic';

export const use2048 = () => {
    const [board, setBoard] = useState(Logic.generateBoard());
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [hasWon, setHasWon] = useState(false);

    const initGame = useCallback(() => {
        let newBoard = Logic.generateBoard();
        newBoard = Logic.placeRandomTile(newBoard);
        newBoard = Logic.placeRandomTile(newBoard);
        setBoard(newBoard);
        setScore(0);
        setGameOver(false);
        setHasWon(false);
    }, []);

    useEffect(() => {
        initGame();
    }, [initGame]);

    const move = useCallback((direction) => {
        if (gameOver) return;

        let result;
        switch (direction) {
            case 'ArrowLeft': result = Logic.moveLeft(board); break;
            case 'ArrowRight': result = Logic.moveRight(board); break;
            case 'ArrowUp': result = Logic.moveUp(board); break;
            case 'ArrowDown': result = Logic.moveDown(board); break;
            default: return;
        }

        if (result.hasChanged) {
            let newBoard = result.board;
            newBoard = Logic.placeRandomTile(newBoard);
            setBoard(newBoard);
            setScore(prev => prev + result.score);

            if (Logic.checkGameOver(newBoard)) {
                setGameOver(true);
            }

            // Optional: Check win (2048 tile)
            // if (newBoard.flat().some(tile => tile && tile.value === 2048)) setHasWon(true);
        }
    }, [board, gameOver]);

    return { board, score, move, initGame, gameOver, hasWon };
};
