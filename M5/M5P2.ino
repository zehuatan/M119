/*
Code template for setting up Serial, IMU, Bluetooth taken from example at https://github.com/ucla-hci/m119/blob/main/m2b_peripheral/m2b_peripheral.ino
Used to ensure overall code is structured well, uses ArduinoBLE correctly and is consistent with the Noble/Node.js server example.
*/

#include <ArduinoBLE.h>
#include <Arduino_LSM6DS3.h>

#define BLE_UUID_ACCELEROMETER_SERVICE "23333333333333333333333333333337"
#define BLE_UUID_ACCELEROMETER_DATA "23333333333333333333333333330001"

#define BLE_DEVICE_NAME "Zehua2"
#define BLE_LOCAL_NAME "Zehua2"

BLEService accelerometerService(BLE_UUID_ACCELEROMETER_SERVICE);
BLEFloatCharacteristic accelerometerCharacteristicData(BLE_UUID_ACCELEROMETER_DATA, BLERead | BLENotify);

float x, y, z;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(300);
  while (!Serial);

  if (!IMU.begin()){
    Serial.println("Failed to initialize IMU!");
    while(1);
  }

  if (!BLE.begin()) {
    Serial.println("Starting Bluetooth® Low Energy module failed!");
    while (1);
  }


  BLE.setLocalName(BLE_LOCAL_NAME);
  BLE.setDeviceName("Zehua");
  BLE.setAdvertisedService(accelerometerService);
  accelerometerService.addCharacteristic(accelerometerCharacteristicData);
  BLE.addService(accelerometerService);

  BLE.advertise();
  Serial.println("Advertising!");
  
}

void loop() {
  // put your main code here, to run repeatedly:
  BLEDevice central = BLE.central();
  if (central) {
    Serial.println("Connected to central");
    Serial.println(central.address());

  }
  while (central.connected()) {
    if (IMU.accelerationAvailable()) {
      IMU.readAcceleration(x, y, z);
    }
    accelerometerCharacteristicData.writeValue(x);
    Serial.println(x);
  }

}
