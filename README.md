# Server node

## installation
```sh
$ npm install
```

## running
```sh
$ npm start
```

## Uso

### Correrlo directamente usando node

Asignar la base de datos a una variable de entorno
export DATABASE_URL="postgresql://user:secret@host:port/databaseName"

Ejecutar usando node (testeado en 0.12.X)
node server.js --port 8090

### Correrlo con heroku

Crear un archivo .env local con este contenido:

DATABASE_URL=postgresql://user:secret@host:port/databaseName

Ejecutar usando heroku
heroku local

## Endpoints implementados

* CRUD de productos
* CRUD de clients
* CRUD de marcas

