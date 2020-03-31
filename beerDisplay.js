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
  }

  currentTick += tickRate;
  printStats();
}

/* Initializes the stats at the beginning of runtime */
function initApp() {
  initStats();
  initCanvas();
  setInterval(tick, tickRate);
}

/* Initializes the stats at the beginning of runtime */
function initStats() {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      currentPower   = data.CurrentPower;
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
      currentPower   = data.CurrentPower;
      energyInterval = data.EnergyToday - energyToday;
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
  ctx.drawImage(empty, (WIDTH / 2) - (IMG_WIDTH / 2), (HEIGHT / 2) - (IMG_HEIGHT / 2));
}

/* Draws the barrel filled to a given percentage, from 0 to 1 */
function drawBarrel(progress) {
  let barrelHeight = ((1 - progress) * IMG_HEIGHT);
  let xToDraw = (WIDTH / 2) - (IMG_WIDTH / 2);
  let yToDrawEmpty = (HEIGHT / 2) - (IMG_HEIGHT / 2);
  let yToDrawFull  = yToDrawEmpty + barrelHeight;

  fillStyle = terrapinBlue;
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
}