//======== Constants ========
const GRID_SIZE = 20;
const BODY_SIZE = 18;
const OFFSET = (GRID_SIZE-BODY_SIZE)/2;
const MAP_X_LIMIT = 30;
const MAP_Y_LIMIT = 18;
const FOOD_COLOR = "blue";
const SNAKE_COLOR = "red";
const BACKSPACE_VALUE = "X";
const CLEAR_VALUE = "N";
const ENTER_VALUE = "Y"
const FOOD_TYPES = ["0","1","2","3","4","5","6","7","8","9",
BACKSPACE_VALUE, CLEAR_VALUE, ENTER_VALUE];
const DIR_UP = "DIRECTION_UP";
const DIR_DOWN = "DIRECTION_DOWN";
const DIR_LEFT = "DIRECTION_LEFT";
const DIR_RIGTH = "DIRECTION_RIGHT";
const GAME_SPEED = 400;
const SNAKE_INITIAL_LENGTH = 12;
const FOOD_GROWTH = 7;
document.getElementById("clear-value").innerText = CLEAR_VALUE;
document.getElementById("backspace-value").innerText = BACKSPACE_VALUE;
document.getElementById("enter-value").innerText = ENTER_VALUE;
//======== Canvas Handling ========
var canvas = document.getElementById("snake");
var ctx = canvas.getContext("2d");
ctx.font = (GRID_SIZE*0.75) + "px monospace";

function stroke(x1,y1,x2,y2){
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.closePath();
    ctx.stroke();
}

function drawGrid(){
    for(var i=1; i<MAP_X_LIMIT; i++){
        stroke(i*GRID_SIZE,0,i*GRID_SIZE,GRID_SIZE*MAP_Y_LIMIT);
    }
    for(var i=1; i<MAP_Y_LIMIT; i++){
        stroke(0,i*GRID_SIZE,GRID_SIZE*MAP_X_LIMIT,i*GRID_SIZE);
    }
}

function clearCanvas(){
    var oldStyle = ctx.fillStyle;
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,GRID_SIZE*MAP_X_LIMIT,GRID_SIZE*MAP_Y_LIMIT);
    ctx.fillStyle = oldStyle;
}

function clearCell(x,y){
    var oldStyle = ctx.fillStyle;
    ctx.fillStyle = "white";
    ctx.fillRect(x*GRID_SIZE,y*GRID_SIZE,GRID_SIZE,GRID_SIZE);
    ctx.fillStyle = oldStyle;
}

function drawBodyPiece(x,y){
    var oldStyle = ctx.fillStyle;
    ctx.fillStyle = SNAKE_COLOR;
    var xOrigin = x*GRID_SIZE + OFFSET;
    var yOrigin = y*GRID_SIZE + OFFSET;
    ctx.fillRect(xOrigin,yOrigin,BODY_SIZE,BODY_SIZE);
    ctx.fillStyle = oldStyle;
}

function placeFood(food){
    var oldStyle = ctx.fillStyle;
    ctx.fillStyle = FOOD_COLOR;
    let textWidth = ctx.measureText("X").width;
    let textHeight = textWidth / 2;
    ctx.fillText(food.value,
        food.x*GRID_SIZE+(GRID_SIZE-textWidth)/2,
        (food.y+1)*GRID_SIZE-(GRID_SIZE-textHeight)/4
        );
    ctx.beginPath();
    ctx.arc(food.x*GRID_SIZE+GRID_SIZE/2,food.y*GRID_SIZE+GRID_SIZE/2, (BODY_SIZE/2)*0.8, 0, Math.PI*2);
    ctx.stroke();
    ctx.fillStyle = oldStyle;
}


//======== Numbers input ========

var numberSpan = document.getElementById("number");

function resetNumber(){
    numberSpan.innerText = "";
}

function enterValue(value){
    if(value==BACKSPACE_VALUE){
        if(numberSpan.innerText.length>0)
            numberSpan.innerText = numberSpan.innerText.slice(0, numberSpan.innerText.length-1);
    }else if(value==CLEAR_VALUE){
        resetNumber();
    }else if(value==ENTER_VALUE){
        alert("You entered the number: "+numberSpan.innerText);
        clearInterval(updateId);
    }else{
        numberSpan.innerText+=value;
    }
}

//======== Game ========
var snake = {
    length:SNAKE_INITIAL_LENGTH,
    direction:DIR_RIGTH,
    body: [{x:0,y:0}]
};

var foods = [];

var updateId = 0;
var currenGameSpeed = GAME_SPEED;

function randomCell(){
    return {
        x: Math.floor(Math.random()*MAP_X_LIMIT),
        y: Math.floor(Math.random()*MAP_Y_LIMIT)
    }
}

function cellIsAvailable(x,y){
    for(food in foods){
        if(food.x == x && food.y == y)
            return false;
    }
    for(piece of snake.body){
        if(piece.x == x && piece.y == y)
            return false;
    }
    return true;
}

function gameOver(){
    alert("Game Over!");
    clearCanvas();
    clearTimeout(updateId);
    currenGameSpeed *= 0.5;
    resetNumber();
    startGame();
    return -1;
}

function eatFood(food){
    foods = foods.filter((e)=>{return e!=food});
    snake.length+=FOOD_GROWTH;
    enterValue(food.value);
    placeAllFood();
    return 1;
}

function checkCollisions(){
    var body = snake.body.slice();
    var head = body.shift();
    //Wall collision
    if(head.x < 0 || head.y < 0 || head.x > MAP_X_LIMIT || head.y > MAP_Y_LIMIT)
        return gameOver();
    //Body collision
    for(piece of body){
        if(piece.x == head.x && piece.y == head.y)
            return gameOver();
    }
    //Food collision
    for(food of foods){
        if(food.x == head.x && food.y == head.y)
            return eatFood(food);
    }
    return 0;
}

function moveSnake(){
    var head = {...snake.body[0]};
    switch (snake.direction) {
        case DIR_UP:
            head.y--;
            break;
        case DIR_DOWN:
            head.y++;
            break;
        case DIR_LEFT:
            head.x--;
            break;
        case DIR_RIGTH:
            head.x++;
            break;
    }
    drawBodyPiece(head.x, head.y);
    snake.body.unshift(head);
    if(snake.body.length > snake.length){
        var tail = snake.body.pop();
        clearCell(tail.x, tail.y);
    }
}

document.addEventListener("keydown",(event)=>{
    if(event.keyCode == 38 && snake.direction != DIR_DOWN){
        snake.direction = DIR_UP;
    }else if(event.keyCode == 40 && snake.direction != DIR_UP){
        snake.direction = DIR_DOWN;
    }else if(event.keyCode == 37 && snake.direction != DIR_RIGTH){
        snake.direction = DIR_LEFT;
    }else if(event.keyCode == 39 && snake.direction != DIR_LEFT){
        snake.direction = DIR_RIGTH;
    }
});

function placeAllFood(){
    for(food of foods){
        clearCell(food.x,food.y);
    }
    foods = [];
    for(new_food of FOOD_TYPES){
        var food_cell;
        do{
            food_cell = randomCell();
        }while(!cellIsAvailable(food_cell.x,food_cell.y));
        var food = {
            value: new_food,
            x: food_cell.x,
            y: food_cell.y
        }
        foods.push(food);
        placeFood(food);
    }
}

function update(){
    moveSnake();
    checkCollisions();
}

function startGame(){
    snake = {
        length:SNAKE_INITIAL_LENGTH,
        direction:DIR_RIGTH,
        body: [{x:0,y:0}]
    };
    food = [];
    drawBodyPiece(0,0);
    placeAllFood();
    updateId = setInterval(update, currenGameSpeed);
}

startGame();