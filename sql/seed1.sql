DELETE FROM products;
INSERT INTO products 
	(name, code, image_path, description, stock, status, retail_price, wholesale_price) values 
	('product 1', '0001', '/default.png', 'test product', 100, 0, 499, 599);

INSERT INTO products 
	(name, code, image_path, description, stock, status, retail_price, wholesale_price) values 
	('product 2', '0002', '/default.png', 'test product 2', 50, 0, 199, 399);
