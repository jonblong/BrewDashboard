const url = 'http://localhost:6969/terrapin'
const powerLabel = document.getElementById('power');
let power = 0;

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    setPower(data.CurrentPower);
    powerLabel.innerText = `Current Power: ${getPower()} MW`;
  })
  .catch(function(error) {
    console.log(error);
  });

function setPower(newPower) {
  power = newPower;
}

function getPower() {
  return +(Math.round((power / 1000) + "e+" + 2) + "e-" + 2);
}