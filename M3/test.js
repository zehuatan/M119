//Where: Based on the example at https://github.com/noble/noble/blob/master/examples/pizza/central.js
//What: Link serves as an example/template of how to use noble to discover and connect to peripherals, access their services and characteristics.
//Why: Helps ensure BLE is being used correctly while debugging/learn how to use noble.

const noble = require('noble-winrt');

const uuid_service = "13333333333333333333333333333337";
const uuid_value = "13333333333333333333333333330001";

var accelerometerCharacteristic = null;
var accelerometerData = null;

noble.on('stateChange', state => {
  if (state === 'poweredOn') {
    console.log('Scanning...')
    noble.startScanning([uuid_service], false);
  }
  else {
    noble.stopScanning();
  }
});

noble.on('discover', function(peripheral){
  if (JSON.stringify(peripheral.advertisement.serviceUuids) === JSON.stringify([ '13333333-3333-3333-3333-333333333337' ]))
  {
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
              if (characteristic.uuid === '13333333-3333-3333-3333-333333330001') {
                accelerometerCharacteristic = characteristic;
              }
            })
            accelerometerCharacteristic.subscribe(function(err){
              console.log('Subscribed to:', accelerometerCharacteristic.uuid)
            });
            accelerometerCharacteristic.on('data', function(data, isNotification) {
              console.log(data.readFloatLE(0));
              accelerometerData = data.readFloatLE(0);
            });
            
          })
        })
      })
    })
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
        sensorValue: accelerometerData
    }))
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
