const grid = document.querySelector('.grid');
const scoreCounter = document.querySelector('.score-counter');
const leftButton = document.querySelector('.left-button');
const rightButton = document.querySelector('.right-button');
const endGameScreen = document.querySelector('.end-game-screen');
const playAgainButton = document.querySelector('.play-again');
const finalScore = document.querySelector('.final-score');
const turboButton = document.querySelector('#turbo');


const gridMatrix = [
  ['', '', '', '', '', 'grass', ''],
  ['', 'cones', '', '', '', '', 'fence'],
  ['', '', 'rock', '', '', '', ''],
  ['fence', '', '', '', '', '', ''],
  ['', '', 'grass', '', '', 'water', ''],
  ['', '', '', '', 'cones', '', ''],
  ['', 'water', '', '', '', '', ''],
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', 'rock', ''],
];


let turbo = 1;
let score = 0;
let speed = 500;
let kartPosition = { y: 7, x: 3 };



function renderGrid() {
  
  grid.innerHTML = '';

 
  gridMatrix.forEach(function (rowCells) {
    
    rowCells.forEach(function (cellContent) {
      
      const cell = document.createElement('div');
      cell.className = 'cell';

      
      if (cellContent) cell.classList.add(cellContent);

      
      grid.appendChild(cell);
    });
  })
}


function renderElements() {
 
  placeKart();

  
  renderGrid();

  console.table(gridMatrix);
}



function placeKart() {
  
  const contentBeforeKart = gridMatrix[kartPosition.y][kartPosition.x];

  
  if (contentBeforeKart === 'coin') getBonusPoints();
  else if (contentBeforeKart) gameOver();

  
  gridMatrix[kartPosition.y][kartPosition.x] = 'kart';
}


function moveKart(direction) {

  gridMatrix[kartPosition.y][kartPosition.x] = '';


  switch (direction) {
    case 'left':
      if (kartPosition.x > 0) kartPosition.x--;
      break;
    case 'right':
      if (kartPosition.x < 6) kartPosition.x++;
      break;
    default:
      gridMatrix[kartPosition.y][kartPosition.x] = 'kart';
  }

  renderElements();
}

function scrollObstacles() {
  gridMatrix[kartPosition.y][kartPosition.x] = '';
  const isBonusPresent = checkBonusPresence();
  let lastRow = gridMatrix.pop()
  if (!isBonusPresent) lastRow = insertBonus(lastRow);

  lastRow = shuffleElements(lastRow);
  gridMatrix.unshift(lastRow);
  renderElements();
}

function shuffleElements(row) {
  for (let i = row.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [row[i], row[j]] = [row[j], row[i]];
  }

  return row;
}

function checkBonusPresence() {
  let bonusFound;
  gridMatrix.forEach(function (rowCells) {
    if (rowCells.includes('coin')) bonusFound = true;
  })
  return bonusFound;
}

function insertBonus(row) {
  const emptyIndex = row.indexOf('');
  row[emptyIndex] = 'coin';
  return row;
}

function getBonusPoints() {
  score += 30;
  scoreCounter.innerText = score;
  scoreCounter.classList.add('bonus');
  setTimeout(function () {
    scoreCounter.classList.remove('bonus')
  }, 1000);
}

function turboBoost() {

  if (turbo < 4) {
    turboButton.innerHTML = `<img src="images/gauge-${++turbo}.png">`;
    incrementSpeed();
  }
}

function incrementScore() {
  scoreCounter.innerText = ++score;
}


function incrementSpeed() {
  clearInterval(gameLoop);
  speed -= 100;
  gameLoop = setInterval(runGameFlow, speed);
}


function gameOver() {
  clearInterval(gameLoop);
  finalScore.innerText = score;
  endGameScreen.classList.remove('hidden');
  playAgainButton.focus();
}


function runGameFlow() {
  incrementScore();
  scrollObstacles();
}

turboButton.addEventListener('click', turboBoost);


playAgainButton.addEventListener('click', function () { location.reload() });


leftButton.addEventListener('click', function () { moveKart('left') });


rightButton.addEventListener('click', function () { moveKart('right') });


document.addEventListener('keyup', function (e) {
  switch (e.key) {
    case 'ArrowLeft':
      moveKart('left');
      break;
    case 'ArrowRight':
      moveKart('right');
      break;
    case ' ':
      turboBoost();
      break;
    default: return;
  }
})



let gameLoop = setInterval(runGameFlow, speed);