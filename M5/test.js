//Where: Based on the example at https://github.com/noble/noble/blob/master/examples/pizza/central.js
//What: Link serves as an example/template of how to use noble to discover and connect to peripherals, access their services and characteristics.
//Why: Helps ensure BLE is being used correctly while debugging/learn how to use noble.

const noble = require('noble-winrt');

const uuid_service = "13333333333333333333333333333337";
const uuid_value = "13333333333333333333333333330001";

const p1_service = '13333333-3333-3333-3333-333333333337';
const p1_value = '13333333-3333-3333-3333-333333330001';

const p2_service = '23333333-3333-3333-3333-333333333337';
const p2_value = '23333333-3333-3333-3333-333333330001';

var p1 = {
  characteristic: null,
  data: null,
  name: 'p1'
}

var p2 = {
  characteristic: null,
  data: null,
  name: 'p2'
}


noble.on('stateChange', state => {
  if (state === 'poweredOn') {
    console.log('Scanning...')
    noble.startScanning();
  }
  else {
  }
});

function connectAndRead(peripheral, value, player) {
  console.log('yipee!');
    console.log('Found peripheral:', peripheral.advertisement);  
    peripheral.connect(function(err) {
      console.log('Connected:', peripheral.uuid)
      peripheral.discoverServices([uuid_service], function(err, services){
        services.forEach(function(service) {
          console.log('Found service:', service.uuid);
          service.discoverCharacteristics([uuid_value], function(err, characteristics){
            characteristics.forEach(function(characteristic){
              console.log('Found characteristic:', characteristic.uuid)
              if (characteristic.uuid === value) {
                player.characteristic = characteristic;
              }
            })
            player.characteristic.subscribe(function(err){
              console.log('Subscribed to:', player.characteristic.uuid)
            });
            player.characteristic.on('data', function(data, isNotification) {
              console.log(data.readFloatLE(0));
              player.data = data.readFloatLE(0);
              //console.log(player.name + ': ' + player.data);
            });
            
          })
        })
      })
    })
}

noble.on('discover', function(peripheral){
  console.log(peripheral.serviceUuids);
  if (JSON.stringify(peripheral.advertisement.serviceUuids) === JSON.stringify([ p1_service ]))
  {
    connectAndRead(peripheral, p1_value, p1);
    noble.startScanning();
  }
  if (JSON.stringify(peripheral.advertisement.serviceUuids) === JSON.stringify([ p2_service ]))
  {
    connectAndRead(peripheral, p2_value, p2);
    noble.startScanning();
  }
});

//Where: https://github.com/ucla-hci/m119/blob/main/m3/central.js
//What: Code uses express to set up webpage and send sensor data
//Why: Letting template code handle the details of data transfer and setting up the webpage allows for more focus on implementing the visuals
const express = require('express')
const app = express()
const port = 3000

app.use(express.static("public")); //Needed to allow image to display

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    res.end(JSON.stringify({
        sensorValue1: p1.data,
        sensorValue2: p2.data
    }))
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
