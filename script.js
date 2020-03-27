const url = 'http://localhost:6969/terrapin'
const powerLabel = document.getElementById('power');

let currentPower   = 0;
let energyToday    = 0;
let energyMonth    = 0;
let energyLifetime = 0;

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
setInterval(getSolarData, 900000);

/* Set power/energy in W/Wh */
function setPower(newPower) {
  currentPower = newPower;
}

function setEnergyToday(newEnergy) {
  energyToday = newEnergy;
}

function setEnergyMonth(newEnergy) {
  energyMonth = newEnergy;
}

function setEnergyLifetime(newEnergy) {
  energyLifetime = newEnergy;
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