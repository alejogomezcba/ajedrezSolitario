const initialPositions = {
    'a1': '♔', 'b1': '♖', 'c1': '♕',
    'a2': '♙', 'b2': '♗', 'c2': '♗',
    'a3': '♙', 'b3': '♙'
};
let board = document.getElementById('board');
let message = document.getElementById('message');
let moveCounter = document.getElementById('moves');
let moves = 0;

function createBoard() {
    board.innerHTML = '';
    for (let row = 3; row >= 1; row--) {
        for (let col of ['a', 'b', 'c']) {
            let cell = document.createElement('div');
            cell.className = 'cell';
            cell.id = col + row;
            if (initialPositions[cell.id]) {
                let piece = document.createElement('div');
                piece.className = 'piece';
                piece.textContent = initialPositions[cell.id];
                piece.draggable = !['♙'].includes(initialPositions[cell.id]);
                piece.ondragstart = dragStart;
                cell.appendChild(piece);
            }
            cell.ondragover = allowDrop;
            cell.ondrop = drop;
            board.appendChild(cell);
        }
    }
}

function allowDrop(event) {
    event.preventDefault();
}

function dragStart(event) {
    event.dataTransfer.setData("text", event.target.parentElement.id);
}

function drop(event) {
event.preventDefault();
let fromId = event.dataTransfer.getData("text");
let toId = event.target.id || event.target.parentElement.id;
let piece = document.getElementById(fromId).querySelector('.piece');

if (isValidMove(piece.textContent, fromId, toId)) {
document.getElementById(toId).appendChild(piece);
moves++;
moveCounter.textContent = moves;

// Verificar si el jugador ha ganado
if (toId === 'c3' && piece.textContent === '♔') {
    showMessage('¡Felicidades! Has ganado en ' + moves + ' movimientos.', true); // Mostrar éxito
    setTimeout(resetGame, 1500); // Reiniciar después de un tiempo
}
} else {
showMessage("Movimiento incorrecto", false); // Mostrar error
setTimeout(() => document.getElementById(fromId).appendChild(piece), 500);
}
}

function isValidMove(piece, from, to) {
// Verifica si el rey intenta moverse a 'b2'
if (piece === '♔' && to === 'b2') return false;

if (document.getElementById(to).children.length) return false;  // Asegura que la casilla de destino esté vacía
let [fx, fy] = [from.charCodeAt(0), parseInt(from[1])];
let [tx, ty] = [to.charCodeAt(0), parseInt(to[1])];

// Si la pieza es un peón, no permitimos ningún movimiento
if (piece === '♙') {
return false;
}

// Reglas de movimiento de las demás piezas (rey, torre, reina, alfil, caballo)
const moves = {
'♔': [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]], // Rey
'♖': [[1, 0], [-1, 0], [0, 1], [0, -1]], // Torre
'♕': [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]], // Reina
'♗': [[1, 1], [-1, -1], [1, -1], [-1, 1]], // Alfil
'♘': [[2, 1], [-2, 1], [2, -1], [-2, -1], [1, 2], [-1, 2], [1, -2], [-1, -2]] // Caballo (en movimiento en "L")
};

// Verificar si el movimiento es en línea recta (torre, reina) o diagonal (alfil, reina)
function isPathClear(dx, dy, fx, fy, tx, ty) {
let stepX = dx === 0 ? 0 : dx > 0 ? 1 : -1;
let stepY = dy === 0 ? 0 : dy > 0 ? 1 : -1;
let x = fx + stepX;
let y = fy + stepY;
while (x !== tx || y !== ty) {
    if (document.getElementById(String.fromCharCode(x) + y).children.length > 0) {
        return false; // Si hay una pieza en el camino, no es válido
    }
    x += stepX;
    y += stepY;
}
return true;
}

// Verificar movimientos de cada pieza
if (piece === '♖' || piece === '♕') { // Torre o Reina (vertical u horizontal)
return moves[piece].some(([dx, dy]) => {
    if (fx + dx === tx && fy + dy === ty) {
        return isPathClear(dx, dy, fx, fy, tx, ty); // Verifica que el camino esté libre
    }
    return false;
});
} else if (piece === '♗' || piece === '♕') { // Alfil o Reina (diagonal)
return moves[piece].some(([dx, dy]) => {
    if (fx + dx === tx && fy + dy === ty) {
        return isPathClear(dx, dy, fx, fy, tx, ty); // Verifica que el camino esté libre
    }
    return false;
});
}

// Movimiento del Rey y Caballo no necesitan revisar el camino, ya que se mueven solo 1 casilla o en "L"
return moves[piece].some(([dx, dy]) => fx + dx === tx && fy + dy === ty);
}


function showMessage(msg, isSuccess) {
    message.textContent = msg;
    message.style.color = isSuccess ? 'green' : 'red'; // Cambiar color según el tipo de mensaje
    setTimeout(() => message.textContent = '', 1500); // Limpiar el mensaje después de 1.5 segundos
}

function resetGame() {
    moves = 0;
    moveCounter.textContent = moves;
    createBoard();
}

createBoard();