DELETE FROM products;
INSERT INTO products 
	(name, code, thumbnail, picture, description, stock, status, retail_price, wholesale_price) values 
	('product 1', '0001', '/default.png', '/default.png', 'test product', 100, 0, 599, 499);

INSERT INTO products 
	(name, code, thumbnail, picture, description, stock, status, retail_price, wholesale_price) values 
	('product 2', '0002', '/default.png', '/default.png', 'test product 2', 50, 0, 499, 399);
