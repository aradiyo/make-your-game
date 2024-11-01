import Ball from "./ball.js";
import Border from "./border.js";
import Paddle from "./paddle.js";
import Block from "./block.js";
import Timer from "./timer.js";
import './fps.js';



const ball = new Ball(document.getElementById("ball"))
const border = new Border(document.getElementById("border"))
const paddle = new Paddle(document.getElementById("paddle"))
const borderElement = document.getElementById("border")
const timer = new Timer(document.getElementById("timer"))
const score = document.getElementById("score")
const lives = document.getElementById("lives")
const popup = document.getElementById("popup")
// const level = document.getElementById("level") // to be fixed
let currentLives = parseInt(lives.textContent)
let startPopup = false
let lastTime;
let gameOn = false;
let mouseX;
let blocks = [];
let lvl = 1;
let winCounter;
let gameStart = false;
let gameEnd = false;
const winGame = 3;

// add block to the board
level(lvl)



// game loop logic
function update (time){

if (lastTime != null){
    const delta = time - lastTime;
    ball.update(delta,border,paddle, blocks); 
}
lastTime = time;

// invoke new game if player destroy all bircks
if (score.textContent == winCounter  && gameOn && lvl < winGame) {
ball.reset();
gameStart = false; 
lvl++;
level(lvl);
} 


// reset paddle and ball state when losing live
if (currentLives > parseInt(lives.textContent)){
    console.log(lives.textContent)
    ball.reset();
    gameStart = false;
    currentLives = parseInt(lives.textContent);
} 

// detect winning of losing game according to live lose of final level reached
if (score.textContent == winCounter  && lvl == winGame && !gameEnd) {
    console.log("You Win!");
    win();
}else if (lives.textContent == 0){
    console.log("Game Over!");
    gameOver();
} else {
    window.requestAnimationFrame(update) // game running loop
}
}


window.requestAnimationFrame(update); //start game loop




// move paddle with mouse x
document.addEventListener("mousemove", function(m){
mouseX = m.x
   if (gameOn || !gameStart){ 
    if (!gameEnd){
    paddle.paddleMove(mouseX)
    }
;} 
})

// use space to pause the game
document.addEventListener("keydown", e=>{
    if (e.code === "Space"){
        Pause()
    } 
    // testing use A botton break all bircks (fire ball and press A before hitting any bircks)
    if(e.code ==="KeyA"){
        blocks.forEach(element => {
            element.collision()
            console.log("collision")
        });
    }
})

// add blocks to the board
function level(lvl){
    blocks = []
    const blockHeight = 3;  // % of screen height
    const blockWidth = 15; // % of screen width
    const leftSpace = 5; // % of screen width
    for (let row =1; row <= lvl+2; row++) {
        for (let i = 0; i <6 ; i++) {
           const block = new Block( leftSpace + blockWidth* i, blockHeight * row * 1.5, borderElement)
         blocks.push(block);
        }
    }
    // creat a couunter to know when is the lvl is finished
    winCounter = parseFloat(score.textContent) + blocks.length;
}

// pause and unpase game using Space bar
function Pause() {
    if (gameStart){
    if (gameOn){
        document.querySelector(".pause").style.display = "flex";
        timer.pause();
        ball.pause();
        gameOn = false

    }
    }
    console.log(gameOn)
}

// function to stop everything and show the popup to restart the game for losing - alalaradi
function gameOver(){
    if (lives.textContent == 0){
        timer.pause();
        ball.ballElem.remove();
        document.querySelector(".popup.restart").style.display = "flex";;
        gameEnd = true;
    }
}

// function to stop everything and show the popup to restart the game for winning - alalaradi
function win(){
    if (score.textContent == winCounter){
        timer.pause();
        ball.ballElem.remove();
        document.querySelector(".popup.win").style.display = "flex";;
        gameEnd = true;
    }
}


// // detect score and update level accordingly.
// if (score.textContent < 18  && !gameEnd) {
// level.textContent = 1;
// }else if (lives.textContent >= 18 && !gameEnd){
//     level.textContent = 2;
// } else {
//     level.textContent = 3;
// }


// detect if the game started or not to allow paddle more and lunch the ball
function start(){
    if (!gameStart){
        gameOn = true;
        ball.start();
        paddle.paddleMove(mouseX); 
        timer.start();
            
    }
    gameStart = true;
}


// use mouse left click to fire the ball
document.addEventListener("mousedown",e=>{
    if (e.button === 0 && lives.textContent != 0 ){
        if (startPopup){
        start();
        }else {
            startPopup = true;
            popup.style.display = "none";
        }
    }
})

// popup.addEventListener("click",e=>{
//     startPopup = true;
//     popup.style.display = "none";
// })


// add a winning or losing statment in the middle of the screen
function endScreen(states){
    const endingStatus = document.createElement("div");
    endingStatus.className = "ending";
    endingStatus.textContent = states;
    borderElement.appendChild(endingStatus);
    ball.ballElem.remove();
    gameEnd = true;
    console.log(endingStatus);

}

//continue
document.getElementById("continue").addEventListener("click",e=>{
    ball.resume();
    timer.start();
    paddle.paddleMove(mouseX) 
    gameOn = true
    document.querySelector(".pause").style.display = "none";
})

//restart game for pause menu

document.getElementById("restart").addEventListener("click",e=>{
    location.reload();
})


//restart game for game over menu - alalaradi
document.getElementById("gameOverRestart").addEventListener("click",e=>{
    location.reload();
})

//restart game for win menu - alalaradi
document.getElementById("winRestart").addEventListener("click",e=>{
    location.reload();
})

//refresh page by clicking refresh button
document.getElementById("refresh").addEventListener("click",e=>{
    location.reload();
})


