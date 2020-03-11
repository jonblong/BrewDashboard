const url = 'http://localhost:6969/terrapin'
const powerLabel = document.getElementById('power');
let power = 0;

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    setPower(data.CurrentPower);
  })
  .catch(function(error) {
    console.log(error);
  });

function setPower(newPower) {
  power = newPower;
  console.log(power / 1000);
  powerLabel.innerText = `Current Power: ${power} MW`;
}