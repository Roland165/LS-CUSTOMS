
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


ALTER TABLE conn_CS_F AUTO_INCREMENT = 1;
INSERT IGNORE INTO conn_CS_F (C_S_id, feat_id)
VALUES (1,1), (2,1), (3,1), (4,1), (5,1), (6,1), (7,1), (8,1), (9,1),
(10,1), (11,1), (12,1), (13,1), (14,1), (15,1), (16,1), (17,1), (18,1), (19,1),
(20,1), (21,1), (22,1), (23,1), (24,1), (25,1), (26,1), (27,1), (28,1), (29,1),
(30,1), (31,1), (32,1), (33,1), (34,1), (35,1), (36,1), (37,1), (38,1), (39,1),
(40,1), (41,1), (42,1), (43,1), (44,1), (45,1), (46,1), (47,1), (48,1), (49,1),
(50,1), (51,1), (52,1), (53,1), (54,1), (55,1), (56,1), (57,1), (58,1), (59,1),
(60,1), (61,1), (62,1), (63,1), (64,1), (65,1), (66,1), (67,1), (68,1),

(3,17), (4,17), (6,17),
(11,17), (14,17), (16,17), (18,17), (19,17),
(20,17), (21,17), (23,17), (25,17), (26,17), (27,17),
(30,17), (32,17), (33,17), (35,17), (36,17), (38,17),
(40,17), (41,17), (42,17), (43,17), (44,17), (48,17),
(50,17), (51,17), (54,17), (56,17), (59,17),
(61,17), (62,17), (64,17), (65,17), (66,17), (67,17), (68,17),

(3,12), (4,12),
(11,17), (14,12), (16,12), (19,12),
(20,12), (23,12), (26,12),
(30,12), (32,12), (35,12), (36,12), (38,12),
(40,12), (41,12), (42,12), (43,12), (44,12), (48,12),
(50,12), (54,12), (56,12),
(62,12), (64,12), (65,12), (66,12), (68,12),

(3,13), (4,13),
(11,13), (16,13), (19,13),
(23,13), (27,13),
(30,13), (32,13), (35,13), (38,13),
(40,13), 
(54,13), (56,13),
(61,13), (62,13), (67,13), (68,13),

(3,14), (4,14),
(16,14), (19,14),
(23,14), (27,14),
(30,14), (32,14),
(40,14), 
(54,14), (56,14),
(62,14), (67,14),

(3,15), (4,15),
(14,15), (16,15),
(20,15), (23,15), (26,15),
(32,15), (35,15), (36,15), (38,15),
(41,15), (42,15), (43,15), (44,15),
(50,15), (54,15),
(62,15), (65,15), (66,15), (68,15),

(3,16), (4,16),
(11,16), (14,16), (16,16), (19,16),
(20,16), (23,16),
(30,16), (35,16), (36,16), (38,16),
(40,16), (41,16), (42,16),
(50,16), (54,16), (56,16),
(62,16), (64,16), (68,16),

(3,2), (6,2),
(11,2), (16,2), (19,2),
(20,2), (23,2), (26,2), 
(30,2), (33,2), (36,2), (38,2),
(40,2), (41,2), (42,2), (43,2), (44,2), (48,2),
(50,2), (54,2), (59,2),
(62,2), (66,2), (68,2),

(3,3), (4,3),
(11,3), (14,3), (16,3), (19,3),
(20,3), (23,3), (26,3),
(30,3), (32,3), (35,3), (36,3), (38,3),
(40,3), (41,3), (42,3), (43,3), (44,3), (48,3),
(50,3), (54,3), (56,3),
(62,3), (64,3), (65,3), (66,3), (68,3),

(1,5), (2,5), (3,5), (4,5), (5,5), (7,5), (8,5), (9,5),
(10,5), (12,5), (13,5), (14,5), (17,5), (18,5), (19,5),
(20,5), (21,5), (22,5), (23,5), (24,5), (25,5), (26,5), (27,5), (28,5),
(30,5), (31,5), (33,5), (34,5), (36,5), (37,5), (38,5), (39,5),
(40,5), (41,5), (42,5), (43,5), (44,5), (45,5), (46,5), (47,5), (48,5), (49,5),
(51,5), (53,5), (54,5), (55,5), (56,5), (57,5), (58,5), (59,5),
(60,5), (61,5), (62,5), (63,5), (64,5), (65,5), (67,5), (68,5),

(3,6), (4,6), (5,6), (7,6), (8,6),
(10,6), (12,6), (13,6), (17,6), (18,6), (19,6),
(20,6), (21,6), (22,6), (24,6), (25,6), 
(30,6), (31,6), (33,6), (37,6), (38,6), (39,6),
(40,6), (42,6), (43,6), (44,6), (46,6), (48,6), (49,6),
(51,6), (53,6), (55,6), (56,6), (57,6), (58,6), (59,6),
(60,6), (61,6), (62,6), (64,6), (65,6), (67,6),

(1,4), (2,4), (3,4), (4,4), (5,4), (7,4), (8,4), (9,4),
(10,4), (12,4), (13,4), (14,4), (17,4), (18,4), (19,4),
(20,4), (21,4), (22,4), (23,4), (24,4), (25,4), (26,4), (27,4), (28,4),
(30,4), (31,4), (33,4), (34,4), (36,4), (37,4), (38,4), (39,4),
(40,4), (41,4), (42,4), (43,4), (44,4), (45,4), (46,4), (47,4), (48,4), (49,4),
(51,4), (53,4), (54,4), (55,4), (56,4), (57,4), (58,4), (59,4),
(60,4), (61,4), (62,4), (63,4), (64,4), (65,4), (67,4), (68,4),

(3,2), (6,2),
(11,2), (16,2), (19,2),
(20,2), (23,2), (26,2), 
(30,2), (33,2), (36,2), (38,2),
(40,2), (41,2), (42,2), (43,2), (44,2), (48,2),
(50,2), (54,2), (59,2),
(62,2), (66,2), (68,2),

(1,7), (2,7), (3,7), (4,7), (5,7), (7,7), (8,7), (9,7),
(10,7), (12,7), (13,7), (14,7), (17,7), (18,7), (19,7),
(20,7), (21,7), (22,7), (23,7), (24,7), (25,7), (26,7), (27,7), (28,7),
(30,7), (31,7), (33,7), (34,7), (36,7), (37,7), (38,7), (39,7),
(40,7), (41,7), (42,7), (43,7), (44,7), (45,7), (46,7), (47,7), (48,7), (49,7),
(51,7), (53,7), (54,7), (55,7), (56,7), (57,7), (58,7), (59,7),
(60,7), (61,7), (62,7), (63,7), (64,7), (65,7), (67,7), (68,7),

(1,8), (2,8), (3,8), (4,8), (5,8), (7,8), (8,8), (9,8),
(10,8), (12,8), (13,8), (14,8), (17,8), (18,8), (19,8),
(20,8), (21,8), (22,8), (23,8), (24,8), (25,8), (26,8), (27,8), (28,8),
(30,8), (31,8), (33,8), (34,8), (36,8), (37,8), (38,8), (39,8),
(40,8), (41,8), (42,8), (43,8), (44,8), (45,8), (46,8), (47,8), (48,8), (49,8),
(51,8), (53,8), (54,8), (55,8), (56,8), (57,8), (58,8), (59,8),
(60,8), (61,8), (62,8), (63,8), (64,8), (65,8), (67,8), (68,8),

(1,9), (2,9), (3,9), (4,9), (5,9), (6,9), (7,9), (8,9), (9,9),
(10,9), (11,9), (12,9), (13,9), (14,9), (15,9), (16,9), (17,9), (18,9), (19,9),
(20,9), (21,9), (22,9), (23,9), (24,9), (25,9), (26,9), (27,9), (28,9), (29,9),
(30,9), (31,9), (32,9), (33,9), (34,9), (35,9), (36,9), (37,9), (38,9), (39,9),
(40,9), (41,9), (42,9), (43,9), (44,9), (45,9), (46,9), (47,9), (48,9), (49,9),
(50,9), (51,9), (52,9), (53,9), (54,9), (55,9), (56,9), (57,9), (58,9), (59,9),
(60,9), (61,9), (62,9), (63,9), (64,9), (65,9), (66,9), (67,9), (68,9),

(1,10), (2,10), (3,10), (4,10), (5,10), (7,10), (8,10), (9,10),
(10,10), (12,10), (13,10), (14,10), (17,10), (18,10), (19,10),
(20,10), (21,10), (22,10), (23,10), (24,10), (25,10), (26,10), (27,10), (28,10),
(30,10), (31,10), (33,10), (34,10), (36,10), (37,10), (38,10), (39,10),
(40,10), (41,10), (42,10), (43,10), (44,10), (45,10), (46,10), (47,10), (48,10), (49,10),
(51,10), (53,10), (54,10), (55,10), (56,10), (57,10), (58,10), (59,10),
(60,10), (61,10), (62,10), (63,10), (64,10), (65,10), (67,10), (68,10),

(3,11), (4,11), (5,11), (7,11), (8,11),
(10,11), (12,11), (13,11), (17,11), (18,11), (19,11),
(20,11), (21,11), (22,11), (24,11), (25,11), 
(30,11), (31,11), (33,11), (37,11), (38,11), (39,11),
(40,11), (42,11), (43,11), (44,11), (46,11), (48,11), (49,11),
(51,11), (53,11), (55,11), (56,11), (57,11), (58,11), (59,11),
(60,11), (61,11), (62,11), (64,11), (65,11), (67,11),

(1,18), (2,18), (3,18), (4,18), (5,18), (7,18), (8,18), (9,18),
(10,18), (12,18), (13,18), (14,18), (17,18), (18,18), (19,18),
(20,18), (21,18), (22,18), (23,18), (24,18), (25,18), (26,18), (27,18), (28,18),
(30,18), (31,18), (33,18), (34,18), (36,18), (37,18), (38,18), (39,18),
(40,18), (41,18), (42,18), (43,18), (44,18), (45,18), (46,18), (47,18), (48,18), (49,18),
(51,18), (53,18), (54,18), (55,18), (56,18), (57,18), (58,18), (59,18),
(60,18), (61,18), (62,18), (63,18), (64,18), (65,18), (67,18), (68,18);

ALTER TABLE users AUTO_INCREMENT = 1;
INSERT IGNORE INTO users(user_created, user_name, user_email, user_role, user_pass)
VALUES (now(), 'admin', 'admin@gmail.com', 'ADMIN', sha2(concat(now(), 'admin'), 224)),
(now(), 'user', 'user@gmail.com', 'USER', sha2(concat(now(), 'user'), 224));
