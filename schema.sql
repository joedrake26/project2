use bills;
DROP TABLE IF EXISTS bill;

CREATE TABLE bill (
  id SERIAL PRIMARY KEY,
  firstname text,
  lastname text,
  billtype text,
  amount int
);

INSERT INTO bill(firstname, lastname, billtype, amount)
VALUES("joe", "drake", "rent", 50);
