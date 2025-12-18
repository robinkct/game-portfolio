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
        // Safe check for existence
        if (arr[i] && arr[i + 1] && arr[i].value === arr[i + 1].value) {
            // Merge
            const newValue = arr[i].value * 2;
            score += newValue;

            arr[i] = { id: generateId(), value: newValue, isMerged: true };
            arr[i + 1] = null; // Mark for removal

            // Skip next tile since it's merged
            // However, we just nullified it. The loop will increment i.
            // Next iteration: i becomes old (i+1). arr[i] is null.
            // If we blindly check arr[i].value, we crash.
            // BUT: We added `if (arr[i] && ...)` check at the top.
            // So if arr[i] is null, the check fails, loop continues.
            // This is safe. The issue before was likely lack of `arr[i] &&` check.
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

// Transpose: Rows become Columns
const transpose = (board) => {
    return board[0].map((_, c) => board.map(r => r[c]));
};

export const moveUp = (board) => {
    // Transpose so columns become rows
    // [Top, Bottom] becomes [Left, Right]
    // moveLeft will move items towards index 0 (Top)
    let transposed = transpose(board);
    const { board: movedBoard, score, hasChanged } = moveLeft(transposed);
    let newBoard = transpose(movedBoard);
    return { board: newBoard, score, hasChanged };
};

export const moveDown = (board) => {
    // Transpose so columns become rows
    // moveRight will move items towards index 3 (Bottom)
    let transposed = transpose(board);
    const { board: movedBoard, score, hasChanged } = moveRight(transposed);
    let newBoard = transpose(movedBoard);
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
