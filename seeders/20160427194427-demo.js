'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      */
      var products = function() {
        return queryInterface.bulkInsert('products', [
            {
              "id": 18,
              "name": "Pantalon Mujer Blanca",
              "code": null,
              "description": "Texto de descripción para el producto",
              "thumbnail": "http://static.kiabi.es/images/pantalon-deportivo-de-felpa-gris-claro-mujer-tn226_1_lpr1.jpg",
              "picture": "http://static.kiabi.es/images/pantalon-deportivo-de-felpa-gris-claro-mujer-tn226_1_lpr1.jpg",
              "stock": 96,
              "currency": "ARS",
              "status": null,
              "wholesale_price": 400,
              "retail_price": 463,
              "brand_id": 3
            },
            {
              "id": 19,
              "name": "Pantalon Mujer Negra",
              "code": null,
              "description": "Texto de descripción para el producto",
              "thumbnail": "http://pumaecom.scene7.com/is/image/PUMAECOM/568923_02_PNA?$PUMA_GRID$",
              "picture": "http://pumaecom.scene7.com/is/image/PUMAECOM/568923_02_PNA?$PUMA_GRID$",
              "stock": 7,
              "currency": "ARS",
              "status": null,
              "wholesale_price": 1000,
              "retail_price": 1300,
              "brand_id": 2
            },
            {
              "id": 20,
              "name": "Remera de Mujer con titulo MUY pero MUY LARGO MAL!!!!!",
              "code": null,
              "description": "Remera de Mujer con titulo MUY pero MUY LARGO MAL!!!!! Para pruebas de titulos largos.",
              "thumbnail": "http://thumbs.us.buscape.com/T200x200/__13.897766-1ef11.jpg",
              "picture": "http://basset.com.ar/db_media/images/producto/170_ampliacion.png",
              "stock": 99,
              "currency": "ARS",
              "status": null,
              "wholesale_price": 15,
              "retail_price": 20,
              "brand_id": 1
            },
            {
              "id": 5,
              "name": "Remera Hombre Amarilla",
              "code": null,
              "description": "Texto de descripción para el producto",
              "thumbnail": "http://www.modaydeporte.com.ar/wp-content/uploads/2009/01/Nike-Livestrong-Remera-Hombre.jpg",
              "picture": "http://www.modaydeporte.com.ar/wp-content/uploads/2009/01/Nike-Livestrong-Remera-Hombre.jpg",
              "stock": 0,
              "currency": "ARS",
              "status": null,
              "wholesale_price": 32,
              "retail_price": 42,
              "brand_id": 2
            },
            {
              "id": 2,
              "name": "Remera Hombre Blanca",
              "code": null,
              "description": "Texto de descripción para el producto",
              "thumbnail": "http://www.tenisglobal.com.ar/imagenes/ftp/Indumentaria%20HEAD/Remeras%20Club%20Branding%20HEAD%20HyM/Remera%20Head%20Branding/Remera%20HEAD%20Branding%20Celeste.jpg",
              "picture": "http://www.tenisglobal.com.ar/imagenes/ftp/Indumentaria%20HEAD/Remeras%20Club%20Branding%20HEAD%20HyM/Remera%20Head%20Branding/Remera%20HEAD%20Branding%20Celeste.jpg",
              "stock": 289,
              "currency": "ARS",
              "status": null,
              "wholesale_price": 32,
              "retail_price": 42,
              "brand_id": 2
            },
            {
              "id": 1,
              "name": "Remera Hombre Negra",
              "code": null,
              "description": "Texto de descripción para el producto",
              "thumbnail": "http://www.tenisglobal.com.ar/imagenes/ftp/Indumentaria%20HEAD/Remeras%20Alta%20HEAD/Remera%20HEAD%20Ryan/Remera%20Ryan%20Head%20I.jpg",
              "picture": "http://www.tenisglobal.com.ar/imagenes/ftp/Indumentaria%20HEAD/Remeras%20Alta%20HEAD/Remera%20HEAD%20Ryan/Remera%20Ryan%20Head%20I.jpg",
              "stock": 0,
              "currency": "ARS",
              "status": null,
              "wholesale_price": 32,
              "retail_price": 42,
              "brand_id": 1
            },
            {
              "id": 4,
              "name": "Remera Hombre Roja",
              "code": null,
              "description": "Texto de descripción para el producto más largo y largo y largo que describe el item.",
              "thumbnail": "http://www.tenisglobal.com.ar/imagenes/ftp/Indumentaria%20HEAD/Remeras%20Alta%20HEAD/Chomba%20HEAD%20Jackson/Chomba%20HEAD%20I.jpg",
              "picture": "http://www.tenisglobal.com.ar/imagenes/ftp/Indumentaria%20HEAD/Remeras%20Alta%20HEAD/Chomba%20HEAD%20Jackson/Chomba%20HEAD%20I.jpg",
              "stock": 0,
              "currency": "ARS",
              "status": null,
              "wholesale_price": 32,
              "retail_price": 42,
              "brand_id": 1
            },
            {
              "id": 3,
              "name": "Remera Hombre Verde",
              "code": null,
              "description": "Texto de descripción para el producto",
              "thumbnail": "http://www.tenisglobal.com.ar/imagenes/ftp/Indumentaria%20HEAD/Remeras%20Alta%20HEAD/Chomba%20HEAD%20Jackson/Chomba%20HEAD%20III.jpg",
              "picture": "http://www.tenisglobal.com.ar/imagenes/ftp/Indumentaria%20HEAD/Remeras%20Alta%20HEAD/Chomba%20HEAD%20Jackson/Chomba%20HEAD%20III.jpg",
              "stock": 480,
              "currency": "ARS",
              "status": null,
              "wholesale_price": 32,
              "retail_price": 42,
              "brand_id": 1
            },
            {
              "id": 7,
              "name": "Remera Mujer Negra",
              "code": null,
              "description": null,
              "thumbnail": "http://mla-s2-p.mlstatic.com/aerobics-pilates-yoga-ropa-deportiva-238501-MLA20363599848_072015-Y.jpg",
              "picture": "http://mla-s2-p.mlstatic.com/aerobics-pilates-yoga-ropa-deportiva-238501-MLA20363599848_072015-Y.jpg",
              "stock": 0,
              "currency": "ARS",
              "status": null,
              "wholesale_price": 32,
              "retail_price": 42,
              "brand_id": 3
            },
            {
              "id": 9,
              "name": "Remera Mujer Roja",
              "code": null,
              "description": null,
              "thumbnail": "http://mla-d2-p.mlstatic.com/indumentaria-tenis-padel-squash-22213-MLA7679972295_012015-Y.jpg?square=null",
              "picture": "http://mla-d2-p.mlstatic.com/indumentaria-tenis-padel-squash-22213-MLA7679972295_012015-Y.jpg?square=null",
              "stock": 1,
              "currency": "ARS",
              "status": null,
              "wholesale_price": 32,
              "retail_price": 42,
              "brand_id": 2
            },
            {
              "id": 6,
              "name": "Remera Mujer Rosa",
              "code": null,
              "description": null,
              "thumbnail": "http://mla-d2-p.mlstatic.com/aerobics-pilates-yoga-ropa-deportiva-571101-MLA20269099455_032015-Y.jpg?square=null",
              "picture": "http://mla-d2-p.mlstatic.com/aerobics-pilates-yoga-ropa-deportiva-571101-MLA20269099455_032015-Y.jpg?square=null",
              "stock": 0,
              "currency": "ARS",
              "status": null,
              "wholesale_price": 32,
              "retail_price": 42,
              "brand_id": 3
            },
            {
              "id": 8,
              "name": "Remera Mujer Violeta",
              "code": null,
              "description": null,
              "thumbnail": "http://www.basset.com.ar/db_media/images/producto/215_chica.png",
              "picture": "http://www.basset.com.ar/db_media/images/producto/215_chica.png",
              "stock": 9,
              "currency": "ARS",
              "status": null,
              "wholesale_price": 32,
              "retail_price": 42,
              "brand_id": 2
            },
            {
              "id": 11,
              "name": "Zepatillas Hombre Azul",
              "code": null,
              "description": null,
              "thumbnail": "http://www.zapatos.org/files/2012/04/zapatilla-nike-free-run.jpeg",
              "picture": "http://www.zapatos.org/files/2012/04/zapatilla-nike-free-run.jpeg",
              "stock": 9,
              "currency": "ARS",
              "status": null,
              "wholesale_price": 32,
              "retail_price": 42,
              "brand_id": 1
            },
            {
              "id": 13,
              "name": "Zepatillas Hombre Azul",
              "code": null,
              "description": null,
              "thumbnail": "http://i0.wp.com/www.fabricastextiles.com.ar/wp-content/uploads/2015/03/ZAPATILLAS-DEPORTIVAS-HOMBRE.jpg",
              "picture": "http://i0.wp.com/www.fabricastextiles.com.ar/wp-content/uploads/2015/03/ZAPATILLAS-DEPORTIVAS-HOMBRE.jpg",
              "stock": 7,
              "currency": "ARS",
              "status": null,
              "wholesale_price": 32,
              "retail_price": 42,
              "brand_id": 1
            },
            {
              "id": 10,
              "name": "Zepatillas Hombre Negra",
              "code": null,
              "description": null,
              "thumbnail": "http://eyhombres.com/wp-content/uploads/2013/06/zapatillas-deportivas-hombre1.jpg",
              "picture": "http://eyhombres.com/wp-content/uploads/2013/06/zapatillas-deportivas-hombre1.jpg",
              "stock": 4,
              "currency": "ARS",
              "status": null,
              "wholesale_price": 32,
              "retail_price": 42,
              "brand_id": 1
            },
            {
              "id": 12,
              "name": "Zepatillas Hombre Verde",
              "code": null,
              "description": null,
              "thumbnail": "http://modadeportiva.com.ar/wp-content/uploads/2015/06/Nike-Zapatillas-deportivas-para-hombre-Fingertrap-Max-2015.jpg",
              "picture": "http://modadeportiva.com.ar/wp-content/uploads/2015/06/Nike-Zapatillas-deportivas-para-hombre-Fingertrap-Max-2015.jpg",
              "stock": 1,
              "currency": "ARS",
              "status": null,
              "wholesale_price": 32,
              "retail_price": 42,
              "brand_id": 3
            },
            {
              "id": 14,
              "name": "Zepatillas Mujer Blanca",
              "code": null,
              "description": null,
              "thumbnail": "http://mla-s1-p.mlstatic.com/zapatillas-402111-MLA20479312379_112015-Y.jpg",
              "picture": "http://mla-s1-p.mlstatic.com/zapatillas-402111-MLA20479312379_112015-Y.jpg",
              "stock": 7,
              "currency": "ARS",
              "status": null,
              "wholesale_price": 32,
              "retail_price": 42,
              "brand_id": 3
            },
            {
              "id": 17,
              "name": "Zepatillas Mujer Celeste",
              "code": null,
              "description": null,
              "thumbnail": "http://i0.wp.com/www.fabricastextiles.com.ar/wp-content/uploads/2015/03/ZAPATILLAS-DEPORTIVAS-HOMBRE.jpg",
              "picture": "http://i0.wp.com/www.fabricastextiles.com.ar/wp-content/uploads/2015/03/ZAPATILLAS-DEPORTIVAS-HOMBRE.jpg",
              "stock": 3,
              "currency": "ARS",
              "status": null,
              "wholesale_price": 32,
              "retail_price": 42,
              "brand_id": 3
            },
            {
              "id": 15,
              "name": "Zepatillas Mujer Negra",
              "code": null,
              "description": null,
              "thumbnail": "https://www.decathlon.es/media/834/8342041/classic_0ececb5aeda84a7591346cc74c07a02d.jpg",
              "picture": "https://www.decathlon.es/media/834/8342041/classic_0ececb5aeda84a7591346cc74c07a02d.jpg",
              "stock": 6,
              "currency": "ARS",
              "status": null,
              "wholesale_price": 32,
              "retail_price": 42,
              "brand_id": 1
            },
            {
              "id": 16,
              "name": "Zepatillas Mujer Verde",
              "code": null,
              "description": null,
              "thumbnail": "http://i51.twenga.com/moda/deportivas-mujer/nike-zapatillas-free-og-tp_4266409531051542559f.jpg",
              "picture": "http://i51.twenga.com/moda/deportivas-mujer/nike-zapatillas-free-og-tp_4266409531051542559f.jpg",
              "stock": 9,
              "currency": "ARS",
              "status": null,
              "wholesale_price": 32,
              "retail_price": 42,
              "brand_id": 2
            }
          ], {});

      };

      var brands = function() {
        return queryInterface.bulkInsert('brands', [
          {
            "id": 2,
            "name": "Adidas",
            "picture": "https://lh4.googleusercontent.com/-VZ7LePo-9qk/AAAAAAAAAAI/AAAAAAAARBc/jWeNc1x-gcc/s0-c-k-no-ns/photo.jpg",
            "code": "002"
          },
          {
            "id": 1,
            "name": "Nike",
            "picture": "https://lh5.googleusercontent.com/-Q8jolvY4uUw/AAAAAAAAAAI/AAAAAAAANyU/dGOPoGTrAAU/s0-c-k-no-ns/photo.jpg",
            "code": "001"
          },
          {
            "id": 3,
            "name": "Puma",
            "picture": "https://lh6.googleusercontent.com/-w-OHvnFNMeQ/AAAAAAAAAAI/AAAAAAAAJRA/Egn_mGnm-a0/s0-c-k-no-ns/photo.jpg",
            "code": "009"
          }], {});
      };

      var clients = function() {
        return queryInterface.bulkInsert('clients', [
            {
            "name": "Luisina",
            "lastname": "Alcides",
            "avatar": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_player-128.png",
            "thumbnail": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_player-128.png",
            "cuil": "20-29123877-5",
            "address": "Monroe 2244",
            "phone_number": "4234-5679",
            "email": "pablo@mail.org",
            "lat": -34.5575,
            "lon": -58.4585,
            "seller_type": "retail"
            },
            {
            "name": "Damian",
            "lastname": "Arias",
            "avatar": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_boss_client_male_person_user_hat-512.png",
            "thumbnail": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_boss_client_male_person_user_hat-128.png",
            "cuil": "20-29128977-5",
            "address": "Franklin D. Roosevelt 2420",
            "phone_number": "4504-5678",
            "email": "damianarias@mail.org",
            "lat": -34.5578,
            "lon": -58.4609,
            "seller_type": "retail"
            },
            {
            "name": "Adelita",
            "lastname": "Bartolomé",
            "avatar": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_player-128.png",
            "thumbnail": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_player-128.png",
            "cuil": "20-33128977-5",
            "address": "Avenida Monroe 2391",
            "phone_number": "4199-5678",
            "email": "pablo@mail.org",
            "lat": -34.5581,
            "lon": -58.4596,
            "seller_type": "retail"
            },
            {
            "name": "Heliodoro",
            "lastname": "Basilio",
            "avatar": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_player-128.png",
            "thumbnail": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_player-128.png",
            "cuil": "20-33477112-2",
            "address": "Doctor Pedro Ignacio Rivera 2430",
            "phone_number": "4234-7116",
            "email": "pablo@mail.org",
            "lat": -34.5571,
            "lon": -58.4616,
            "seller_type": "retail"
            },
            {
            "name": "Odalis",
            "lastname": "Ciríaco",
            "avatar": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_account_client_male_person_user_artist_beautiful_girl_woman_celebrity-512.png",
            "thumbnail": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_account_client_male_person_user_artist_beautiful_girl_woman_celebrity-128.png",
            "cuil": "20-29491977-5",
            "address": "Blanco Encalada 2311",
            "phone_number": "4500-5678",
            "email": "matias@piano.org",
            "lat": -34.5588,
            "lon": -58.4583,
            "seller_type": "wholesale"
            },
            {
            "name": "Eduardo",
            "lastname": "Concepción",
            "avatar": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_boss_client-128.png",
            "thumbnail": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_boss_client-128.png",
            "cuil": "20-34412776-1",
            "address": "Blanco Encalada 2851",
            "phone_number": "1234-5678",
            "email": "matias@piano.org",
            "lat": -34.5617,
            "lon": -58.4633,
            "seller_type": "retail"
            },
            {
            "name": "Claudia",
            "lastname": "Felicidad",
            "avatar": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_client_male_person_user_work_sport_beard_team_glasses-128.png",
            "thumbnail": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_client_male_person_user_work_sport_beard_team_glasses-128.png",
            "cuil": "20-36887131-5",
            "address": "Av Cabildo 2492",
            "phone_number": "1234-5678",
            "email": "darios3@gmail.com",
            "lat": -34.5586,
            "lon": -58.4598,
            "seller_type": "retail"
            },
            {
            "name": "Laura",
            "lastname": "Gisela",
            "avatar": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_boss_client-512.png",
            "thumbnail": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_boss_client-128.png",
            "cuil": "20-30301225-5",
            "address": "Juramento 2439",
            "phone_number": "1234-5678",
            "email": "pablo@mail.org",
            "lat": -34.5624,
            "lon": -58.4573,
            "seller_type": "wholesale"
            },
            {
            "name": "Pascual",
            "lastname": "Haroldo",
            "avatar": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_client_male_person_user_work_sport_beard_team_glasses-128.png",
            "thumbnail": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_client_male_person_user_work_sport_beard_team_glasses-128.png",
            "cuil": "20-23456712-5",
            "address": "Mendoza 2897",
            "phone_number": "1234-5678",
            "email": "pascualharoldo@email.com",
            "lat": -34.5637,
            "lon": -58.462,
            "seller_type": "retail"
            },
            {
            "name": "Teresita",
            "lastname": "Julia",
            "avatar": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_client_male_person_user_work_sport_beard_team_glasses-128.png",
            "thumbnail": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_client_male_person_user_work_sport_beard_team_glasses-128.png",
            "cuil": "20-31567100-5",
            "address": "La Pampa 2629",
            "phone_number": "1234-5678",
            "email": "darios3@gmail.com",
            "lat": -34.5663,
            "lon": -58.4567,
            "seller_type": "retail"
            },
            {
            "name": "Alexandra",
            "lastname": "Juliana",
            "avatar": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_client_male_person_user_work_sport_beard_team_glasses-512.png",
            "thumbnail": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_client_male_person_user_work_sport_beard_team_glasses-128.png",
            "cuil": "20-28776100-5",
            "address": "Echeverría 2771",
            "phone_number": "1234-5678",
            "email": "darios3@gmail.com",
            "lat": -34.5649,
            "lon": -58.4592,
            "seller_type": "retail"
            },
            {
            "name": "Guido",
            "lastname": "Laghi",
            "avatar": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_boss_client_hat_santa-512.png",
            "thumbnail": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_boss_client_hat_santa-128.png",
            "cuil": "20-17876331-5",
            "address": "Echeverría 3002",
            "phone_number": "1234-5678",
            "email": "matias@piano.org",
            "lat": -34.5665,
            "lon": -58.4618,
            "seller_type": "retail"
            },
            {
            "name": "Jorge Tengo un nombre muy pero muy largo",
            "lastname": "Lopez El que toca el timbre y sale corriendo",
            "avatar": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_boss_client-128.png",
            "thumbnail": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_boss_client-128.png",
            "cuil": "20-23465322-5",
            "address": "La Pampa 1267",
            "phone_number": "",
            "email": "matias@piano.org",
            "lat": -34.558,
            "lon": -58.4427,
            "seller_type": "retail"
            },
            {
            "name": "Rebeca",
            "lastname": "Lorenza",
            "avatar": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_player-128.png",
            "thumbnail": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_player-128.png",
            "cuil": "20-14376331-5",
            "address": "General Enrique Martínez 2206",
            "phone_number": "1234-5678",
            "email": "pablo@mail.org",
            "lat": -34.5675,
            "lon": -58.4699,
            "seller_type": "retail"
            },
            {
            "name": "Pablo",
            "lastname": "Lucadei",
            "avatar": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_player-512.png",
            "thumbnail": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_player-128.png",
            "cuil": "20-23457532-5",
            "address": "Echeverría 1432",
            "phone_number": "1234-5678",
            "email": "pablo@mail.org",
            "lat": -34.5572,
            "lon": -58.4461,
            "seller_type": "retail"
            },
            {
            "name": "Nuria",
            "lastname": "Mayra",
            "avatar": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_boss_client-128.png",
            "thumbnail": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_boss_client-128.png",
            "cuil": "20-39842112-2",
            "address": "Migueletes 2039",
            "phone_number": "1234-5678",
            "email": "matias@piano.org",
            "lat": -34.5564,
            "lon": -58.4464,
            "seller_type": "retail"
            },
            {
            "name": "Ernesto",
            "lastname": "Natalia",
            "avatar": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_player-128.png",
            "thumbnail": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_player-128.png",
            "cuil": "20-31769812-2",
            "address": "Artilleros 2135",
            "phone_number": "1234-5678",
            "email": "pablo@mail.org",
            "lat": -34.5542,
            "lon": -58.4448,
            "seller_type": "retail"
            },
            {
            "name": "Carla",
            "lastname": "Nieves",
            "avatar": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_account_client_male_person_user_beautiful_girl_woman-512.png",
            "thumbnail": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_account_client_male_person_user_beautiful_girl_woman-128.png",
            "cuil": "20-31788871-2",
            "address": "Migueletes 1957",
            "phone_number": "1234-5678",
            "email": "darios3@gmail.com",
            "lat": -34.5574,
            "lon": -58.4455,
            "seller_type": "retail"
            },
            {
            "name": "Matias",
            "lastname": "Piano",
            "avatar": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_boss_client-512.png",
            "thumbnail": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_boss_client-128.png",
            "cuil": "20-27334712-5",
            "address": "Migueletes 1870",
            "phone_number": "1234-5678",
            "email": "matias@piano.org",
            "lat": -34.5582,
            "lon": -58.4448,
            "seller_type": "retail"
            },
            {
            "name": "Horacio",
            "lastname": "Sara",
            "avatar": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_boss_client-128.png",
            "thumbnail": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_boss_client-128.png",
            "cuil": "20-27666712-5",
            "address": "Arcos 1967",
            "phone_number": "1234-5678",
            "email": "matias@piano.org",
            "lat": -34.5616,
            "lon": -58.4527,
            "seller_type": "wholesale"
            },
            {
            "name": "Dario",
            "lastname": "Seminara",
            "avatar": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_client_male_person_user_work_sport_beard_team_glasses-512.png",
            "thumbnail": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_client_male_person_user_work_sport_beard_team_glasses-128.png",
            "cuil": "XXXXXXXXX",
            "address": "Evergreen Terrace 777",
            "phone_number": null,
            "email": "darios3@gmail.com",
            "lat": 992.3,
            "lon": 32.4,
            "seller_type": "retail"
            },
            {
            "name": "Ezequiel",
            "lastname": "Tercero",
            "avatar": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_client_male_person_user_work_sport_beard_team_glasses-128.png",
            "thumbnail": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_client_male_person_user_work_sport_beard_team_glasses-128.png",
            "cuil": "XXXXXXXXX",
            "address": "Evergreen Terrace 777",
            "phone_number": "1234-5678",
            "email": "darios3@gmail.com",
            "lat": 992.3,
            "lon": 32.3,
            "seller_type": "retail"
            },
            {
            "name": "César",
            "lastname": "Valero",
            "avatar": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_player-128.png",
            "thumbnail": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_player-128.png",
            "cuil": "ZZZZZZZZZ",
            "address": "Fake Street 123",
            "phone_number": "1234-5678",
            "email": "pablo@mail.org",
            "lat": 932.3,
            "lon": 31.3,
            "seller_type": "retail"
            },
            {
            "name": "Josefa",
            "lastname": "Venceslás",
            "avatar": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_boss_client-128.png",
            "thumbnail": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_boss_client-128.png",
            "cuil": "XXXXXXXXX",
            "address": "Fake Street 123",
            "phone_number": "1234-5678",
            "email": "matias@piano.org",
            "lat": 932.3,
            "lon": 31.3,
            "seller_type": "retail"
            },
            {
            "name": "Ileana",
            "lastname": "Verónica",
            "avatar": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_client_male_person_user_work_sport_beard_team_glasses-128.png",
            "thumbnail": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_client_male_person_user_work_sport_beard_team_glasses-128.png",
            "cuil": "XXXXXXXXX",
            "address": "Evergreen Terrace 777",
            "phone_number": "1234-5678",
            "email": "darios3@gmail.com",
            "lat": -34.6037,
            "lon": -58.3816,
            "seller_type": "retail"
            },
            {
            "name": "Marcio",
            "lastname": "Yessenia",
            "avatar": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_account_client_male_person_user_beautiful_girl_woman_business_female_housewife_1-512.png",
            "thumbnail": "https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_account_client_male_person_user_beautiful_girl_woman_business_female_housewife_1-128.png",
            "cuil": "XXXXXXXXX",
            "address": "Fake Street 123",
            "phone_number": "1234-5678",
            "email": "matias@piano.org",
            "lat": 932.3,
            "lon": 31.3,
            "seller_type": "retail"
            }], {});
      };
      return clients()
        .then(brands)
        .then(products);
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      
    */
    return queryInterface.bulkDelete('clients', null, {})
      .then(function() {
        return queryInterface.bulkDelete('products', null, {})
      })
      .then(function() {
        return queryInterface.bulkDelete('brands', null, {})
      });
  }
};

