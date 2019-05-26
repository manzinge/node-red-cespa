# node-red-CESpa

## Scootify 

This project is about implementing smart services to an electrical scooter.
It's a nodeRED based project and there will be nodes implemented to it like charge,
lon/lat, pressure, temp/humidity, acceleration and torque.
The data from the scooter is provided via an rest api.
So getting the data from the cloud and building up the services.
The services wich are implemented in this project are called "theft detection", "intelliCharge" and the Dashboard.

### Needed Signals

#### Lon/Lat
- Longitude
- Latitude
- Altitude

#### Charge
- Charge State

#### Pressure

#### Temp/Humidity
- Temperature
- Humidity

#### Acceleration
- ACC_X
- ACC_Y
- ACC_Z

#### Torque

### Description of the smart services

#### theft detection
So "theft detection" is basically a movement detection. It alerts the owner when the scooter is changing position without him knowing.

#### intelliCharge
It's a smart charging system which predicts the optimal time to charge the scooter (e.g. over night because of low energy costs). You can set the time, when the scooter should be ready to drive, so it will charge until that time (Battery Charging Schedule).

#### Dashboard
Displays the critical information about the system.It enables the user to trigger control application (e.g. live tracking).
