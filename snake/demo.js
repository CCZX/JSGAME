// 点击开始游戏，随机出现食物和🐍，
// 吃到食物 ? +1
// 控制运动
// 撞墙 ？ over

/**
 * core：使用数组snakeBody来表示蛇，第一位表示蛇头其他均为蛇身，循环snakeBody来创建蛇，
 * move函数来使蛇移动，蛇移动的时候蛇身上该节的位置等于上一次的位置，蛇默认的移动方向为right，
 * 如果向right移动就不能点击左或右按钮，蛇运动的时候先清除之前创建的蛇再根据新的snakeBody创建蛇
 * 
 */

var snakeMove;
var startGameBool = true;
var startPauseBool = true;
var speed = 200;
var scoreBox = document.getElementById('score');
var content = document.getElementById('content');
var lose = document.getElementById('loser');
var loserScore = document.getElementById('loserScore');
var startPaush = document.getElementById('startPaush');
var closeBtn = document.getElementById('close');
var startBtn = document.getElementById('startBtn');
var startPage = document.getElementById('startPage');

init();
function init() {
    //地图属性
    this.mapW = parseInt(window.getComputedStyle(content).width); // 取得宽度，宽度在调整页面大小时会变化
    this.mapH = parseInt(window.getComputedStyle(content).height);
    this.mapDiv = content;
    //食物属性
    this.foodW = 20;
    this.foodH = 20;
    this.foodX = 0;
    this.foodY = 0;
    this.foodColor = '#00F';
    //蛇属性
    this.snake;
    this.snakeW = 20;
    this.snakeH = 20;
    this.snakeBody = [[3, 0, 'head'], [2, 0, 'body'], [1, 0, 'body']]; // 使用数组来表示🐍
    //游戏属性
    this.direct = 'right'; // 当前蛇前进的方向
    this.left = false;
    this.right = false;
    this.up = true;
    this.down = true;

    //分数
    this.score = 0;
    scoreBox.innerHTML = this.score;
    bindEvent();
}
function startGame() {
    startPage.style.display = 'none';
    startPaush.style.display = 'block';
    food();
    snake();
}

function food() { // 生成食物
    var food = document.createElement('div');
    food.style.width = this.foodW + 'px'; // 宽
    food.style.height = this.foodH + 'px';
    food.style.borderRadius = '50%';
    this.foodX = Math.floor(Math.random() * (this.mapW / this.foodW)); // 随机生成位置
    this.foodY = Math.floor(Math.random() * (this.mapH / this.foodH));
    
    food.style.left = this.foodX * this.foodW + 'px';
    food.style.top = this.foodY * this.foodH + 'px';

    food.style.position = 'absolute';
    this.mapDiv.appendChild(food).setAttribute('class', 'food');
}
function snake() { // 生成🐍
    for (var i = 0; i < this.snakeBody.length; i++) { // 根据snakeBody生成蛇
       var snake = document.createElement('div');
        snake.style.width = this.snakeW + 'px';
        snake.style.height = this.snakeH + 'px';
        snake.style.borderRadius = '50%';
        snake.style.position = 'absolute';
        snake.style.left = this.snakeBody[i][0] * 20 + 'px';
        snake.style.top = this.snakeBody[i][1] * 20 + 'px';
        snake.classList.add(this.snakeBody[i][2]); // 判断是蛇身还是蛇头
        this.mapDiv.appendChild(snake).classList.add('snake');   
        switch (this.direct) { // 旋转蛇头
            case 'right':
                break;
            case 'up':
                snake.style.transform = 'rotate(270deg)'
                break;
            case 'left':
                snake.style.transform = 'rotate(180deg)'
                break;
            case 'down':
                snake.style.transform ='rotate(90deg)';
                break;
            default:
                break;
        }
    }
}
function move() { // 运动
    //蛇身位置
    for (var i = this.snakeBody.length - 1; i > 0; i--) {
        this.snakeBody[i][0] = this.snakeBody[i - 1][0]; // 蛇的每一节的位置等于蛇的前一节的位置
        this.snakeBody[i][1] = this.snakeBody[i - 1][1];
    }
    //蛇头位置
    switch (this.direct) {
        case 'right':
            this.snakeBody[0][0] += 1;
            break;
        case 'up':
            this.snakeBody[0][1] -= 1;
            break;
        case 'left':
            this.snakeBody[0][0] -= 1;
            break;
        case 'down':
            this.snakeBody[0][1] += 1;    
            break;
        default:
            break;

    }
    //删除之前蛇的节点 再渲染
    removeClass('snake');
    snake();
    // 如果蛇头和食物x y同时相等 代表吃到食物
    if (this.snakeBody[0][0] == this.foodX && this.snakeBody[0][1] == this.foodY) {
        var snakeTailX = this.snakeBody[this.snakeBody.length - 1][0];
        var snakeTailY = this.snakeBody[this.snakeBody.length - 1][1];
        switch (this.direct) {
            case 'right':
                this.snakeBody.push([snakeTailX + 1, snakeTailY, 'body']);

                break;
            case 'up':
                this.snakeBody.push([snakeTailX, snakeTailY - 1, 'body']);
                break;
            case 'left':
                this.snakeBody.push([snakeTailX - 1, snakeTailY, 'body']);
                break;
            case 'down':
                this.snakeBody.push([snakeTailX, snakeTailY + 1, 'body']);
                break;
            default:
                break;
        }
        this.score += 1;
        scoreBox.innerHTML = this.score;
        removeClass('food');
        food();

    }
    // 判断撞到边界
    if (this.snakeBody[0][1] < 0 || this.snakeBody[0][1] >= this.mapH / this.snakeH) {
        this.reloadGame();
    }
    if (this.snakeBody[0][0] < 0 || this.snakeBody[0][0] >= this.mapW / this.snakeW) {
        this.reloadGame();
    }
    var snakeHeaderX = this.snakeBody[0][0];

    var snakeHeaderY = this.snakeBody[0][1];
    for (var i = 1; i < this.snakeBody.length; i++) {
        var snakeBodyX = this.snakeBody[i][0];
        var snakeBodyY = this.snakeBody[i][1];
        if (snakeHeaderX == snakeBodyX && snakeHeaderY == snakeBodyY) {
            this.reloadGame();
        }
    }
}

function setDerict(code) { // 设置方向
    switch (code) {
        case 37:
            if (this.left) { // 判断能不能向左运动，比如蛇是向左或者向右就不能点击向左运动
                this.direct = 'left';
                this.left = false;
                this.right = false;
                this.up = true;
                this.down = true;
            }
            break;
        case 38:
            if (this.up) {
                this.direct = 'up';
                this.left = true;
                this.right = true;
                this.up = false;
                this.down = false;
            }
            break;
        case 39:
            if (this.right) {
                this.direct = 'right';
                this.left = false;
                this.right = false;
                this.up = true;
                this.down = true;
            }
            break;
        case 40:
            if (this.down) {
                this.direct = 'down';
                this.left = true;
                this.right = true;
                this.up = false;
                this.down = false;
            }
            break;
        default:
            break;
    }

}

function reloadGame() { 
    removeClass('snake');
    removeClass('food');
    clearInterval(snakeMove);
    startPaush.setAttribute('src', './img/start.png');
    this.snakeBody = [[3, 2, 'head'], [2, 2, 'body'], [1, 2, 'body']];
    this.direct = 'right';
    this.left = false;
    this.right = false;
    this.up = true;
    this.down = true;
    startPauseBool = true;
    startGameBool = true;
    lose.style.display = 'block';
    loserScore.innerHTML = this.score;
    this.score = 0;
    scoreBox.innerHTML = this.score;
}

function removeClass(calssName) { // 删除之前的蛇 
    var ele = document.getElementsByClassName(calssName);
    while (ele.length > 0) {
        ele[0].parentNode.removeChild(ele[0]);
    }
}

function bindEvent() {
    startBtn.onclick = function(){
        startAndPauseGame();        
    }
    startPaush.onclick = function () {
        startAndPauseGame();
    }
    closeBtn.onclick = function () {
        lose.style.display = 'none';
    }
}

//开始和暂停游戏 逻辑封装
function startAndPauseGame() {
    if (startPauseBool) {
        if (startGameBool) {
            startGame();
            startGameBool = false;
        }
        startPaush.setAttribute('src', './img/pause.png');
        snakeMove = setInterval(function () {
            move();
        }, speed);
        document.onkeydown = function (e) {
            var code = e.keyCode;
            setDerict(code);
        };
        startPauseBool = false;
    } else {
        //暂停
        startPaush.setAttribute('src', './img/start.png');
        clearInterval(snakeMove);
        document.onkeydown = function (e) {
            e.returnValue = false;
            return false;
        };
        startPauseBool = true;
    }
}

