DELETE FROM products;
DELETE FROM brands;
DELETE FROM clients;

INSERT INTO brands (id, name, code, picture)
	VALUES (1, 'Nike', '001', 'https://lh5.googleusercontent.com/-Q8jolvY4uUw/AAAAAAAAAAI/AAAAAAAANyU/dGOPoGTrAAU/s0-c-k-no-ns/photo.jpg');

INSERT INTO brands (id, name, code, picture)
	VALUES (2, 'Adidas', '002', 'https://lh4.googleusercontent.com/-VZ7LePo-9qk/AAAAAAAAAAI/AAAAAAAARBc/jWeNc1x-gcc/s0-c-k-no-ns/photo.jpg');

INSERT INTO brands (id, name, code, picture)
	VALUES (3, 'Puma', '003', 'https://lh6.googleusercontent.com/-w-OHvnFNMeQ/AAAAAAAAAAI/AAAAAAAAJRA/Egn_mGnm-a0/s0-c-k-no-ns/photo.jpg');

INSERT INTO brands (id, name, code, picture)
	VALUES (4, 'Brand 1', '004', null);

INSERT INTO products
	(name,stock,wholesalePrice, retailPrice, brand_id, currency,thumbnail,picture)
	VALUES ('Remera Hombre Negra', 10, '32','42', 1,'ARS','http://www.tenisglobal.com.ar/imagenes/ftp/Indumentaria%20HEAD/Remeras%20Alta%20HEAD/Remera%20HEAD%20Ryan/Remera%20Ryan%20Head%20I.jpg','http://www.tenisglobal.com.ar/imagenes/ftp/Indumentaria%20HEAD/Remeras%20Alta%20HEAD/Remera%20HEAD%20Ryan/Remera%20Ryan%20Head%20I.jpg');

INSERT INTO products
	(name,stock,wholesalePrice, retailPrice, brand_id, currency,thumbnail,picture)
	VALUES ('Remera Hombre Blanca', 10, '32','42', 2,'ARS','http://www.tenisglobal.com.ar/imagenes/ftp/Indumentaria%20HEAD/Remeras%20Club%20Branding%20HEAD%20HyM/Remera%20Head%20Branding/Remera%20HEAD%20Branding%20Celeste.jpg','http://www.tenisglobal.com.ar/imagenes/ftp/Indumentaria%20HEAD/Remeras%20Club%20Branding%20HEAD%20HyM/Remera%20Head%20Branding/Remera%20HEAD%20Branding%20Celeste.jpg');

INSERT INTO products
	(name,stock,wholesalePrice, retailPrice, brand_id, currency,thumbnail,picture)
	VALUES ('Remera Hombre Verde', 10, '32','42', 1,'ARS','http://www.tenisglobal.com.ar/imagenes/ftp/Indumentaria%20HEAD/Remeras%20Alta%20HEAD/Chomba%20HEAD%20Jackson/Chomba%20HEAD%20III.jpg','http://www.tenisglobal.com.ar/imagenes/ftp/Indumentaria%20HEAD/Remeras%20Alta%20HEAD/Chomba%20HEAD%20Jackson/Chomba%20HEAD%20III.jpg');

INSERT INTO products
	(name,stock,wholesalePrice, retailPrice, brand_id, currency,thumbnail,picture)
	VALUES ('Remera Hombre Roja', 10, '32','42', 1,'ARS','http://www.tenisglobal.com.ar/imagenes/ftp/Indumentaria%20HEAD/Remeras%20Alta%20HEAD/Chomba%20HEAD%20Jackson/Chomba%20HEAD%20I.jpg','http://www.tenisglobal.com.ar/imagenes/ftp/Indumentaria%20HEAD/Remeras%20Alta%20HEAD/Chomba%20HEAD%20Jackson/Chomba%20HEAD%20I.jpg');

INSERT INTO products
	(name,stock,wholesalePrice, retailPrice, brand_id, currency,thumbnail,picture)
	VALUES ('Remera Hombre Amarilla', 10, '32','42', 2,'ARS','http://www.modaydeporte.com.ar/wp-content/uploads/2009/01/Nike-Livestrong-Remera-Hombre.jpg','http://www.modaydeporte.com.ar/wp-content/uploads/2009/01/Nike-Livestrong-Remera-Hombre.jpg');

INSERT INTO products
	(name,stock,wholesalePrice, retailPrice, brand_id, currency,thumbnail,picture)
	VALUES ('Remera Mujer Rosa', 10, '32','42', 3,'ARS','http://mla-d2-p.mlstatic.com/aerobics-pilates-yoga-ropa-deportiva-571101-MLA20269099455_032015-Y.jpg?square=null','http://mla-d2-p.mlstatic.com/aerobics-pilates-yoga-ropa-deportiva-571101-MLA20269099455_032015-Y.jpg?square=null');

INSERT INTO products
	(name,stock,wholesalePrice, retailPrice, brand_id, currency,thumbnail,picture)
	VALUES ('Remera Mujer Negra', 10, '32','42', 3,'ARS','http://mla-s2-p.mlstatic.com/aerobics-pilates-yoga-ropa-deportiva-238501-MLA20363599848_072015-Y.jpg','http://mla-s2-p.mlstatic.com/aerobics-pilates-yoga-ropa-deportiva-238501-MLA20363599848_072015-Y.jpg');

INSERT INTO products
	(name,stock,wholesalePrice, retailPrice, brand_id, currency,thumbnail,picture)
	VALUES ('Remera Mujer Violeta', 10, '32','42', 4,'ARS','http://www.basset.com.ar/db_media/images/producto/215_chica.png','http://www.basset.com.ar/db_media/images/producto/215_chica.png');

INSERT INTO products
	(name,stock,wholesalePrice, retailPrice, brand_id, currency,thumbnail,picture)
	VALUES ('Remera Mujer Roja', 10, '32','42', 2,'ARS','http://mla-d2-p.mlstatic.com/indumentaria-tenis-padel-squash-22213-MLA7679972295_012015-Y.jpg?square=null','http://mla-d2-p.mlstatic.com/indumentaria-tenis-padel-squash-22213-MLA7679972295_012015-Y.jpg?square=null');

INSERT INTO products
	(name,stock,wholesalePrice, retailPrice, brand_id, currency,thumbnail,picture)
	VALUES ('Zepatillas Hombre Negra', 10, '32','42', 1,'ARS','http://eyhombres.com/wp-content/uploads/2013/06/zapatillas-deportivas-hombre1.jpg','http://eyhombres.com/wp-content/uploads/2013/06/zapatillas-deportivas-hombre1.jpg');

INSERT INTO products
	(name,stock,wholesalePrice, retailPrice, brand_id, currency,thumbnail,picture)
	VALUES ('Zepatillas Hombre Azul', 10, '32','42', 1,'ARS','http://www.zapatos.org/files/2012/04/zapatilla-nike-free-run.jpeg','http://www.zapatos.org/files/2012/04/zapatilla-nike-free-run.jpeg');

INSERT INTO products
	(name,stock,wholesalePrice, retailPrice, brand_id, currency,thumbnail,picture)
	VALUES ('Zepatillas Hombre Verde', 10, '32','42', 3,'ARS','http://modadeportiva.com.ar/wp-content/uploads/2015/06/Nike-Zapatillas-deportivas-para-hombre-Fingertrap-Max-2015.jpg','http://modadeportiva.com.ar/wp-content/uploads/2015/06/Nike-Zapatillas-deportivas-para-hombre-Fingertrap-Max-2015.jpg');

INSERT INTO products
	(name,stock,wholesalePrice, retailPrice, brand_id, currency,thumbnail,picture)
	VALUES ('Zepatillas Hombre Azul', 10, '32','42', 1,'ARS','http://i0.wp.com/www.fabricastextiles.com.ar/wp-content/uploads/2015/03/ZAPATILLAS-DEPORTIVAS-HOMBRE.jpg','http://i0.wp.com/www.fabricastextiles.com.ar/wp-content/uploads/2015/03/ZAPATILLAS-DEPORTIVAS-HOMBRE.jpg');

INSERT INTO products
	(name,stock,wholesalePrice, retailPrice, brand_id, currency,thumbnail,picture)
	VALUES ('Zepatillas Mujer Blanca', 10, '32','42', 3,'ARS','http://mla-s1-p.mlstatic.com/zapatillas-402111-MLA20479312379_112015-Y.jpg','http://mla-s1-p.mlstatic.com/zapatillas-402111-MLA20479312379_112015-Y.jpg');

INSERT INTO products
	(name,stock,wholesalePrice, retailPrice, brand_id, currency,thumbnail,picture)
	VALUES ('Zepatillas Mujer Negra', 10, '32','42', 1,'ARS','https://www.decathlon.es/media/834/8342041/classic_0ececb5aeda84a7591346cc74c07a02d.jpg','https://www.decathlon.es/media/834/8342041/classic_0ececb5aeda84a7591346cc74c07a02d.jpg');

INSERT INTO products
	(name,stock,wholesalePrice, retailPrice, brand_id, currency,thumbnail,picture)
	VALUES ('Zepatillas Mujer Verde', 10, '32','42', 2,'ARS','http://i51.twenga.com/moda/deportivas-mujer/nike-zapatillas-free-og-tp_4266409531051542559f.jpg','http://i51.twenga.com/moda/deportivas-mujer/nike-zapatillas-free-og-tp_4266409531051542559f.jpg');

INSERT INTO products
	(name,stock,wholesalePrice, retailPrice, brand_id, currency,thumbnail,picture)
	VALUES ('Zepatillas Mujer Celeste', 10, '32','42', 3,'ARS','http://i0.wp.com/www.fabricastextiles.com.ar/wp-content/uploads/2015/03/ZAPATILLAS-DEPORTIVAS-HOMBRE.jpg','http://i0.wp.com/www.fabricastextiles.com.ar/wp-content/uploads/2015/03/ZAPATILLAS-DEPORTIVAS-HOMBRE.jpg');

INSERT INTO products
	(name,stock,wholesalePrice, retailPrice, brand_id, currency,thumbnail,picture)
	VALUES ('Pantalon Mujer Blanca', 10, '32','42', 2,'ARS','http://static.kiabi.es/images/pantalon-deportivo-de-felpa-gris-claro-mujer-tn226_1_lpr1.jpg','http://static.kiabi.es/images/pantalon-deportivo-de-felpa-gris-claro-mujer-tn226_1_lpr1.jpg');

INSERT INTO products
	(name,stock,wholesalePrice, retailPrice, brand_id, currency,thumbnail,picture)
	VALUES ('Pantalon Mujer Negra', 10, '32','42', 2,'ARS','http://pumaecom.scene7.com/is/image/PUMAECOM/568923_02_PNA?$PUMA_GRID$','http://pumaecom.scene7.com/is/image/PUMAECOM/568923_02_PNA?$PUMA_GRID$');

INSERT INTO clients
	(name,lastname,cuil,address,lon,lat,email,phone_number,avatar,thumbnail)
	VALUES ('Dario','Seminara','XXXXXXXXX','Evergreen Terrace 777','32.3','992.3','darios3@gmail.com','1234-5678','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_client_male_person_user_work_sport_beard_team_glasses-512.png','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_client_male_person_user_work_sport_beard_team_glasses-128.png');

INSERT INTO clients
	(name,lastname,cuil,address,lon,lat,email,phone_number,avatar,thumbnail)
	VALUES ('Matias','Piano','XXXXXXXXX','Fake Street 123','31.3','932.3','matias@piano.org','1234-5678','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_boss_client-512.png','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_boss_client-128.png');

INSERT INTO clients
	(name,lastname,cuil,address,lon,lat,email,phone_number,avatar,thumbnail)
	VALUES ('Pablo','Lucadei','ZZZZZZZZZ','Fake Street 123','31.3','932.3','pablo@mail.org','1234-5678','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_player-512.png','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_player-128.png');

INSERT INTO clients
	(name,lastname,cuil,address,lon,lat,email,phone_number,avatar,thumbnail)
	VALUES ('Guido','Laghi','XXXXXXXXX','Fake Street 123','31.3','932.3','matias@piano.org','1234-5678','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_boss_client_hat_santa-512.png','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_boss_client_hat_santa-128.png');

INSERT INTO clients
	(name,lastname,cuil,address,lon,lat,email,phone_number,avatar,thumbnail)
	VALUES ('Damian','Arias','ZZZZZZZZZ','Fake Street 123','31.3','932.3','pablo@mail.org','1234-5678','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_boss_client_male_person_user_hat-512.png','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_boss_client_male_person_user_hat-128.png');

INSERT INTO clients
	(name,lastname,cuil,address,lon,lat,email,phone_number,avatar,thumbnail)
	VALUES ('Carla','Nieves','XXXXXXXXX','Evergreen Terrace 777','32.3','992.3','darios3@gmail.com','1234-5678','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_account_client_male_person_user_beautiful_girl_woman-512.png','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_account_client_male_person_user_beautiful_girl_woman-128.png');

INSERT INTO clients
	(name,lastname,cuil,address,lon,lat,email,phone_number,avatar,thumbnail)
	VALUES ('Odalis','Ciríaco','XXXXXXXXX','Fake Street 123','31.3','932.3','matias@piano.org','1234-5678','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_account_client_male_person_user_artist_beautiful_girl_woman_celebrity-512.png','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_account_client_male_person_user_artist_beautiful_girl_woman_celebrity-128.png');

INSERT INTO clients
	(name,lastname,cuil,address,lon,lat,email,phone_number,avatar,thumbnail)
	VALUES ('Laura','Gisela','ZZZZZZZZZ','Fake Street 123','31.3','932.3','pablo@mail.org','1234-5678','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_boss_client-512.png','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_boss_client-128.png');

INSERT INTO clients
	(name,lastname,cuil,address,lon,lat,email,phone_number,avatar,thumbnail)
	VALUES ('Alexandra','Juliana','XXXXXXXXX','Evergreen Terrace 777','32.3','992.3','darios3@gmail.com','1234-5678','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_client_male_person_user_work_sport_beard_team_glasses-512.png','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_client_male_person_user_work_sport_beard_team_glasses-128.png');

INSERT INTO clients
	(name,lastname,cuil,address,lon,lat,email,phone_number,avatar,thumbnail)
	VALUES ('Marcio','Yessenia','XXXXXXXXX','Fake Street 123','31.3','932.3','matias@piano.org','1234-5678','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_account_client_male_person_user_beautiful_girl_woman_business_female_housewife_1-512.png','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_account_client_male_person_user_beautiful_girl_woman_business_female_housewife_1-128.png');

INSERT INTO clients
	(name,lastname,cuil,address,lon,lat,email,phone_number,avatar,thumbnail)
	VALUES ('Luisina','Alcides','ZZZZZZZZZ','Fake Street 123','31.3','932.3','pablo@mail.org','1234-5678','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_player-128.png','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_player-128.png');

INSERT INTO clients
	(name,lastname,cuil,address,lon,lat,email,phone_number,avatar,thumbnail)
	VALUES ('Claudia','Felicidad','XXXXXXXXX','Evergreen Terrace 777','32.3','992.3','darios3@gmail.com','1234-5678','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_client_male_person_user_work_sport_beard_team_glasses-128.png','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_client_male_person_user_work_sport_beard_team_glasses-128.png');

INSERT INTO clients
	(name,lastname,cuil,address,lon,lat,email,phone_number,avatar,thumbnail)
	VALUES ('Eduardo','Concepción','XXXXXXXXX','Fake Street 123','31.3','932.3','matias@piano.org','1234-5678','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_boss_client-128.png','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_boss_client-128.png');

INSERT INTO clients
	(name,lastname,cuil,address,lon,lat,email,phone_number,avatar,thumbnail)
	VALUES ('Heliodoro','Basilio','ZZZZZZZZZ','Fake Street 123','31.3','932.3','pablo@mail.org','1234-5678','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_player-128.png','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_player-128.png');

INSERT INTO clients
	(name,lastname,cuil,address,lon,lat,email,phone_number,avatar,thumbnail)
	VALUES ('Pascual','Haroldo','XXXXXXXXX','Evergreen Terrace 777','32.3','992.3','darios3@gmail.com','1234-5678','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_client_male_person_user_work_sport_beard_team_glasses-128.png','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_client_male_person_user_work_sport_beard_team_glasses-128.png');

INSERT INTO clients
	(name,lastname,cuil,address,lon,lat,email,phone_number,avatar,thumbnail)
	VALUES ('Horacio','Sara','XXXXXXXXX','Fake Street 123','31.3','932.3','matias@piano.org','1234-5678','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_boss_client-128.png','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_boss_client-128.png');

INSERT INTO clients
	(name,lastname,cuil,address,lon,lat,email,phone_number,avatar,thumbnail)
	VALUES ('Ernesto','Natalia','ZZZZZZZZZ','Fake Street 123','31.3','932.3','pablo@mail.org','1234-5678','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_player-128.png','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_player-128.png');

INSERT INTO clients
	(name,lastname,cuil,address,lon,lat,email,phone_number,avatar,thumbnail)
	VALUES ('Ileana','Verónica','XXXXXXXXX','Evergreen Terrace 777','32.3','992.3','darios3@gmail.com','1234-5678','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_client_male_person_user_work_sport_beard_team_glasses-128.png','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_client_male_person_user_work_sport_beard_team_glasses-128.png');

INSERT INTO clients
	(name,lastname,cuil,address,lon,lat,email,phone_number,avatar,thumbnail)
	VALUES ('Marino','Lupita','XXXXXXXXX','Fake Street 123','31.3','932.3','matias@piano.org','1234-5678','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_boss_client-128.png','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_boss_client-128.png');

INSERT INTO clients
	(name,lastname,cuil,address,lon,lat,email,phone_number,avatar,thumbnail)
	VALUES ('Rebeca','Lorenza','ZZZZZZZZZ','Fake Street 123','31.3','932.3','pablo@mail.org','1234-5678','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_player-128.png','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_player-128.png');

INSERT INTO clients
	(name,lastname,cuil,address,lon,lat,email,phone_number,avatar,thumbnail)
	VALUES ('Ezequiel','Tercero','XXXXXXXXX','Evergreen Terrace 777','32.3','992.3','darios3@gmail.com','1234-5678','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_client_male_person_user_work_sport_beard_team_glasses-128.png','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_client_male_person_user_work_sport_beard_team_glasses-128.png');

INSERT INTO clients
	(name,lastname,cuil,address,lon,lat,email,phone_number,avatar,thumbnail)
	VALUES ('Nuria','Mayra','XXXXXXXXX','Fake Street 123','31.3','932.3','matias@piano.org','1234-5678','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_boss_client-128.png','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_boss_client-128.png');

INSERT INTO clients
	(name,lastname,cuil,address,lon,lat,email,phone_number,avatar,thumbnail)
	VALUES ('César','Valero','ZZZZZZZZZ','Fake Street 123','31.3','932.3','pablo@mail.org','1234-5678','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_player-128.png','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_player-128.png');

INSERT INTO clients
	(name,lastname,cuil,address,lon,lat,email,phone_number,avatar,thumbnail)
	VALUES ('Teresita','Julia','XXXXXXXXX','Evergreen Terrace 777','32.3','992.3','darios3@gmail.com','1234-5678','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_client_male_person_user_work_sport_beard_team_glasses-128.png','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_client_male_person_user_work_sport_beard_team_glasses-128.png');

INSERT INTO clients
	(name,lastname,cuil,address,lon,lat,email,phone_number,avatar,thumbnail)
	VALUES ('Josefa','Venceslás','XXXXXXXXX','Fake Street 123','31.3','932.3','matias@piano.org','1234-5678','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_boss_client-128.png','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_boss_client-128.png');

INSERT INTO clients
	(name,lastname,cuil,address,lon,lat,email,phone_number,avatar,thumbnail)
	VALUES ('Adelita','Bartolomé','ZZZZZZZZZ','Fake Street 123','31.3','932.3','pablo@mail.org','1234-5678','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_player-128.png','https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_player-128.png');

