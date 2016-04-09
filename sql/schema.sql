DROP TABLE products;
DROP TABLE clients;

CREATE TABLE products (
	id serial primary key, 
	brand varchar(255),
	name varchar(255),
	code varchar(255),
	picture varchar(255),
	thumbnail varchar(255),
	description varchar(255),
	stock integer,
	status integer,
	wholesale_price integer,
	retail_price integer,
	currency varchar(4)
);

CREATE TABLE clients (
	id serial primary key, 
	name varchar(255),
	lastname varchar(255),
	avatar varchar(255),
	cuil varchar(255),
	address varchar(255),
	phone_number varchar(32),
	email varchar(255),
	lat real,
	lon real
);
