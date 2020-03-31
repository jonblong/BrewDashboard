const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const empty = new Image();
const full  = new Image();
empty.src = "empty.png";
full.src  = "full.png";

const terrapinBlue = 'rgb(47, 43, 66)';
const sunYellow    = 'rgb(255, 255, 102)'

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

canvas.width = WIDTH;
canvas.height = HEIGHT;

empty.onload = function() {
  ctx.drawImage(empty, 1000, 100);
  ctx.scale(0.5, 0.5);
  ctx.drawImage(full, 0, 0, 407, 558, 1000, 100, 407, 558);
}

ctx.fillStyle = terrapinBlue;
ctx.fillRect(0, 0, WIDTH, HEIGHT);