const gameArea = document.getElementById('gameArea');
const gameAreaCtx = gameArea.getContext('2d');

const scoreBoard = document.getElementById('score');
const highScoreBoard = document.getElementById('highscore')
const button = document.getElementById('restart');

let delay = 0;

let score = 0;

let spawmAreaY;
let spawmAreaX;

let xDirection = -20;
let yDirection = 0;

var eatAudio = new Audio('media/appleCrunch.mp3');
var gameEndedAudio = new Audio('media/gameEnded.mp3');
var restartAudio = new Audio('media/restart.mp3');

localStorage.setItem('highscore', 0);

let snake = [
    { x: 200, y: 200 },
    { x: 220, y: 200 },
    { x: 240, y: 200 },
    { x: 260, y: 200 },
    { x: 280, y: 200 }
];

var snakeColor = 'white';
var foodColor = 'red';
var gameAreaColor = '#2631B3';

document.addEventListener("keydown", changeDirection);
document.getElementById('restart').addEventListener('click', restart);
document.addEventListener('keydown', function(e) {
    if(e.key === 'r') {
        restart();
    }
})  

genFood();
main();


function main() {

    if(isGameOver()) return;
    delay = setTimeout(function animate() {
        clearCanvas();
        moveSnake();
        drawFood();
        drawSnake();
        // Call main again
        main();
    }, 100);
};

function makeSnake(snakePart) {
    gameAreaCtx.fillStyle = snakeColor;
    gameAreaCtx.stokeStyle = snakeColor;
    gameAreaCtx.strokeRect(snakePart.x, snakePart.y, 20, 20);
    gameAreaCtx.fillRect(snakePart.x, snakePart.y, 20, 20);
};

function drawSnake() {
    snake.forEach(p => {
        makeSnake(p);
    });
};

function clearCanvas() {
    gameAreaCtx.fillStyle = gameAreaColor;
    gameAreaCtx.stokeStyle = gameAreaColor;
    gameAreaCtx.strokeRect(0, 0, gameArea.width, gameArea.height);
    gameAreaCtx.fillRect(0, 0, gameArea.width, gameArea.height);
};

function random_food(min, max) {
    return Math.round((Math.random() * (max-min) + min) / 20) * 20;
};

function genFood() {
    spawmAreaX = random_food(0, gameArea.width - 20)
    spawmAreaY = random_food(0, gameArea.height - 20);
};

function drawFood() {
    gameAreaCtx.fillStyle = foodColor;
    gameAreaCtx.stokeStyle = foodColor;
    gameAreaCtx.strokeRect(spawmAreaX, spawmAreaY, 20, 20);
    gameAreaCtx.fillRect(spawmAreaX, spawmAreaY, 20, 20);

    snake.forEach(part => {
        const hasTouched = part.x == spawmAreaX && part.y == spawmAreaY;
        if(hasTouched) genFood();
    })
};

function changeDirection(e) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const action = e.keyCode;
    const movingRight = xDirection === 20;
    const movingLeft = xDirection === -20;
    const movingDown = yDirection === 20;
    const movingUp = yDirection === -20;

    if(action == RIGHT_KEY && !movingLeft) {
        xDirection = 20;
        yDirection = 0;
    } else if(action == LEFT_KEY && !movingRight) {
        xDirection = -20;
        yDirection = 0;
    } else if(action == UP_KEY && !movingDown) {
        xDirection = 0;
        yDirection = -20;
    } else if(action == DOWN_KEY && !movingUp) {
        xDirection = 0;
        yDirection = 20;
    }
};

function moveSnake() {
    const head = {x: snake[0].x + xDirection, y: snake[0].y + yDirection};
    snake.unshift(head);
    if(snake[0].x == spawmAreaX && snake[0].y == spawmAreaY) {
        genFood();
        eatAudio.play();
        score += 10;
        scoreBoard.innerHTML = score;
    } else {
        snake.pop();
    };
};

function isGameOver() {
    for(let i = 4; i < snake.length; i++) {
        if(snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
            gameEndedAudio.play();
            return true;
        }
    } 

    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > gameArea.width - 20;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > gameArea.height - 20; 

    if(hitLeftWall || hitRightWall || hitTopWall || hitBottomWall) {
        gameEndedAudio.play();
        return true;
    }
};

function restart() {
    snake = [
        { x: 200, y: 200 },
        { x: 220, y: 200 },
        { x: 240, y: 200 },
        { x: 260, y: 200 },
        { x: 280, y: 200 }
    ];
    if(score > localStorage.getItem('highscore')) {
        localStorage.setItem('highscore', score);
        highScoreBoard.innerHTML = localStorage.getItem('highscore');
    }
    score = 0;
    scoreBoard.innerHTML = score;
    clearTimeout(delay);
    xDirection = -20;
    yDirection = 0;
    restartAudio.play();
    main();
};