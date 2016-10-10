const path = require('path');
const io = require('socket.io-client');
const express = require('express');
const bodyParser = require('body-parser');
const createPage = require('./page');
const socket = io('https://houmi.herokuapp.com');

const colors = [
  {_id: process.env.LIGHT_ID, hue: 255},
  {_id: process.env.LIGHT_ID, hue: 189},
  {_id: process.env.LIGHT_ID, hue: 152},
  {_id: process.env.LIGHT_ID, hue: 83},
  {_id: process.env.LIGHT_ID, hue: 38}
];

let state = {
  _delay: 3000,
  _selectedColor: 0,
  set delay(val) {
    if (!isNaN(val) && val >= 500 && isFinite(val)) {
      this._delay = val;
    } else {
      throw new Error('Invalid value!');
    }
  },
  get delay() {
    return this._delay;
  },
  changeColor: function() {
    this._selectedColor++;
    this._selectedColor = this._selectedColor % colors.length;
  },
  get selectedColor() {
    return this._selectedColor;
  }
};


function changeLight() {
  console.log(`Changing light: ${state.selectedColor} ${state.delay}`);
  socket.emit('apply/light', colors[state.selectedColor]);
  state.changeColor();
  setTimeout(changeLight, state.delay);
}

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.post('/', function(req, res) {
  try {
    state.delay = (60 / parseInt(req.body.bpm, 10)) * 1000;
    res.status(200).send(createPage(req.body.bpm));
  } catch(err) {
    res.status(200).send(createPage(req.body.bpm, err.message));
  }
});

app.get('/', function(req, res) {
  const bpm = 60000 / state.delay;
  res.status(200).send(createPage(bpm));
});

const server = app.listen(3000, function() {
  socket.on('connect', function() {
    console.log('connected')
    socket.emit('clientReady', { siteKey: process.env.SITE_KEY })
    socket.emit('apply/light', {_id: process.env.LIGHT_ID, on: true, bri: 255, saturation: 255, hue: 255});
    setTimeout(changeLight, 10000);
  })
});

