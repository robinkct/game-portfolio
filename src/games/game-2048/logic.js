// 2048 Game Logic

export const generateBoard = () => {
    return Array(4).fill().map(() => Array(4).fill(0));
};

export const getRandomTile = (board) => {
    let emptyCells = [];
    board.forEach((row, r) => {
        row.forEach((cell, c) => {
            if (cell === 0) emptyCells.push({ r, c });
        });
    });

    if (emptyCells.length === 0) return null;

    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    return { ...randomCell, value: Math.random() < 0.9 ? 2 : 4 };
};

export const placeRandomTile = (board) => {
    const newBoard = board.map(row => [...row]);
    const tile = getRandomTile(newBoard);
    if (tile) {
        newBoard[tile.r][tile.c] = tile.value;
    }
    return newBoard;
};

const filterZero = (row) => row.filter(num => num !== 0);

const slideRow = (row) => {
    let arr = filterZero(row);
    let score = 0;

    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] === arr[i + 1]) {
            arr[i] *= 2;
            score += arr[i];
            arr[i + 1] = 0;
        }
    }

    arr = filterZero(arr);
    while (arr.length < 4) {
        arr.push(0);
    }
    return { newRow: arr, score };
};

export const moveLeft = (board) => {
    let newBoard = [];
    let totalScore = 0;
    let hasChanged = false;

    board.forEach(row => {
        const { newRow, score } = slideRow(row);
        newBoard.push(newRow);
        totalScore += score;
        if (JSON.stringify(row) !== JSON.stringify(newRow)) hasChanged = true;
    });

    return { board: newBoard, score: totalScore, hasChanged };
};

export const moveRight = (board) => {
    let newBoard = [];
    let totalScore = 0;
    let hasChanged = false;

    board.forEach(row => {
        let reversed = [...row].reverse();
        const { newRow, score } = slideRow(reversed);
        let finalRow = newRow.reverse();
        newBoard.push(finalRow);
        totalScore += score;
        if (JSON.stringify(row) !== JSON.stringify(finalRow)) hasChanged = true;
    });

    return { board: newBoard, score: totalScore, hasChanged };
};

const rotateLeft = (board) => {
    return board[0].map((val, index) => board.map(row => row[index])).reverse();
};

const rotateRight = (board) => {
    return board[0].map((val, index) => board.map(row => row[index]).reverse());
};

export const moveUp = (board) => {
    // Rotate left (counter-clockwise) to make columns rows
    let rotated = rotateLeft(board);
    const { board: movedBoard, score, hasChanged } = moveLeft(rotated);
    // Rotate right (clockwise) to restore
    let newBoard = rotateRight(movedBoard);
    return { board: newBoard, score, hasChanged };
};

export const moveDown = (board) => {
    // Rotate right to make columns rows
    let rotated = rotateRight(board);
    const { board: movedBoard, score, hasChanged } = moveLeft(rotated);
    // Rotate left to restore
    let newBoard = rotateLeft(movedBoard);
    return { board: newBoard, score, hasChanged };
};

export const checkGameOver = (board) => {
    // Check for empty cells
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (board[r][c] === 0) return false;
        }
    }
    // Check for possible merges
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (c < 3 && board[r][c] === board[r][c + 1]) return false;
            if (r < 3 && board[r][c] === board[r + 1][c]) return false;
        }
    }
    return true;
};
