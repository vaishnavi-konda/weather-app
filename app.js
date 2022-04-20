const express = require('express');
const https = require('https');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/', function (req, res) {
  const city = req.body.cityName;
  const apiKey = '9c49f3bddc02a39b727bf68e5b35d12f';
  const units = 'metric';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;

  https.get(url, function (response) {
    if (response.statusCode !== 200) {
      res.redirect('/failure');
    } else {
      response.on('data', function (data) {
        // we get data from weather api in the form of string(hexadecimal).

        const weatherData = JSON.parse(data);

        const temp = weatherData.main.temp;
        const weatherDesc = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;

        res.send(`<form action="/" method="get">
        <h1>The temperature in ${city} is ${temp} degree celsius.</h1>
        <h2>The weather is ${weatherDesc}</h2>
        <img src=${iconUrl}>
        <button>Try Another city</button>
        </form>`);
      });
    }
  });
});

app.get('/failure', function (req, res) {
  // res.redirect('/');
  res.send(`<div class="mt-4 p-5 bg-primary text-white rounded">
  Sorry, the weather details of this city are not available. Please try
  another city.
  <form action="/" method="get">
  <button class="btn btn-light" type="submit">Try Again</button>
  </form>
  </div>`);
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
app.listen(3000, function () {
  console.log('listening on port 3000...');
});
