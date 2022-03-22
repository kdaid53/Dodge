var canvas =document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var playerR = 5;
var playerX=canvas.width/2 -5;
var playerY=canvas.height/2 -5;
var playerSpeed = 2;

var enemyR = 5;
var enemyCount = 50;
var enemySpeedMul = 1;

var heart = 3;
var imun = false;
var highScore = 0;

var frame = 0;
var time = 0
var leftf,rightf,upf,downf = false;

highScore = localStorage.getItem("dd_highscore");

// 37-left 38-up 39-right 40-down
function keyDownHandler(e){
    if(e.keyCode == 37){leftf = true;}
    else if(e.keyCode == 38){upf = true;}
    else if(e.keyCode == 39){rightf = true;}
    else if(e.keyCode == 40){downf = true;}
}
function keyUpHandler(e){
    if(e.keyCode == 37){leftf = false;}
    else if(e.keyCode == 38){upf = false;}
    else if(e.keyCode == 39){rightf = false;}
    else if(e.keyCode == 40){downf = false;}
}

function playerMove(){
    if(leftf && playerX>playerR){playerX -= playerSpeed;}
    if(upf && playerY>playerR){playerY -= playerSpeed;}
    if(rightf && playerX<canvas.width-playerR){playerX += playerSpeed;}
    if(downf && playerY<canvas.height-playerR){playerY += playerSpeed;}
}

function randomInt(min,max){return Math.floor(Math.random()*(max-min+1))+min;}

var enemy = [];
for(var i=0; i<enemyCount; i++){
    if(i<enemyCount/4){
        enemy[i]={x:enemyR+1, y:randomInt(enemyR+1,canvas.height-enemyR-1), dx:1, dy:1};
    }
    else if(i<enemyCount/2){
        enemy[i]={x:randomInt(enemyR+1,canvas.width-enemyR-1), y:enemyR+1, dx:1, dy:1};
    }
    else if(i<enemyCount*3/4){
        enemy[i]={x:canvas.width-enemyR-1, y:randomInt(enemyR+1,canvas.height-enemyR-1), dx:1, dy:1};
    }
    else{
        enemy[i]={x:randomInt(enemyR+1,canvas.width-enemyR-1), y:canvas.height-enemyR-1, dx:1, dy:1};
    }
}

for(var i=0; i<enemyCount; i++){
    enemy[i].dx = randomInt(10,15)/10*(playerX-enemy[i].x)/getDistence(playerX,playerY,enemy[i].x, enemy[i].y);
    enemy[i].dy = randomInt(10,15)/10*(playerY-enemy[i].y)/getDistence(playerX,playerY,enemy[i].x, enemy[i].y);
}

var smartEnemy = [];
var sEnemyCount = 5;

for(var i=0; i<sEnemyCount; i++){
    if(i%2==0){
        smartEnemy[i]={x:enemyR+1, y:randomInt(enemyR+1,canvas.height-enemyR-1), dx:0.5, dy:0.5};
    }
    else{
        smartEnemy[i]={x:canvas.width-enemyR-1, y:randomInt(enemyR+1,canvas.height-enemyR-1), dx:0.5, dy:0.5};
    }
}

function drawEnemy(){
    for(var i=0; i<enemyCount; i++){
        ctx.beginPath();
        ctx.arc(enemy[i].x, enemy[i].y,enemyR, 0, Math.PI*2);
        ctx.fillStyle="#BB0055";
        ctx.fill();
        ctx.closePath();
    }
}

function drawSEnemy(){
    for(var i=0; i<sEnemyCount; i++){
        ctx.beginPath();
        ctx.arc(smartEnemy[i].x, smartEnemy[i].y,enemyR, 0, Math.PI*2);
        ctx.fillStyle="#00FF00";
        ctx.fill();
        ctx.closePath();
    }
}

function getDistence(x1,y1,x2,y2){return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));}

function enemyMove(){
    for(var i=0; i<enemyCount; i++){
        enemy[i].x += enemy[i].dx*enemySpeedMul;
        enemy[i].y += enemy[i].dy*enemySpeedMul;

        if(enemy[i].x<enemyR || enemy[i].x>canvas.width-enemyR){enemy[i].dx = -enemy[i].dx;}
        else if(enemy[i].y<enemyR || enemy[i].y>canvas.height-enemyR){enemy[i].dy= -enemy[i].dy;}
    }

} 

function sEnemyMove(){
    var acc = (1+(score-20)*0.05);
    if(acc > 1.7){acc = 1.7;}
    for(var i=0; i<sEnemyCount; i++){
        smartEnemy[i].dx = (playerX-smartEnemy[i].x)/getDistence(playerX,playerY,smartEnemy[i].x, smartEnemy[i].y);
        smartEnemy[i].dy = (playerY-smartEnemy[i].y)/getDistence(playerX,playerY,smartEnemy[i].x, smartEnemy[i].y);
        smartEnemy[i].x += smartEnemy[i].dx;
        smartEnemy[i].y += smartEnemy[i].dy;

        //if(enemy[i].x<enemyR || enemy[i].x>canvas.width-enemyR){enemy[i].dx = -enemy[i].dx*1.05;}
        //else if(enemy[i].y<enemyR || enemy[i].y>canvas.height-enemyR){enemy[i].dy= -enemy[i].dy*1.05;}
    }

}

function drawTime(){
    ctx.font = "20px";
    ctx.fillStyle = "#000000";
    ctx.fillText(time, canvas.width/2-40, 30);
}


function drawPlayerName(){
    ctx.font = "15px";
    ctx.fillStyle = "#000000";
    ctx.fillText(playerName, 10, 25);
}

function drawPlayerHeart(){
    ctx.font = "30px Arial";
    ctx.fillStyle = "#EE0000";
    switch(heart){
        case 3:
            ctx.fillText("OOO", canvas.width-100, canvas.height-10);
            break;
        case 2:
            ctx.fillText("OOX", canvas.width-100, canvas.height-10);
            break;
        case 1:
            ctx.fillText("OXX", canvas.width-100, canvas.height-10);
            break;
        case 0:
            ctx.fillText("XXX", canvas.width-100, canvas.height-10);
            break;
        default:
            ctx.fillText("ERR", canvas.width-100, canvas.height-10);
            break;
    }
    
}

function drawPlayer(){
    ctx.beginPath();
    ctx.arc(playerX,playerY,playerR,0,Math.PI*2);
    if(imun){
        ctx.fillStyle="#888888";
    }
    else{
        ctx.fillStyle="#000000";
    }
    ctx.fill();
    ctx.closePath();
}


function collisonBtwEnemy(){
    for(var i=0; i<enemyCount; i++){
        for(var j=0; j<enemyCount; j++){
            var dis = getDistence(enemy[i].x,enemy[i].y,enemy[j].x,enemy[j].y);
            if(i!=j && dis<enemyR*2){
                enemy[i].dx = Math.abs(enemy[i].dx) * (enemy[i].x-enemy[j].x)/dis;
                enemy[i].dy = Math.abs(enemy[i].dy) * (enemy[i].y-enemy[j].y)/dis;
                enemy[j].dx = Math.abs(enemy[j].dx) * (enemy[j].x-enemy[i].x)/dis;
                enemy[j].dy = Math.abs(enemy[j].dy) * (enemy[j].y-enemy[i].y)/dis;
            }
        }
    }
}

function collisionCheck(){
    if(!imun){
        for(var i=0; i<enemyCount; i++){
            if(getDistence(playerX,playerY,enemy[i].x, enemy[i].y)<playerR+enemyR){
                heart--;
                imun = true;
                if(heart<0){gameover();}
            }
        }
    }
    
}

function collisionCheck_s(){
    if(!imun){
        for(var i=0; i<sEnemyCount; i++){
            if(getDistence(playerX,playerY,smartEnemy[i].x, smartEnemy[i].y)<playerR+enemyR){
                heart--;
                imun = true;
                if(heart<0){gameover();}
            }
        }
    }
    
}

var itemx=0;
var itemy=0;
var itemWidth = 6
var isItemOnField = false;
var itemTimer = 30;

function drawItem(){
    ctx.beginPath();
    ctx.rect(itemx,itemy,itemWidth,itemWidth);
    if(isItemOnField){
        ctx.fillStyle="#0000FF";
    }
    else{
        ctx.fillStyle="rgba(0,0,0,0)";
    }
    ctx.fill();
    ctx.closePath();
}

function setItem(){
    itemx = randomInt(10,canvas.width-10);
    itemy = randomInt(10,canvas.height-10);
    isItemOnField = true;
}

function collisionOnItem(){
    if(getDistence(playerX,playerY,itemx+1.5,itemy-1.5)<=playerR+itemWidth/1.4 && isItemOnField){
        if(enemyR>2){
            enemyR --;
            isItemOnField = false;
        }
    }
}

var playerName="";
var initGame = true;
function getPlayerName(){
    playerName = document.getElementById("$playerName").value;
    if(playerName.length>10){
        playerName = playerName.substring(0,9);
    }
    if(initGame){
        draw();
        initGame = false;
    }
    else{
        window.location.reload();
    }
}

function newRecord(){

}

function gameover(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    
    ctx.font = "50px Arial";
    ctx.fillStyle = "#000000";
    ctx.fillText("GAME OVER", canvas.width-450, canvas.height/2);
    
    if(time>highScore){
        localStorage.setItem("dd_playername",playerName);
        localStorage.setItem("dd_highscore",time);
    }

    clearInterval(interval);
}

function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawPlayer();
    drawTime();
    drawPlayerName();
    drawPlayerHeart();
    drawEnemy();
    drawItem();
    //if(score > 20){drawSEnemy();}
    
    
    collisionCheck();
    collisionOnItem();
    //if(score> 20){collisionCheck_s();}
    
    playerMove();
    enemyMove();
    //if(score > 20){sEnemyMove();}
    if(time>highScore){
        ctx.font = "20px Arial";
        ctx.fillStyle = "#999999";
        ctx.fillText("NEW RECORD", 10, canvas.height-10);
    }

    frame++;
    if(frame%60==0){
        time++;
        

        if(imun){imun=false;}

        if(time!=0 && time%20==0){
            enemySpeedMul+=0.1;
        }

        if(time!=0 && time%15==0){
            enemyR++;
            
        }

        if(time!=0 && time==itemTimer){
            setItem();
            itemTimer *= 2.2;
        }
    }
    
    requestAnimationFrame(draw);
}

document.addEventListener("keydown",keyDownHandler,false);
document.addEventListener("keyup",keyUpHandler,false);

//draw();