const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "foodtrips"
})

app.get('/home', (req, res) => {
  const sql = 'SELECT * FROM restos';
  db.query(sql, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'An error occurred while fetching data' });
    }
    return res.status(200).json(rows);
  });
});



app.post('/addResto', (req, res) => {
    const { resto_name, resto_desc, status } = req.body;

    const sql = `INSERT INTO restos (resto_name, resto_desc, status) VALUES (?, ?, ?)`;
    db.query(sql, [resto_name, resto_desc, status], (err, result) => {
      if (err) {
        console.error('Error inserting data:', err);
        return res.status(500).json({ error: 'An error occurred while inserting data' });
      }
      console.log('Data inserted successfully');
      return res.status(200).json({ message: 'Data inserted successfully' });
    });
  });


  app.put('/updateStatus/:id', (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
  
    const sql = 'UPDATE restos SET status = ? WHERE id = ?';
    db.query(sql, [status, id], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'An error occurred while updating status' });
      }
      return res.status(200).json({ message: 'Status updated successfully' });
    });
  });
  
  app.delete('/deleteResto/:id', (req, res) => {
    const { id } = req.params;
  
    const sql = 'DELETE FROM restos WHERE id = ?';
    db.query(sql, [id], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'An error occurred while deleting the restaurant' });
      }
      return res.status(200).json({ message: 'Restaurant deleted successfully' });
    });
  });
  
app.listen(5000, () => {
    console.log("Hello from Backend!");
})

