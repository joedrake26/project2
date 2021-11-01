const express = require('express');
const fs = require('fs');
const mysql = require('mysql');


const json = fs.readFileSync('credentials.json', 'utf8');
const credentials = JSON.parse(json);
const service = express();
service.use(express.json());
const WTF = 10;
const path = require('path');

const connection = mysql.createConnection(credentials);
connection.connect(error => {
    if (error) {
      console.error(error);
      process.exit(1);
    }
  });

const port = 5001;

service.get('/report.html', function(request, response) {
  response.sendFile(path.join(__dirname+'/report.html'));
});

service.listen(port, () => {
    console.log(`We're live on port ${port}!`);
});




service.use((request, response, next) => {
    response.set('Access-Control-Allow-Origin', '*');
    next();
});

service.options('*', (request, response) => {
  response.set('Access-Control-Allow-Headers', '*');
  response.set('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
  response.sendStatus(200);
});

function rowToMemory(row) {
  return {
    id: row.id,
    firstname: row.firstname,
    lastname: row.lastname,
    billtype : row.billtype,
    amount: row.amount,
  };
}


// POST /bills that accepts a JSON body containing a new bill’s first name, last name, bill type and
// amount. It returns a JSON structure reporting the ID assigned of the new
// bill.
service.post('/insert', (request, response) => {

    const parameters = [
      request.body.firstname,
      request.body.lastname,
      request.body.billtype,
      request.body.amount
    ];

    const query = 'INSERT INTO bill(firstname, lastname, billtype, amount) VALUES (?, ?, ?, ?)';
    connection.query(query, parameters, (error, result) => {
      if (error) {
        response.status(500);
        response.json({
          ok: false,
          results: error.message,
        });
      } else {
        response.json({
          ok: true,
          results: "Please work",
        });
      }
    });
});

// Patch /bills/:id 
service.patch('/bills/:id', (request, response) => {
	const parameters = [
	    request.body.firstname,
            request.body.lastname,
            request.body.billtype,
            request.body.amount,
            parseInt(request.params.id),
	];
	
	const query = 'UPDATE bill SET firstname = ?, lastname = ?, billtype = ?, amount = ? WHERE id = ?';
	connection.query(query, parameters, (error, result) => {
	    if (error) {
	      response.status(404);
	      response.json({
	        ok: false,
		results: error.message,
	      });
	    } else {
	      response.json({
		ok: true,
	      });
	    }
	});
});

  // GET /bills/:id that returns as JSON an object with the bill’s firstname,
// lastname, bill type,and amount.
service.get('/bills', (request, response) => {
   const query = 'SELECT * FROM bill';
   connection.query(query, (error, rows) => {
    if (error) {
      response.status(500);
      response.json({
        ok: false,
        results: error.message,
      });
    } else {
      const memories = rows.map(rowToMemory);
      response.json({
        ok: true,
        results: rows.map(rowToMemory),
      });
    }
  });

});


// DELETE /bills/:id that hard-deletes the bill from the database.
service.delete('/bills/:id', (request, response) => {
    const parameters = [parseInt(request.params.id)];

    const query = 'DELETE FROM bill WHERE id = ?';
    connection.query(query, parameters, (error, result) => {
        if (error) {
            response.status(404);
            response.json({
                ok: false,
                results: error.message,
            });
        } else {
            response.json({
                ok:true,
            });
        }
    });
});


