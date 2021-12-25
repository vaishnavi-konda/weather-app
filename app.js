const express = require('express');
const https = require('https');
const app = express();

app.get('/', function (req, res) {
  const city = 'chennai';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=9c49f3bddc02a39b727bf68e5b35d12f&units=metric`;

  https.get(url, function (response) {
    console.log(response.statusCode, response.statusMessage);

    response.on('data', function (data) {
      // we get data from weather api in the form of string(hexadecimal).

      const weatherData = JSON.parse(data);

      const temp = weatherData.main.temp;
      const weatherDesc = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      console.log(icon);
      const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
      console.log(temp, weatherDesc);

      res.write(
        `<h1>The temperature in ${city} is ${temp} degree celsius.</h1>`
      );
      res.write(`<h2>The weather is ${weatherDesc}</h2>`);
      res.write(`<img src=${iconUrl}>`);
      res.send();
    });
  });

  // res.send('Server is running');
});

app.listen(3000, function () {
  console.log('listening on port 3000...');
});
