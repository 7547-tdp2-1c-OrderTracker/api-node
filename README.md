# MockServer
## installation
```sh
$ npm install
```

## running
```sh
$ npm start
```

## Uso

node server.js --port 8090 --path default

Todos los parametros son opcionales, y los que se muestran en 
el ejemplo son los default

El path es el directorio a donde va a buscar los datos
y los busca como "products.json" para los productos y 
"clients.json" para los clients, este path SIEMPRE es relativo al
path donde esta el script server.js

Estos son los endpoints disponibles:

* http://127.0.0.1:8090/v1/products

	Devuelve la lista de productos

* http://127.0.0.1:8090/v1/products/:id

	Devuelve los datos de un producto dado el :id

* http://127.0.0.1:8090/v1/clients

	Devuelve la lista de clients

* http://127.0.0.1:8090/v1/clients/:id

	Devuelve los datos de un client dado el :id

## Incluye ademas:
* Servicio estatico de imagenes (los productos devuelven imagenes cuya url se puede usar 
directamente para acceder a la imagen)
* Paginacion con los parametros limit y offset
* Datos separados en un archivo (hay que editar los .json)

## NO incluye
* Filtros
* Diferenciacion de datos que se dan en el detalle y en la lista (muestra los mismos datos
en la lista /products y en /products/:id de un producto)

## Editing mocks
Inside defaults directory is one json file for every entity.
- clients.json
- products.json