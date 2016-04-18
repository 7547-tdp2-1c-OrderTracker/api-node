DROP TABLE order_entries;
DROP TABLE orders;
DROP TABLE products;
DROP TABLE clients;
DROP TABLE brands;

CREATE TABLE brands (
	id serial primary key, 
	name varchar(255),
	code varchar(255),
	picture varchar(225)
);

CREATE TABLE products (
	id serial primary key, 
	brand_id integer references brands(id),
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
	thumbnail varchar(255),
	cuil varchar(255),
	address varchar(255),
	phone_number varchar(32),
	email varchar(255),
	lat real,
	lon real,
	seller_type varchar(16)
);

CREATE TABLE orders (
	id serial primary key, 
	delivery_date timestamp,
	date_created timestamp,
	status varchar(32) DEFAULT 'draft',
	total_price integer DEFAULT 0,
	client_id integer references clients(id),
	vendor_id integer
);

CREATE TABLE order_entries (
	id serial primary key, 
	order_id integer references orders(id),
	product_id integer references products(id),
	name varchar(255), /* el nombre del producto */
	brand_name varchar(255),
	thumbnail varchar(255),
	quantity integer,
	unit_price integer,
	currency varchar(8)
);
