const url = 'http://localhost:6969/terrapin'
const powerLabel = document.getElementById('power');
const barrelsTodayLabel = document.getElementById('barrelsToday');

const timeInterval = 900000;
const tickRate     = 5000;
const timeConstant = timeInterval / tickRate;

let currentPower   = 0;
let energyToday    = 0;
let energyMonth    = 0;
let energyLifetime = 0;

let barrelsToday    = 0;
let barrelsMonth    = 0;
let BarrelsLifetime = 0;

let energyInterval = 60000000;
let currentTick    = 0;

/* Fetch dummy data and update variables/labels */
function getSolarData() {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      setPower(data.CurrentPower);
      setEnergyToday(data.EnergyToday);
      setEnergyMonth(data.EnergyMonth);
      setEnergyLifetime(data.EnergyLifetime);
      powerLabel.innerText = `Current Power: ${getPower()} kW`;
    })
    .catch(function(error) {
      console.log(error);
    });
}

getSolarData();
setInterval(tick, tickRate);

function tick() {
  barrelsToday += ((energyInterval / 50000) / timeConstant);
  console.log(barrelsToday);
  barrelsTodayLabel.innerText = `Barrels Today: ${Math.floor(barrelsToday)}`;

  currentTick += tickRate;
  if (currentTick >= timeInterval) {
    getSolarData();
    currentTick = 0;
  }
}

/* Set power/energy in W/Wh */
function setPower(newPower) {
  currentPower = newPower;
}

function setEnergyToday(newEnergy) {
  //energyInterval = newEnergy - energyToday;
  energyToday = newEnergy;
  console.log(`Produced ${barrelsToday} barrels today.`);
}

function setEnergyMonth(newEnergy) {
  energyMonth = newEnergy;
  barrelsMonth = energyMonth / 50000;
  console.log(`Produced ${barrelsMonth} barrels this month.`);
}

function setEnergyLifetime(newEnergy) {
  energyLifetime = newEnergy;
  barrelsLifetime = energyLifetime / 50000;
  console.log(`Produced ${barrelsLifetime} barrels total.`);
}

/* Get power/energy in kW/kWh */
function getPower() {
  return +(Math.round((currentPower / 1000) + "e+" + 2) + "e-" + 2);
}

function getEnergyToday() {
  return +(Math.round((energyToday / 1000) + "e+" + 2) + "e-" + 2);
}

function getEnergyMonth() {
  return +(Math.round((energyMonth / 1000) + "e+" + 2) + "e-" + 2);
}

function getEnergyLifetime() {
  return +(Math.round((energyLifetime / 1000) + "e+" + 2) + "e-" + 2);
}