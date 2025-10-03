CREATE DATABASE handloomnari;
USE handloomnari;

CREATE TABLE orders (
    sr_no INT AUTO_INCREMENT PRIMARY KEY,
    date_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    customer_name VARCHAR(255) NOT NULL,
    customer_address TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL
);
USE handloomnari;
CREATE TABLE cart_details (
    sr_no INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    rate DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(sr_no) ON DELETE CASCADE
);
USE handloomnari;
select*from orders;
select*from cart_details;





