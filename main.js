var canvas =document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var playerR = 5;
var playerX=canvas.width/2 -5;
var playerY=canvas.height/2 -5;
var playerSpeed = 2;

var enemyR = 5;
var enemyDX = 1;
var enemyDY = 1;

var heart = 3;
var imun = false;

var time = 0;
var score = 0
var leftf,rightf,upf,downf = false;

// 37왼 38위 39오 40아
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
var enemyCount = 30;
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
    enemy[i].dx = 1.2*(playerX-enemy[i].x)/getDistence(playerX,playerY,enemy[i].x, enemy[i].y);
    enemy[i].dy = 1.2*(playerY-enemy[i].y)/getDistence(playerX,playerY,enemy[i].x, enemy[i].y);
    //enemy[i].dx *=2;
    //enemy[i].dy *=2;
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
        ctx.fillStyle="#FF00FF";
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
        enemy[i].x += enemy[i].dx;
        enemy[i].y += enemy[i].dy;

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

function drawPlayerXY(){
    ctx.font = "10px Arial";
    ctx.fillStyle = "#000000";
    ctx.fillText("("+playerX+","+playerY+")"+score+", "+heart, 8, 15);
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
                //heart--;
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

function enemyMinSpeed(){
    for(var i=0;i<enemyCount; i++){
        if(Math.abs(enemy[i].dx)<1.5){
            enemy[i].dx *= 1.1;
        }
        if(Math.abs(enemy[i].dy)<1.5){
            enemy[i].dy *= 1.1;
        }
    }
}

function gameover(){
    //alert("!! YOU LOSE !!");
    ctx.clearRect(0,0,canvas.width,canvas.height);
    
    ctx.font = "50px Arial";
    ctx.fillStyle = "#000000";
    ctx.fillText("GAME OVER", canvas.width-450, canvas.height/2);

    //document.location.reload();
    clearInterval(interval);
}

function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawPlayer();
    drawPlayerXY();
    drawEnemy();
    //if(score > 20){drawSEnemy();}
    
    
    collisionCheck();
    //if(score> 20){collisionCheck_s();}
    
    playerMove();
    enemyMove();
    //if(score > 20){sEnemyMove();}
    
    if(score>0){
        collisonBtwEnemy();
    }
    
    
    enemyMinSpeed();

    time++;
    if(time%60==0){
        score++;
        if(imun){imun=false;}

        if(score!=0 && score%10==0){
            for(var i=0; i<enemyCount; i++){
                enemy[i].dx *= 1.1;
                enemy[i].dy *= 1.1;
            }
        }

        if(score!=0 && score%15==0){
            enemyR++;
            
        }
    }
    
    requestAnimationFrame(draw);
}

document.addEventListener("keydown",keyDownHandler,false);
document.addEventListener("keyup",keyUpHandler,false);

draw();