const url = 'http://localhost:6969/terrapin'

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const IMG_WIDTH = 407;
const IMG_HEIGHT = 558;

const empty = new Image();
const full  = new Image();
empty.src = "empty.png";
full.src  = "full.png";

const terrapinBlue = 'rgb(47, 43, 66)';
const sunYellow    = 'rgb(255, 255, 102)'

const timeInterval = 15000;
const tickRate     = 50;
const timeConstant = timeInterval / tickRate;

let currentPower   = 0;
let nextPower      = 0;
let energyToday    = 0;
let energyMonth    = 0;
let energyLifetime = 0;

let barrelsToday    = 0;
let barrelsMonth    = 0;
let BarrelsLifetime = 0;

let initialized = false;
let energyInterval = 0;
let barrelProgress = 0;
let currentTick    = 0;

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

initApp();

function tick() {
  if (currentTick >= timeInterval) {
    if (!initialized) {
      initialized = true;
    }
    updateStats();
    currentTick = 0;
  }

  if (initialized) {
    energyToday += energyInterval / timeConstant;
    drawBarrel(((energyToday / 50000) % 1).toFixed(4));
    updateLabels();
  }

  currentTick += tickRate;
  printStats();
}

/* Initializes the stats at the beginning of runtime */
function initApp() {
  initStats();
  initCanvas();
  initLabels();
  setInterval(tick, tickRate);
}

/* Initializes the stats at the beginning of runtime */
function initStats() {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      nextPower      = data.CurrentPower;
      energyToday    = data.EnergyToday;
      energyMonth    = data.EnergyMonth;
      energyLifetime = data.EnergyLifetime;
    })
    .catch(function(error) {
      console.log(error);
    });
}

/* Updates current power and total energy over the last 15 minutes */
function updateStats() {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      currentPower   = nextPower;
      nextPower      = data.CurrentPower;
      energyInterval = data.EnergyToday - energyToday;

      ctx.fillStyle = terrapinBlue;
      ctx.fillRect(800, 600, 800, 300);

      ctx.font = "48px Josefin Sans";
      ctx.fillStyle = sunYellow;
      ctx.fillText(`Current Power: ${(currentPower/1000).toFixed(2)} kW`, 900, 640);
    })
    .catch(function(error) {
      console.log(error);
    });
}

/* Initializes the canvas with a blue background */
function initCanvas() {
  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  ctx.fillStyle = terrapinBlue;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.drawImage(empty, (WIDTH / 3) - (IMG_WIDTH / 3), (HEIGHT / 2) - (IMG_HEIGHT / 2));
}

/* Draws the barrel filled to a given percentage, from 0 to 1 */
function drawBarrel(progress) {
  ctx.fillStyle = terrapinBlue;
  let barrelHeight = ((1 - progress) * IMG_HEIGHT);
  let xToDraw = (WIDTH / 3) - (IMG_WIDTH / 3);
  let yToDrawEmpty = (HEIGHT / 2) - (IMG_HEIGHT / 2);
  let yToDrawFull  = yToDrawEmpty + barrelHeight;

  ctx.fillRect(xToDraw, yToDrawEmpty, IMG_WIDTH, IMG_HEIGHT);

  ctx.drawImage(empty, xToDraw, yToDrawEmpty);
  ctx.drawImage(full, 0, barrelHeight,
                      IMG_WIDTH, IMG_HEIGHT-barrelHeight,
                      xToDraw, yToDrawFull,
                      IMG_WIDTH, IMG_HEIGHT-barrelHeight);
}

function printStats() {
  console.log(`Current Tick: ${currentTick}`);
  console.log(`Initialized: ${initialized}`);
  console.log(`EnergyInterval: ${energyInterval}`);
  console.log(`EnergyToday: ${energyToday}`);
  console.log(`Current Barrels: ${barrelsToday}`);
}

function initLabels() {
  ctx.font = "48px Josefin Sans";
  ctx.fillStyle = sunYellow;
  /* Headers */
  ctx.fillText("Terraprint's Impact:", 900, 100);
  ctx.fillText("Barrels Brewed", 900, 350);
  ctx.fillText("with Solar Power:", 900, 400);
  ctx.fillText(`Current Power: ${currentPower}`, 900, 640);

  ctx.font = "24px Josefin Sans";
  /* Trees Saved */
  ctx.fillText("Trees Saved:", 900, 150);
  ctx.fillText("420000", 1200, 150);

  /* Oil Saved */
  ctx.fillText("Barrels of Oil Saved:", 900, 190);
  ctx.fillText("6900", 1200, 190);

  /* Plastic Saved */
  ctx.fillText("Pounds of Plastic Saved:", 900, 230);
  ctx.fillText("2519020", 1200, 230);

  /* Plastic Saved */
  ctx.fillText("Today:", 900, 450);
  ctx.fillText((energyToday / 50000), 1200, 450);

  /* Plastic Saved */
  ctx.fillText("This Month:", 900, 490);
  ctx.fillText((energyMonth / 50000) + (energyToday / 50000), 1200, 490);

  /* Plastic Saved */
  ctx.fillText("Lifetime:", 900, 530);
  ctx.fillText((energyLifetime / 50000) + (energyToday / 50000), 1200, 530);
}

function updateLabels() {
  ctx.fillStyle = terrapinBlue;
  ctx.fillRect(1200, 400, 200, 200);

  ctx.font = "24px Josefin Sans";
  ctx.fillStyle = sunYellow;
  ctx.fillText((energyToday / 50000).toFixed(2), 1200, 450);
  ctx.fillText(((energyMonth / 50000) + (energyToday / 50000)).toFixed(2), 1200, 490);
  ctx.fillText(((energyLifetime / 50000) + (energyToday / 50000)).toFixed(2), 1200, 530);
}