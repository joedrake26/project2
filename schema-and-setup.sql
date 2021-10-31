-- Remove any existing database and user.
DROP DATABASE IF EXISTS bill_manager;
DROP USER IF EXISTS bill_manager_user@localhost;

-- Create bill manager database and user. Ensure Unicode is fully supported.
CREATE DATABASE bill_manager CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE USER bill_manager_user@localhost IDENTIFIED WITH mysql_native_password BY 'DoesThisWork26!';
GRANT ALL PRIVILEGES ON bill_manager.* TO bill_manager_user@localhost;

use bill_manager;
DROP TABLE IF EXISTS bill;

CREATE TABLE bill (
  id SERIAL PRIMARY KEY,
  firstname text,
  lastname text,
  billtype text,
  amount number
);
