const express = require("express");
const service = express();
service.use((request, response, next) => {
    response.set('Access-Control-Allow-Origin', '*');
    next();
});
const port = 5000;
const WTF = 10; // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt#description

const fs = require("fs");
const mysql = require("mysql");

const json = fs.readFileSync("credentials.json", "utf8");
const credentials = JSON.parse(json);

const connection = mysql.createConnection(credentials);
connection.connect((error) => {
  if (error) {
    console.error(error);
    process.exit(1);
  }
});

connection.end();

let billNextId = 1;
const bills = {
    [billNextId]: {
        id: billNextId++,
        firstname: "joe",
        lastname: "drake",
        billtype: "rent",
        amount: 500
    },
    [billNextId]: {
        id: billNextId++,
        firstname: "luke",
        lastname: "faulkner",
        billtype: "water",
        amount: 50,
    },
};

service.listen(port, () => {
    console.log(`We're live on port ${port}!`);
});

// POST /bills that accepts a JSON body containing a new bill’s first name, last name, bill type and
// amount. It returns a JSON structure reporting the ID assigned of the new
// bill.
service.post("/bills", (req, resp) => {
    const { firstname, lastname, billtype, amount } = req.body;
    bills[billNextId] = {
      id: billNextId,
      firstname: firstname,
      lastname: lastname,
      billtype: billtype,
      amount: amount,
    };
    resp.json({
      ok: true,
      result: bills[billNextId++],
    });
  });

  // GET /bills/:id that returns as JSON an object with the bill’s firstname,
// lastname, bill type,and amount.
service.get("/bills/:id", (req, resp) => {
    resp.json(bills[req.params.id]);
});



// DELETE /bills/:id that hard-deletes the bill from the database.
service.delete("/bills/:id", (req, resp) => {
    const billId = parseInt(req.params.id, WTF);
    
    delete bills[billId];
    resp.status(204).json({
      ok: true,
    });
});


