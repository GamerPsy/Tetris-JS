document.addEventListener('DOMContentLoaded', () => {
const grid = document.querySelector('.grid');
const scoreDisplay = document.querySelector('#score');
const stratButton = document.querySelector('#start-button');
const longueurLigne = 10;
const colors = ['orange', 'red', 'purple', 'green', 'blue'];
let squares = Array.from(document.querySelectorAll('.grid div'));
let nextRandom = 0;
let score = 0;


//Les différentes formes de blocs
const lTetromino = [
    [1, longueurLigne + 1, longueurLigne * 2 + 1, 2],
    [longueurLigne, longueurLigne + 1, longueurLigne + 2, longueurLigne * 2 + 2],
    [1, longueurLigne + 1, longueurLigne * 2 + 1, longueurLigne * 2],
    [longueurLigne, longueurLigne * 2, longueurLigne * 2 + 1, longueurLigne * 2 + 2]
  ]

  const zTetromino = [
    [0, longueurLigne, longueurLigne + 1, longueurLigne * 2 + 1],
    [longueurLigne + 1, longueurLigne + 2, longueurLigne * 2, longueurLigne * 2 + 1],
    [0, longueurLigne, longueurLigne + 1, longueurLigne * 2 + 1],
    [longueurLigne + 1, longueurLigne + 2, longueurLigne * 2, longueurLigne * 2 + 1]
  ]

  const tTetromino = [
    [1, longueurLigne, longueurLigne + 1, longueurLigne + 2],
    [1, longueurLigne + 1, longueurLigne + 2, longueurLigne * 2 + 1],
    [longueurLigne, longueurLigne + 1, longueurLigne + 2, longueurLigne * 2 + 1],
    [1, longueurLigne, longueurLigne + 1, longueurLigne * 2 + 1]
  ]

  const oTetromino = [
    [0, 1, longueurLigne, longueurLigne + 1],
    [0, 1, longueurLigne, longueurLigne + 1],
    [0, 1, longueurLigne, longueurLigne + 1],
    [0, 1, longueurLigne, longueurLigne + 1]
  ]

  const iTetromino = [
    [1, longueurLigne + 1, longueurLigne * 2 + 1, longueurLigne * 3 + 1],
    [longueurLigne, longueurLigne + 1, longueurLigne + 2, longueurLigne + 3],
    [1, longueurLigne + 1, longueurLigne * 2 + 1, longueurLigne * 3 + 1],
    [longueurLigne, longueurLigne + 1, longueurLigne + 2, longueurLigne + 3]
  ]

const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

let random = Math.floor(Math.random()*theTetrominoes.length);
let currentBlockPosition = 4;
let currentBlockRotation = 0;
let currentBlock = theTetrominoes[random][currentBlockRotation];


function draw() {
    currentBlock.forEach(index => {
        squares[currentBlockPosition + index].classList.add('tetromino');
        squares[currentBlockPosition + index].style.backgroundColor = colors[random];
    })
}

function undraw() {
    currentBlock.forEach(index => {
        squares[currentBlockPosition + index].classList.remove('tetromino');
        squares[currentBlockPosition + index].style.backgroundColor = '';
    })
}


//les inputs
function control(e) {
    switch (e.keyCode){
        case 37:
            moveLeft();
            break;
        case 38:
            rotate();
            break;
        case 39:
            moveRight();
            break;
        case 40:
            moveDown();
            break;
    }
    
}
document.addEventListener('keyup', control);


function moveDown() {
    undraw();
    currentBlockPosition += longueurLigne;
    draw();
    gameLoop();
}

function moveLeft() {
    undraw();
    const isALeftEdge = currentBlock.some(index => (currentBlockPosition + index) % longueurLigne === 0);

    if(!isALeftEdge) currentBlockPosition -= 1;

    if(currentBlock.some(index => squares[currentBlockPosition + index].classList.contains('taken'))) {
        currentBlockPosition += 1;
    }
    draw();
}

function moveRight() {
    undraw();
    const isARigthEdge = currentBlock.some(index => (currentBlockPosition + index) % longueurLigne === longueurLigne -1);
    if(!isARigthEdge) currentBlockPosition += 1;
    if(currentBlock.some(index => squares[currentBlockPosition + index].classList.contains('taken'))) {
        currentBlockPosition -= 1;
    }
    draw();
}

function rotate() {
    undraw();
    currentBlockRotation++;
    if(currentBlockRotation === currentBlock.length) {
        currentBlockRotation = 0;
    }
    currentBlock = theTetrominoes[random][currentBlockRotation];
    draw();
}

//prochain block
const displaySquares = document.querySelectorAll('.mini-grid div');
const displayWidth = 4;
let displayIndex = 0;

const nextTetromino = [
    [1, 2, displayWidth + 1, displayWidth * 2 + 1], // L
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], // Z
    [1, displayWidth, displayWidth + 1, displayWidth + 2], // T
    [0, 1, displayWidth, displayWidth + 1], // O
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] // I
]
 
function displayShape() {
    displaySquares.forEach(square => {
        square.classList.remove('tetromino');
        square.style.backgroundColor = '';
    });
    nextTetromino[nextRandom].forEach(index => {
        displaySquares[displayIndex + index].classList.add('tetromino');
        displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
    });
}
let timerId = setInterval(moveDown, 1000);
//Le bouton start - pause
stratButton.addEventListener('click', () => {
   
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
    }
    else {
        draw();
        timerId = setInterval(moveDown, 1000);
        nextRandom = Math.floor(Math.random()* theTetrominoes.lenght);
        displayShape();
    }
})

// SCORE
function addScore() {
    for (let i = 0; i < 199; i+= longueurLigne) {
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];

        if (row.every(index => squares[index].classList.contains('taken'))) {
            score += 10;
            scoreDisplay.innerHTML = score;
            row.forEach(index => {
                squares[index].classList.remove('taken');
                squares[index].classList.remove('tetromino');
                squares[index].style.backgroundColor = '';
            })
            const rowRemoved = squares.splice(i, longueurLigne);
            squares = rowRemoved.concat(squares);
            squares.forEach(cell => grid.appendChild(cell))
        }
    }
}

// GAME OVER
function gameOver() {
    if(currentBlock.some(index => squares[currentBlockPosition+index].classList.contains('taken'))) {
        scoreDisplay.innerHTML = 'end';
        clearInterval(timerId);
    }
}    

//GAME LOOP
function gameLoop() {
    if (currentBlock.some(index => squares[currentBlockPosition + index + longueurLigne].classList.contains('taken'))) {
        currentBlock.forEach(index => squares[currentBlockPosition + index].classList.add('taken'));
        
        //start a new tetromino fall
        random = nextRandom;
        nextRandom = Math.floor(Math.random() * theTetrominoes.length);
        currentBlock = theTetrominoes[random][currentBlockRotation];
        currentBlockPosition = 4;
        draw();
        displayShape();
        addScore();
        gameOver();
        }
    }

})
