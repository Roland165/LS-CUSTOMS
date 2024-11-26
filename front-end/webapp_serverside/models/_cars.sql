

CREATE DATABASE if not exists lscustoms;
USE lscustoms;

DROP TABLE if exists conn_CS_F;
DROP TABLE if exists conn_C_S;
DROP TABLE if exists feature;
DROP TABLE if exists store;
DROP TABLE if exists car;
DROP TABLE if exists brand;
DROP TABLE if exists users;

CREATE TABLE users (
                       user_id int auto_increment primary key,
                       user_created datetime,
                       user_name varchar(100) unique,
                       user_email varchar(100) unique,
                       user_role varchar(100),
                       user_pass varchar(100)
);

CREATE TABLE brand (
                       brand_id int auto_increment primary key,
                       brand_name varchar(100)
);

CREATE TABLE car (
                     car_id int auto_increment primary key,
                     brand_id int,
                     car_name varchar(100),
                     car_seat_num int,
                     car_creation_date date,
                     car_base_power int,
                     car_base_weight int,
                     car_base_price int,
                     CONSTRAINT fk_car_brand FOREIGN KEY (brand_id) REFERENCES brand(brand_id)
);

CREATE TABLE store (
                       store_id int auto_increment primary key,
                       store_name varchar(100),
                       store_address varchar(255)
);

CREATE TABLE conn_C_S (
                          C_S_id int auto_increment primary key,
                          car_id int,
                          store_id int,
                          CONSTRAINT fk_conn_car FOREIGN KEY (car_id) REFERENCES car(car_id),
                          CONSTRAINT fk_conn_store FOREIGN KEY (store_id) REFERENCES store(store_id)
);

CREATE TABLE feature (
                         feature_id int auto_increment primary key,
                         feature_name varchar(100),
                         feature_color varchar(50),
                         feature_added_power int,
                         feature_added_weight decimal(5,2),
                         feature_price int
);

CREATE TABLE conn_CS_F (
                           CS_F_id int auto_increment primary key,
                           C_S_id int,
                           feat_id int,
                           CONSTRAINT fk_conn_cs FOREIGN KEY (C_S_id) REFERENCES conn_C_S(C_S_id),
                           CONSTRAINT fk_conn_feature FOREIGN KEY (feat_id) REFERENCES feature(feature_id)
);

INSERT INTO brand (brand_id, brand_name) VALUES
                                             (1, 'Porsche'),
                                             (2, 'BMW'),
                                             (3, 'Ferrari'),
                                             (4, 'Lamborghini'),
                                             (5, 'Lancia'),
                                             (6, 'McLaren'),
                                             (7, 'Renault'),
                                             (8, 'Alpine'),
                                             (9, 'Alfa Romeo'),
                                             (10, 'Audi'),
                                             (11, 'Nissan'),
                                             (12, 'Toyota');

INSERT IGNORE INTO car (brand_id, car_id, car_name, car_seat_num, car_creation_date, car_base_power, car_base_weight, car_base_price)
VALUES (1, 1, '911 996 4S', 4, '1997-06-17', 320, 1317, 41823),
       (1, 2, 'Carrera GT', 2, '2004-01-31', 603, 1380, 450000),
       (2, 3, 'M3 e30', 4, '1986-03-28', 197, 1165, 35682),
       (3, 4, 'F12berlinetta', 2, '2012-03-08', 730, 1630, 319995),
       (4, 5, 'Sesto Elemento', 2, '2010-10-02', 562, 999, 2735942),
       (5, 6, '037 Stradale', 2, '1982-04-01', 202, 1170, 48734),
       (6, 7, 'Senna', 2, '2017-12-10', 789, 1374, 1051950),
       (7, 8, 'R5 turbo', 2, '1980-01-26', 160, 970, 53778),
       (8, 9, 'A110 (2017)', 2, '2017-12-15', 252, 1082, 49582),
       (9, 10, 'Giulia (952)', 5, '2015-06-01', 247, 1645, 37249),
       (10, 11, 'S6 C4', 5, '1995-12-15', 230, 1675, 26197),
       (11, 12, 'R35 GTR', 4, '2010-09-28', 523, 1735, 76294),
       (12, 13, 'GT86', 4, '2011-12-14', 204, 1230, 38247);

INSERT IGNORE INTO feature (feature_id, feature_name, feature_color, feature_added_power, feature_added_weight, feature_price)
VALUES (1, 'Sport tires', NULL, 0, 0, 459),
       (2, 'Sport coilovers', NULL, 0, -3, 649),
       (3, 'Black racing steering wheel', 'Black', 0, -2, 329),
       (4, 'AC Delete', NULL, 1, -28, 199),
       (5, 'Stock ECU Reprogramming', NULL, 45, 0, 439),
       (6, 'Aftermarket ECU Reprogramming', NULL, 80, 0, 1499),
       (7, 'Black sport seats', 'Black', 0, -3, 349),
       (8, 'Gray sport seats', 'Gray', 0, -3, 349),
       (9, 'Black racing seats', 'Black', 0, -6, 729),
       (10, 'Gray racing seats', 'Gray', 0, -6, 729),
       (11, 'High flowrate injectors', NULL, 17, 0, 519),
       (12, 'Black spoiler', 'Black', 0, 2, 229),
       (13, 'White spoiler', 'White', 0, 2, 229),
       (14, 'Green spoiler', 'Green', 0, 2, 229),
       (15, 'Red spoiler', 'Red', 0, 2, 229),
       (16, 'Blue spoiler', 'Blue', 0, 2, 229),
       (17, 'Carbon spoiler', 'Carbon', 0, 0.5, 399),
       (18, 'Aftermarket intake', NULL, 6, -1.4, 70);

INSERT INTO store (store_name, store_address) VALUES
                                                  ('LS Customs Los Santos', '1 Los Santos Street, Los Santos'),
                                                  ('LS Customs Paleto Bay', '2 Paleto Bay Road, Paleto Bay'),
                                                  ('LS Customs Sandy Shores', '3 Sandy Shores Avenue, Sandy Shores');

-- Add some connections between cars and stores
INSERT INTO conn_C_S (car_id, store_id) VALUES
                                            (1, 1), (1, 2), (2, 1), (3, 1), (3, 3), (4, 2),
                                            (5, 1), (6, 2), (7, 3), (8, 1), (9, 2), (10, 3);

-- Add some features to cars in stores
INSERT INTO conn_CS_F (C_S_id, feat_id)
SELECT cs.C_S_id, f.feature_id
FROM conn_C_S cs
         CROSS JOIN feature f
WHERE (cs.car_id + f.feature_id) % 3 = 0
LIMIT 20;

SET sql_mode = 'ONLY_FULL_GROUP_BY';

DROP VIEW if exists totalExtraPriceForCars;
DROP VIEW if exists carsWithTotalPrices;
DROP VIEW if exists extrasPerCar;
DROP VIEW if exists extrasPerBrand;
DROP VIEW if exists fancyCars;

CREATE VIEW totalExtraPriceForCars AS
SELECT cs.car_id, SUM(f.feature_price) as totalExtraPrice
FROM conn_C_S cs
         JOIN conn_CS_F csf ON cs.C_S_id = csf.C_S_id
         JOIN feature f ON csf.feat_id = f.feature_id
GROUP BY cs.car_id;

CREATE VIEW carsWithTotalPrices AS
SELECT c.*,
       c.car_base_price + IFNULL(t.totalExtraPrice, 0) as car_totalprice
FROM car c
         LEFT JOIN totalExtraPriceForCars t ON c.car_id = t.car_id;

CREATE VIEW extrasPerCar AS
SELECT cs.car_id, COUNT(DISTINCT csf.feat_id) as numberOfFeatures
FROM conn_C_S cs
         JOIN conn_CS_F csf ON cs.C_S_id = csf.C_S_id
GROUP BY cs.car_id;

CREATE VIEW extrasPerBrand AS
SELECT c.brand_id, AVG(e.numberOfFeatures) as avgNumberOfFeatures
FROM car c
         JOIN extrasPerCar e ON c.car_id = e.car_id
GROUP BY c.brand_id;

CREATE VIEW fancyCars AS
SELECT c.car_id
FROM car c
         LEFT JOIN extrasPerCar e ON c.car_id = e.car_id
         LEFT JOIN extrasPerBrand eb ON c.brand_id = eb.brand_id
WHERE IFNULL(e.numberOfFeatures, 0) >= IFNULL(eb.avgNumberOfFeatures, 0);