const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// Create MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "shopdee"
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed: ', err.stack);
    return;
  }
  console.log('Connected to database.');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint to add a product
app.post('/product', function(req, res) {
  const { productName, productDetail, price, cost, quantity } = req.body;
  let sql = "INSERT INTO product (productName, productDetail, price, cost, quantity) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [productName, productDetail, price, cost, quantity], function(err, result) {
    if (err) {
      console.error('Error inserting product: ', err);
      res.status(500).send({'message': 'ไม่สามารถบันทึกข้อมูลได้', 'status': false});
      return;
    }
    res.send({'message': 'บันทึกข้อมูลสำเร็จ', 'status': true});
  });
});

// Endpoint to get a product by ID
app.get('/product/:id', function(req, res) {
  const productID = req.params.id;
  let sql = "SELECT * FROM product WHERE productID = ?";
  db.query(sql, [productID], function(err, result) {
    if (err) {
      console.error('Error retrieving product: ', err);
      res.status(500).send({'message': 'ไม่สามารถดึงข้อมูลได้', 'status': false});
      return;
    }
    res.send(result);
  });
});

// Endpoint to login
app.post('/login', function(req, res) {
  const { username, password } = req.body;
  let sql = "SELECT * FROM customer WHERE username = ? AND password = ? AND isActive = 1";
  db.query(sql, [username, password], function(err, result) {
    if (err) {
      console.error('Error during login: ', err);
      res.status(500).send({'message': 'ไม่สามารถดำเนินการได้', 'status': false});
      return;
    }
    if (result.length > 0) {
      let customer = result[0];
      customer['message'] = "เข้าสู่ระบบสำเร็จ";
      customer['status'] = true;
      res.send(customer);
    } else {
      res.send({
        "message": "กรุณาระบุรหัสผ่านใหม่อีกครั้ง",
        "status": false
      });
    }
  });
});

// Start the server
app.listen(port, function() {
  console.log(`Server listening on port ${port}`);
});
