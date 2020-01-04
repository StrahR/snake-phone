const GRID_SIZE = 20;
const BODY_SIZE = 18;
const OFFSET = (GRID_SIZE-BODY_SIZE)/2;
const MAP_X_LIMIT = 30;
const MAP_Y_LIMIT = 18;
const FOOD_COLOR = "blue";
const SNAKE_COLOR = "red";
const SNAKE_INITIAL_LENGTH = 4;

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

function drawBodyPiece(x,y){
    var xOrigin = x*GRID_SIZE + OFFSET;
    var yOrigin = y*GRID_SIZE + OFFSET;
    ctx.fillRect(xOrigin,yOrigin,BODY_SIZE,BODY_SIZE);
}

function placeFood(food, x, y){
    let textWidth = ctx.measureText("X").width;
    let textHeight = textWidth / 2;
    ctx.fillText(food,
        x*GRID_SIZE+(GRID_SIZE-textWidth)/2,
        (y+1)*GRID_SIZE-(GRID_SIZE-textHeight)/4
        );
    ctx.beginPath();
    ctx.arc(x*GRID_SIZE+GRID_SIZE/2,y*GRID_SIZE+GRID_SIZE/2, BODY_SIZE/2, 0, Math.PI*2);
    ctx.stroke();
}