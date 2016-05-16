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

En todos los casos, instalar las dependencias con npm
npm install

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

## Comandos para migraciones

Crear migrate
sequelize migration:create --name xxx

Correr migraciones
sequelize db:migrate

Crear seed
sequelize seed:create --name demo

Correr seeds
sequelize db:seed:all

NOTA: hay que instalar sequelize-cli globalmente con npm install -g

## Dump/restore de la DB

Hacer el backup
heroku pg:backups capture --remote powerful
curl -o ldump/20160516.dump `heroku pg:backups public-url --remote powerful`

Restaurar el backup
heroku pg:backups restore --remote heroku 'http://7547-tdp2-1c-ordertracker.github.io/api-node/dump/20160516.dump' DATABASE_URL

## Endpoints implementados

* CRUD de productos
* CRUD de clients
* CRUD de marcas
* CRUD de productos

