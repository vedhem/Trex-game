var trexRun;
var groundMove;
var invisibleGround;
var cloudImage;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var trexCollide;
var vx = -4;

function preload() {
  trexRun = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trexCollide = loadAnimation("trex_collided.png");
  groundMove = loadImage("ground2.png");
  cloudImage = loadImage("Cloud.png");
  obstacleOne = loadImage("obstacle1.png");
  obstacleTwo = loadImage("obstacle2.png");
  obstacleThree = loadImage("obstacle3.png");
  obstacleFour = loadImage("obstacle4.png");
  obstacleFive = loadImage("obstacle5.png");
  obstacleSix = loadImage("obstacle6.png");
  restart = loadImage("restart.png");
  gameOver = loadImage("gameOver.png");
  checkpointSound = loadSound("checkpoint.mp3");
  dieSound = loadSound("die.mp3");
  jumpSound = loadSound("jump.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(30, height-70);
  trex.addAnimation("running", trexRun);
  trex.addAnimation("collision", trexCollide);
  trex.scale = 0.4;

  ground = createSprite(width/2, height-30);
  ground.addAnimation("moving", groundMove);

  invisibleGround = createSprite(width/2, height-15, width, 20);
  invisibleGround.visible = false;

  restartButton = createSprite(width/2, height/2);
  restartButton.addImage(restart);
  restartButton.scale = 0.4;

  gameOverButton = createSprite(width/2, height/2 - 50);
  gameOverButton.addImage(gameOver);
  gameOverButton.scale = 0.4;

  obstacles = createGroup();

  clouds = createGroup();

  score = 0;

}

function spawnClouds() {
  if (frameCount % 45 === 0) {
    cloud = createSprite(width+20, height/10, 4, 4);
    cloud.y = Math.round(random(10, 65));
    cloud.addImage(cloudImage);
    cloud.scale = 0.09;
    cloud.velocityX = vx;
    cloud.lifetime = width/2;

    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    clouds.add(cloud);
  }
}

function spawnObstacles() {
  if (frameCount % 70 === 0) {
    var obstacle = createSprite(width+9, height-45);
    obstacle.velocityX = vx;

    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:obstacle.addImage(obstacleOne);
             obstacle.scale = 0.09;
             break;
      case 2:obstacle.addImage(obstacleTwo);
             obstacle.scale = 0.09;
             break;
      case 3:obstacle.addImage(obstacleThree);
             obstacle.scale = 0.09;
             break;
      case 4:obstacle.addImage(obstacleFour);
             obstacle.scale = 0.05;
             break;
      case 5:obstacle.addImage(obstacleFive);
             obstacle.scale = 0.05;
             break;
      case 6:obstacle.addImage(obstacleSix);
             obstacle.scale = 0.09;
             break;
      default:
             break;
    }
    obstacle.lifetime = width/2;
    obstacles.add(obstacle);
   
  }
}

function reset() {
  gameState = PLAY;
  restartButton.visible = false;
  gameOverButton.visible = false;
  obstacles.destroyEach();
  clouds.destroyEach();
  score = 0;
}

function draw() {
  background("white");
  text("Score: " + score, width-100, height/10);
  if (gameState === PLAY) {
    trex.changeAnimation("running", trexRun);
    ground.velocityX = vx;
    restartButton.visible = false;
    gameOverButton.visible = false;
    if (ground.x < 0) {
      ground.x = ground.width/2;
    }
    if (touches.length>0 && trex.y >= height-80 || keyDown("space") && trex.y >= height-80) {
      trex.velocityY = -12;
      jumpSound.play();
      touches = [];
    }
    trex.velocityY = trex.velocityY + 0.8;
    score = score + Math.round(frameCount/70);
    if (score>0 && score % 100 === 0) {
      vx = vx - 0.2;
      checkpointSound.play();
    }

    
    spawnClouds();
    spawnObstacles();

    if (obstacles.isTouching(trex)) {
      //trex.velocityY = -10;
      //jumpSound.play();
      gameState = END;
      dieSound.play();
    }
  }
  else if (gameState === END) {
    trex.changeAnimation("collision", trexCollide);
    ground.velocityX = 0;
    trex.velocityY = 0;

    obstacles.setLifetimeEach(-1);
    clouds.setLifetimeEach(-1);

    obstacles.setVelocityXEach(0);
    clouds.setVelocityXEach(0);

    restartButton.visible = true;
    gameOverButton.visible = true;

    if (mousePressedOver(restartButton) || touches.length>0 || keyDown("SPACE")) {
      reset();
      touches = [];
    }
  }

  trex.collide(invisibleGround);
  
  drawSprites();
}
