// 2048 Game Logic

// Helper to generate unique IDs
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

export const generateBoard = () => {
    return Array(4).fill().map(() => Array(4).fill(null));
};

export const getRandomTile = (board) => {
    let emptyCells = [];
    board.forEach((row, r) => {
        row.forEach((cell, c) => {
            if (cell === null) emptyCells.push({ r, c });
        });
    });

    if (emptyCells.length === 0) return null;

    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    return {
        ...randomCell,
        tile: {
            id: generateId(),
            value: Math.random() < 0.9 ? 2 : 4,
            isNew: true // Flag for enter animation
        }
    };
};

export const placeRandomTile = (board) => {
    // Deep clone the board of objects
    const newBoard = board.map(row => row.map(cell => cell ? { ...cell, isNew: false, isMerged: false } : null));

    const tileData = getRandomTile(newBoard);
    if (tileData) {
        newBoard[tileData.r][tileData.c] = tileData.tile;
    }
    return newBoard;
};

// Remove nulls
const filterEmpty = (row) => row.filter(tile => tile !== null);

const slideRow = (row) => {
    // Reset merge flags for existing tiles before processing
    let arr = filterEmpty(row).map(t => ({ ...t, isNew: false, isMerged: false }));
    let score = 0;

    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i].value === arr[i + 1].value) {
            // Merge
            // We create a new tile representing the merged result
            // Usually we might want to keep one ID to look like it morphs, 
            // but creating a new ID forces a re-render of that specific tile which can be used for a "Pop" effect.
            // However, to animate moving *into* the merge, we might want to preserve one?
            // Simpler: New ID for the merged result. 
            // Better UX: The two old tiles should move to the same spot, then vanish.
            // But that requires tracking "previous positions".
            // Let's stick to standard ID swap for now.

            const newValue = arr[i].value * 2;
            score += newValue;

            arr[i] = { id: generateId(), value: newValue, isMerged: true };
            arr[i + 1] = null; // Mark for removal

            // Note: In this simple implementation, the second tile just disappears effectively.
            // A more advanced implementations tracks "mergedFrom" array of IDs.
            // But for "movement animation" requested by user configuration, just ensuring distinct IDs is step 1.
        }
    }

    // Filter out the nulls created during merge
    arr = filterEmpty(arr);

    // Pad with nulls
    while (arr.length < 4) {
        arr.push(null);
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

        // Check difference by comparing IDs and values
        // If the arrangement of IDs/Values is different, it changed.
        const rowIds = row.map(c => c ? c.id : null).join(',');
        const newRowIds = newRow.map(c => c ? c.id : null).join(',');
        if (rowIds !== newRowIds) hasChanged = true;
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

        const rowIds = row.map(c => c ? c.id : null).join(',');
        const finalRowIds = finalRow.map(c => c ? c.id : null).join(',');
        if (rowIds !== finalRowIds) hasChanged = true;
    });

    return { board: newBoard, score: totalScore, hasChanged };
};

const rotateLeft = (board) => {
    const rows = board.length;
    const cols = board[0].length;
    let newBoard = Array(cols).fill().map(() => Array(rows).fill(null));
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            newBoard[c][rows - 1 - r] = board[r][c];
        }
    }
    return newBoard;
};

const rotateRight = (board) => {
    const rows = board.length;
    const cols = board[0].length;
    let newBoard = Array(cols).fill().map(() => Array(rows).fill(null));
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            newBoard[c][r] = board[rows - 1 - c][c];
        }
    }
    return newBoard;
};

export const moveUp = (board) => {
    // Rotate counter-clockwise (Left)
    // [0,0] -> [3,0] ? No.
    // simpler helpers
    // rotateLeft: cols become rows, reading from right to left?
    // Let's use the explicit helpers I wrote above to be sure.
    let rotated = rotateLeft(board);
    const { board: movedBoard, score, hasChanged } = moveLeft(rotated);
    let newBoard = rotateRight(movedBoard);
    return { board: newBoard, score, hasChanged };
};

export const moveDown = (board) => {
    let rotated = rotateRight(board);
    const { board: movedBoard, score, hasChanged } = moveLeft(rotated);
    let newBoard = rotateLeft(movedBoard);
    return { board: newBoard, score, hasChanged };
};

export const checkGameOver = (board) => {
    // Check for empty cells
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (board[r][c] === null) return false;
        }
    }
    // Check for possible merges
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (c < 3 && board[r][c].value === board[r][c + 1].value) return false;
            if (r < 3 && board[r][c].value === board[r + 1][c].value) return false;
        }
    }
    return true;
};
