//Including necessary libraries
#include <SevSeg.h>
#include <OneWire.h>
#include <DS18B20.h>

//Instantiating necessary objects
SevSeg sevseg;  
OneWire oneWire(A0); 
DS18B20 sensor(&oneWire); 

//Variables for the interval
unsigned long previousMillis = 0;
const long interval = 5000;

void setup() {
  //Seven segment display setup
  byte numDigits = 4;
  byte digitPins[] = {2, 3, 4, 5};
  byte segmentPins[] = {6, 7, 8, 9, 10, 11, 12, 13};
  bool resistorsOnSegments = false; // 'false' means resistors are on digit pins
  byte hardwareConfig = COMMON_ANODE; // See README.md for options
  bool updateWithDelays = false; // Default 'false' is Recommended
  bool leadingZeros = false; // Use 'true' if you'd like to keep the leading zeros
  bool disableDecPoint = false; // Use 'true' if your decimal point doesn't exist or isn't connected. Then, you only need to specify 7 segmentPins[]

  sevseg.begin(hardwareConfig, numDigits, digitPins, segmentPins, resistorsOnSegments,
  updateWithDelays, leadingZeros, disableDecPoint);

  //Sensor setup
  sensor.begin();
  sensor.setResolution(12);
  Serial.begin(9600);

}

float temp = 0;
void loop() {
  sevseg.refreshDisplay();
  unsigned long currentMillis = millis();
  if(currentMillis - previousMillis >= interval && sensor.isConversionComplete()){
    previousMillis = currentMillis;
    temp = sensor.getTempC();
    sevseg.setNumberF(temp,2);
    //Send on serial
    Serial.print(temp);
    Serial.print("|");
    //
    sensor.requestTemperatures();
  }
  
}
