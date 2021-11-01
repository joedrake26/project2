DROP DATABASE IF EXISTS bills;
DROP USER IF EXISTS manager_user@localhost;

CREATE DATABASE bills CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE USER manager_user@localhost IDENTIFIED WITH mysql_native_password BY 'REDACTED';
GRANT ALL PRIVILEGES ON bills.* TO 'manager_user'@'localhost';
