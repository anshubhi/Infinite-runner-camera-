var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound


function preload(){
  trex_running = loadImage("trex1-1.png","trex3-1.png","trex4-1.png");
  trex_collided = loadAnimation("trex_collided-1.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud-2.png");
  
  obstacle1 = loadImage("obstacle1-1.png");
  obstacle2 = loadImage("obstacle2-1.png");
  obstacle3 = loadImage("obstacle3-1.png");
  obstacle4 = loadImage("obstacle4-1.png");
  obstacle5 = loadImage("obstacle5-1.png");
  obstacle6 = loadImage("obstacle6-1.png");
  
   restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  
  
  ground = createSprite(width/2,height-30,canvas.width,height);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" ,trex_collided);
  trex.scale = 0.7;

  
   gameOver = createSprite(width/2,height/2-30);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(width/2,height-20,400,10);
  invisibleGround.x = invisibleGround.width/2
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
 
  trex.setCollider("rectangle",0,0,60,trex.height);
  
  
  score = 0;
  
}

function draw() {
  
  background("SkyBlue")
  //displaying score
  fill("blue")
  stroke(3)
  textSize(20);
  text("Score: "+ score, 500,50);
  
  console.log("this is ",gameState)
  
  
  
  if(gameState === PLAY){
    gameOver.visible = false
    restart.visible = false
    //move the ground
    ground.velocityX = -(4+3* score/200);
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100===0){
      checkPointSound.play();
    }
    
    
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= height/2) {
        trex.velocityY = -12;
      jumpSound.play();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
      dieSound.play();
    }
  }
   else if (gameState === END) {
     console.log("hey")
      gameOver.visible = true;
      restart.visible = true;
     
      ground.velocityX = 0;
      trex.velocityY = 0
     
      //change the trex animation
      trex.changeAnimation("collided", trex_collided);
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  if(mousePressedOver(restart)){
    reset();
  }
  
  drawSprites();
}

function reset(){
  
  gameState = PLAY ;
  restartImg.visible = false;
  gameOverImg.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score = 0;
   trex.changeAnimation("running", trex_running);
  
  
}



function spawnObstacles(){
 if (frameCount % 50 === 0){
   var obstacle = createSprite(width,height-35,10,40);
   obstacle.velocityX = -(6+score /100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.7;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(0,height/2));
    cloud.addImage(cloudImage);
    cloud.scale = 0.3;
    cloud.velocityX = -(3+score /100);
    
     //assign lifetime to the variable
    cloud.lifetime = 134;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}

