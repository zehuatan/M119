//Based on the example at https://github.com/noble/noble/blob/master/examples/pizza/central.js
//Used to know how to use noble to connect to a peripheral

const noble = require('noble-winrt');

const uuid_service = "13333333333333333333333333333337";
const uuid_value = "13333333333333333333333333330001";

var accelerometerCharacteristic = null;

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
  //console.log('Found peripheral:', peripheral.advertisement.serviceUuids);  
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
            });
            
          })
        })
      })
    })
  }
  
});


