const express = require('express');
const https = require('https');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.post('/', function (req, res) {
  const city = req.body.cityName;
  const apiKey = '9c49f3bddc02a39b727bf68e5b35d12f';
  const units = 'metric';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;

  https.get(url, function (response) {
    // console.log(response.statusCode, response.statusMessage);

    if (response.statusCode !== 200) {
      res.sendFile(__dirname + '/failure.html');
    } else {
      response.on('data', function (data) {
        // we get data from weather api in the form of string(hexadecimal).

        const weatherData = JSON.parse(data);

        const temp = weatherData.main.temp;
        const weatherDesc = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;

        res.write(
          `<h1>The temperature in ${city} is ${temp} degree celsius.</h1>`
        );
        res.write(`<h2>The weather is ${weatherDesc}</h2>`);
        res.write(`<img src=${iconUrl}>`);
        res.send();
      });
    }
  });
});

app.post('/failure', function (req, res) {
  var a = 10;
  res.redirect('/');
});

app.listen(3000, function () {
  console.log('listening on port 3000...');
});
