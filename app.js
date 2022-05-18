const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 500;

const dog = {
  start_x: 257,
  start_y: 405,
  x: 257,
  y: 405,
  width: 32,
  height: 32,
  frameX: 0,
  frameY: 2,
  speed: 9,
  moving: false,
  display_factor: 3.0,
  scale_factor_y: 0.1,
  visible: true,
};

const bone = {
  x: 268,
  y: 310,
  width: 32,
  height: 26,
  visible: true,
};

const house = {
  x: 532,
  y: 159,
  width: 370,
  height: 310,
};

const grass1 = {
  x: 0,
  y: 0,
  width: 250,
  height: 390,
};

const grass2 = {
  x: 335,
  y: 0,
  width: 470,
  height: 350,
};

const grass3 = {
  x: 250,
  y: 0,
  width: 120,
  height: 305,
};

const grass4 = {
  x: 0,
  y: 465,
  width: 230,
  height: 40,
};

const grass5 = {
  x: 355,
  y: 457,
  width: 460,
  height: 45,
};

const dogSprite = new Image();
dogSprite.src = "img/Dog.png";

const boneSprite = new Image();
boneSprite.src = "img/Bone.png";

const houseSprite = new Image();
houseSprite.src = "img/House.png";

const background = new Image();
background.src = "img/Background.png";

const drawDog = (img, sX, sY, sW, sH, dX, dY, dW, dH) => {
  ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
};

const drawBone = (img, sX, sY, sW, sH) => {
  ctx.drawImage(img, sX, sY, sW, sH);
};

const drawHouse = (img, sX, sY, sW, sH) => {
  ctx.drawImage(img, sX, sY, sW, sH);
};

const eatBone = async () => {
  return new Promise((resolve, rejcet) => {
    if (
      dog.x > bone.x + bone.width ||
      dog.x + dog.width < bone.x ||
      dog.y > bone.y + bone.height ||
      dog.y + dog.height < bone.y
    ) {
      return resolve();
    } else {
      bone.visible = false;
      return resolve();
    }
  });
};

const grassCol = (name) => {
  if (
    dog.x > name.x + name.width ||
    dog.x + dog.width < name.x ||
    dog.y > name.y + name.height ||
    dog.y + dog.height < name.y
  ) {
  } else {
    dog.visible = false;
  }
};

const sleep = async (milliseconds) => {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      resolve();
    }, milliseconds);
  });
};

const move = async (direction) => {
  let interval = 0;
  let requiredRuns = 0;
  let speed = 0;

  if (direction === "up") {
    interval = 216;
    requiredRuns = 16;
    speed = 6;
  } else if (direction === "down") {
    interval = 215;
    requiredRuns = 12;
    speed = 4;
  } else {
    interval = 116;
    requiredRuns = 44;
    speed = 8;
  }

  return new Promise((resolove, reject) => {
    let timesRun = 0;
    const intervalDur = setInterval(() => {
      timesRun += 1;

      if (timesRun === requiredRuns) {
        dog.moving = false;
        clearInterval(intervalDur);
        return resolove();
      }

      if (direction === "up") {
        dog.y -= speed;
        dog.display_factor -= dog.scale_factor_y;
        dog.frameY = 2;
      } else if (direction === "down") {
        dog.y += dog.speed;
        dog.display_factor += dog.scale_factor_y;
        dog.frameY = 0;
      } else {
        dog.x += dog.speed;
        dog.frameY = 1;
      }
    }, interval);
    dog.frameY = 0;
    dog.moving = true;
    dog.speed = speed;
  });
};

const turn = async () => {
  return new Promise((resolove, reject) => {
    let timesRun = 0;
    const interval = setInterval(() => {
      timesRun += 1;
      if (timesRun === 1) dog.moving = false;
      clearInterval(interval);
      return resolove();
    }, 400);
    dog.moving = true;
    dog.frameY = 1;
  });
};

const enterHouse = async () => {
  return new Promise((resolve, rejcet) => {
    if (
      dog.x > house.x + house.width ||
      dog.x + house.width < house.x ||
      dog.y > house.y + house.height ||
      dog.y + house.height < house.y
    ) {
      return resolve();
    } else {
      dog.visible = false;
      return resolve();
    }
  });
};

// animation settings:
const dogFrame = () => {
  if (dog.frameX < 3 && dog.moving) dog.frameX++;
  else dog.frameX = 0;
};

let fps, fpsInterval, startTime, now, then, elapsed;

const startAnimating = (fps) => {
  fpsInterval = 1000 / fps;
  then = performance.now();
  startTime = then;
  animate();
};

const animate = () => {
  requestAnimationFrame(animate);
  now = Date.now();
  elapsed = now - then;
  if (elapsed > fpsInterval) {
    then = now - (elapsed % fpsInterval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    drawHouse(houseSprite, house.x, house.y, house.width, house.height);
    if (bone.visible)
      drawBone(boneSprite, bone.x, bone.y, bone.width, bone.height);
    if (dog.visible)
      drawDog(
        dogSprite,
        dog.width * dog.frameX,
        dog.height * dog.frameY,
        dog.width,
        dog.height,
        dog.x,
        dog.y,
        dog.width * dog.display_factor,
        dog.height * dog.display_factor
      ),
        grassCol(grass1, grass2, grass3, grass4, grass5);

    dogFrame();
    requestAnimationFrame(animate);

    console.log("animating....");
  }
};
startAnimating(10);

async function activate() {
  await move("up");
  console.log("Move up Finished");
  await eatBone();
  console.log("Bone was eated");
  await sleep(800);
  console.log("sleep");
  await turn();
  console.log("turn");
  await move("down");
  console.log("Move down Finished");
  await sleep(1000);
  console.log("sleep");
  await move();
  console.log("Move right Finished");
  await sleep(800);
  console.log("sleep");
  await enterHouse();
  console.log("Dog is in house");
}
activate();
