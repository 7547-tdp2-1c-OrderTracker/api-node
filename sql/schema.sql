DROP TABLE products;
DROP TABLE clients;
DROP TABLE brands;

CREATE TABLE brands (
	id serial primary key,
	name varchar(255),
	code varchar(255),
	image_path varchar(255)
);

CREATE TABLE products (
	id serial primary key, 
	brand_id integer references brands (id),
	name varchar(255),
	code varchar(255),
	image_path varchar(255),
	description varchar(255),
	stock integer,
	status integer,
	retail_price integer,
	wholesale_price integer
);

CREATE TABLE clients (
	id serial primary key, 
	name varchar(255),
	lastname varchar(255),
	image_path varchar(255),
	cuil varchar(255),
	address varchar(255),
	phone varchar(255),
	email varchar(255),
	latitude real,
	longitude real
);
