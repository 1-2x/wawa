// script.js
let board;
let game = new Chess();

function onDragStart(source, piece, position, orientation) {
    if (game.game_over() || (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
        return false;
    }
}

function onDrop(source, target) {
    let move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    });

    if (move === null) return 'snapback';
    updateStatus();
    setTimeout(makeAIMove, 250);
}

function onSnapEnd() {
    board.position(game.fen());
}

function updateStatus() {
    let status = '';
    let moveColor = game.turn() === 'w' ? 'White' : 'Black';

    if (game.game_over()) {
        if (game.in_checkmate()) {
            status = 'Game over, ' + moveColor + ' is in checkmate.';
        } else if (game.in_draw()) {
            status = 'Game over, drawn position';
        }
    } else {
        status = moveColor + ' to move';
        if (game.in_check()) {
            status += ', ' + moveColor + ' is in check';
        }
    }
    $('#status').text(status);
}

// Simple Minimax AI
function evaluateBoard() {
    const pieceValues = {
        'p': 100, 'n': 320, 'b': 330, 'r': 500, 'q': 900, 'k': 20000
    };
    
    let score = 0;
    let board = game.board();
    
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let piece = board[i][j];
            if (piece) {
                let value = pieceValues[piece.type];
                score += piece.color === 'w' ? value : -value;
            }
        }
    }
    return score;
}

function minimax(depth, isMaximizing) {
    if (depth === 0 || game.game_over()) {
        return evaluateBoard();
    }

    let possibleMoves = game.moves();
    if (isMaximizing) {
        let maxEval = -Infinity;
        for (let move of possibleMoves) {
            game.move(move);
            let eval = minimax(depth - 1, false);
            game.undo();
            maxEval = Math.max(maxEval, eval);
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (let move of possibleMoves) {
            game.move(move);
            let eval = minimax(depth - 1, true);
            game.undo();
            minEval = Math.min(minEval, eval);
        }
        return minEval;
    }
}

function findBestMove() {
    let possibleMoves = game.moves();
    let bestMove = null;
    let bestValue = Infinity;
    const depth = 2; // Adjust depth for performance vs strength

    for (let move of possibleMoves) {
        game.move(move);
        let value = minimax(depth - 1, true);
        game.undo();
        
        if (value < bestValue) {
            bestValue = value;
            bestMove = move;
        }
    }
    return bestMove;
}

function makeAIMove() {
    let bestMove = findBestMove();
    if (bestMove) {
        game.move(bestMove);
        board.position(game.fen());
        updateStatus();
    }
}

function resetGame() {
    game = new Chess();
    board.position(game.fen());
    updateStatus();
}

let config = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
};

board = Chessboard('board', config);
updateStatus();
