USE lscustoms;


INSERT IGNORE INTO brand (brand_id, brand_name, brand_revenue, brand_creation_date, brand_creator, brand_creation_place)
VALUES (1, 'Porsche', 33.1, '1931-04-25', 'Ferdinand Porsche', 'Germany'),
(2, 'BMW', 143, '1916-03-07', 'Gustav Otto & Karl Friedrich Rapp', 'Germany'),
(3, 'Ferrari', 6, '1923-05-25', 'Enzo Ferrari', 'Italy'),
(4, 'Lamborghini', 1.95, '1963-05-07', 'Ferruccio Lamborghini', 'Italy'),
(5, 'Lancia', 0.73, '1906-11-29', 'Vincenzo Lancia', 'Italy'),
(6, 'McLaren', 0.34, '1985-12-02', 'Bruce McLaren', 'United Kingdom'),
(7, 'Renault', 46.4, '1899-02-25', 'Louis Renault', 'France'),
(8, 'Alpine', 0.19, '1955-06-01', 'Jean Rédélé', 'France'),
(9, 'Alfa Romeo', 189.5, '1910-06-24', 'Nicola Romeo', 'Italy'),
(10, 'Audi', 59.2, '1909-04-16', 'August Horch', 'Germany'),
(11, 'Nissan', 72.9, '1933-12-26', 'Yoshisuke Aikawa', 'Japan'),
(12, 'Toyota', 190.4, '1937-08-28', 'Kiichiro Toyoda', 'Japan');


INSERT IGNORE INTO store (store_id, store_name, store_director, store_city, store_country, store_address)
VALUES (1, 'LS Pest', 'Eszter Szabó', 'Budapest', 'Hungary', '31a, Ráday utca'),
(2, 'LS Buda', 'Gábor Kovács', 'Budapest', 'Hungary', '12, Fő utca'),
(3, 'LS Paris', 'Claire Moreau', 'Paris', 'France', '37, Avenue des Champs-Élysées'),
(4, 'LS Origins', 'Julien Fontanes', 'Bois-Le-Roi', 'France', '15, Avenue de la Forêt'),
(5, 'LS Colomiers', 'Gilbert Bortolotti', 'Colomiers', 'France', '25, Allée des Orientales'),
(6, 'LS Tokyo', 'Hiroshi Tanaka', 'Tokyo', 'Japan', '39, Ginza District'),
(7, 'LS Washington', 'Ethan Graham', 'Washington D.C.', 'USA', '1230 Wisconsin Avenue NW'),
(8, 'LS London', 'Jack Anderson', 'London', 'UK', '400 Oxford Street'),
(9, 'LS Casablanca', 'Omar El Mansouri', 'Casablanca', 'Morocco', '132 Boulevard de la Corniche'),
(10, 'LS Mumbai', 'Aisha Sharma', 'Mumbai', 'India', '43 Colaba Causeway');


INSERT IGNORE INTO car (brand_id, car_id, car_name, car_seat_num, car_creation_date, car_base_power, car_base_weight, car_base_price)
VALUES (1, 1, "911 996 4S", 4, "1997-06-17", 320, 1317, 41823),
(1, 2, "Carrera GT", 2, "2004-01-31", 603, 1380, 450000),
(2, 3, "M3 e30", 4, "1986-03-28", 197, 1165, 35682),
(3, 4, "F12berlinetta", 2, "2012-03-08", 730, 1630, 319995),
(4, 5, "Sesto Elemento", 2, "2010-10-02", 562, 999, 2735942),
(5, 6, "037 Stradale", 2, "1982-04-01", 202, 1170, 48734),
(6, 7, "Senna", 2, "2017-12-10", 789, 1374, 1051950),
(7, 8, "R5 turbo", 2, "1980-01-26", 160, 970, 53778),
(8, 9, "A110 (2017)", 2, "2017-12-15", 252, 1082, 49582),
(9, 10, "Giulia (952)", 5, "2015-06-01", 247, 1645, 37249),
(10, 11, "S6 C4", 5, "1995-12-15", 230, 1675, 26197),
(11, 12, "R35 GTR", 4, "2010-09-28", 523, 1735, 76294),
(12, 13, "GT86", 4, "2011-12-14", 204, 1230, 38247);


INSERT IGNORE INTO feature (feature_id, feature_name, feature_color, feature_added_power, feature_added_weight, feature_price)
VALUES (1, "Sport tires", NULL, 0, 0, 459),
(2, "Sport coilovers", NULL, 0, -3, 649),
(3, "Black racing steering wheel", "Black", 0, -2, 329),
(4, "AC Delete", NULL, 1, -28, 199),
(5, "Stock ECU Reprogramming", NULL, 45, 0, 439),
(6, "Aftermarket ECU Reprogramming", NULL, 80, 0, 1499),
(7, "Black sport seats", "Black", 0, -3, 349),
(8, "Gray sport seats", "Gray", 0, -3, 349),
(9, "Black racing seats", "Black", 0, -6, 729),
(10, "Gray racing seats", "Gray", 0, -6, 729),
(11, "High flowrate injectors", NULL, 17, 0, 519),
(12, "Black spoiler", "Black", 0, 2, 229),
(13, "White spoiler", "White", 0, 2, 229),
(14, "Green spoiler", "Green", 0, 2, 229),
(15, "Red spoiler", "Red", 0, 2, 229),
(16, "Blue spoiler", "Blue", 0, 2, 229),
(17, "Carbon spoiler", "Carbon", 0, 0.5, 399),
(18, "Aftermarket intake", NULL, 6, -1.4, 70);


ALTER TABLE conn_C_S AUTO_INCREMENT = 1;
INSERT IGNORE INTO conn_C_S (store_id, car_id)
VALUES (1,1), (1,3), (1,7), (1,9), (1,10), (1,12), (1,13),
(2,4), (2,3), (2,6), (2,9), (2,10), (2,11), (2,13),
(3,5), (3,2), (3,8), (3,9), (3,10), (3,12), (3,13),
(4,8), (4,2), (4,6), (4,9), (4,12), (4,13), (4,7), (4,8),
(5,1), (5,2), (5,3), (5,4), (5,8), (5,9), (5,10), (5,11),
(6,4), (6,6), (6,7), (6,9), (6,10), (6,12), (6,13),
(7,8), (7,3), (7,7), (7,9), (7,10), (7,13),
(8,1), (8,3), (8,7), (8,9), (8,10), (8,12), (8,5), 
(9,1), (9,3), (9,8), (9,9), (9,13),
(10,2), (10,4), (10,6), (10,9), (10,12), (10,13);

