# Electricity-Tarrif

Contains api to Create, Read, Update and Delete Electricity tarrifs based on current slabs

# MYSQL SETUP

# Creating a DB in MYSQL

* mysql -u root -p
* CREATE DATABASE electricity_slabs;
* SHOW DATABASES;
* USE electricity_slabs;

# Creating tables in MYSQL
```
CREATE TABLE elecricity_tarrifs (
  id              INT unsigned NOT NULL AUTO_INCREMENT, 
  status            VARCHAR(150) NOT NULL,               
  totalResults    INT NOT NULL,
  type           VARCHAR(150) NOT NULL,    
  cutOffLimit    INT NOT NULL,                               
  PRIMARY KEY     (id)                                  
  );
```  
  
```
CREATE TABLE fixed_charges (
      id INT unsigned NOT NULL AUTO_INCREMENT,
      tarrifid INT unsigned NOT NULL,
      FOREIGN KEY (tarrifid) REFERENCES elecricity_tarrifs(id),
      maxLimit INT NOT NULL,
      fixedCharges INT NOT NULL,
      PRIMARY KEY (id)                                 
      ); 
 ```     
```      
CREATE TABLE unit_charges (
      id INT unsigned NOT NULL AUTO_INCREMENT,
      maxlimitid INT unsigned NOT NULL,
      FOREIGN KEY (maxlimitid) REFERENCES fixed_charges(id),
      unit    INT NOT NULL,   
      chargePerUnit    FLOAT NOT NULL,
      PRIMARY KEY (id)
     );
  ```   
     
 # Response structure   (splitRate array object is present in develop branch)
 
```      
{
    "id": 68,
    "status": "ok",
    "totalResults": 4,
    "type": "Low Tension - Domestic (I-A)",
    "cutOffLimit": 501,
    "biMonthlyConsumption": [
        {
            "id": 154,
            "tarrifid": 68,
            "maxLimit": 100,
            "fixedCharges": 0,
            "splitRate": [
                {
                    "id": 204,
                    "maxlimitid": 154,
                    "unit": 100,
                    "chargePerUnit": 0
                }
            ]
        },
        {
            "id": 155,
            "tarrifid": 68,
            "maxLimit": 200,
            "fixedCharges": 20,
            "splitRate": [
                {
                    "id": 205,
                    "maxlimitid": 155,
                    "unit": 100,
                    "chargePerUnit": 0
                },
                {
                    "id": 206,
                    "maxlimitid": 155,
                    "unit": 100,
                    "chargePerUnit": 1.5
                }
            ]
        },
        {
            "id": 156,
            "tarrifid": 68,
            "maxLimit": 500,
            "fixedCharges": 30,
            "splitRate": [
                {
                    "id": 207,
                    "maxlimitid": 156,
                    "unit": 100,
                    "chargePerUnit": 0
                },
                {
                    "id": 208,
                    "maxlimitid": 156,
                    "unit": 100,
                    "chargePerUnit": 2
                },
                {
                    "id": 209,
                    "maxlimitid": 156,
                    "unit": 300,
                    "chargePerUnit": 3
                }
            ]
        },
        {
            "id": 157,
            "tarrifid": 68,
            "maxLimit": 501,
            "fixedCharges": 50,
            "splitRate": [
                {
                    "id": 210,
                    "maxlimitid": 157,
                    "unit": 100,
                    "chargePerUnit": 0
                },
                {
                    "id": 211,
                    "maxlimitid": 157,
                    "unit": 100,
                    "chargePerUnit": 3.5
                },
                {
                    "id": 212,
                    "maxlimitid": 157,
                    "unit": 300,
                    "chargePerUnit": 4.6
                },
                {
                    "id": 213,
                    "maxlimitid": 157,
                    "unit": 501,
                    "chargePerUnit": 6.6
                }
            ]
        }
    ]
}
```
