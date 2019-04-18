const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "pug");
app.get("/", function(req, res) {
  res.sendFile("index.html", { root: __dirname });
});

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "19981002",
  database: "mydbuik"
});
con.connect(function(err) {
  if (err) {
    console.log("connection failed");
  } else {
    console.log("connected");
    var sql = "CREATE TABLE users (name VARCHAR(255), address VARCHAR(255))";
    con.query(sql, function(err, result) {
      if (err) throw err;
      console.log("Table created");
    });
  }
});

app.post("/submit", function(req, res) {
  // console.log(req.body);
  var sql =
    "insert into users value (null,'" +
    req.body.name +
    "','" +
    req.body.email +
    "'," +
    req.body.mobile +
    ")";
  con.query(sql, function(err) {
    if (err) throw err;
    res.render(__dirname + "/index", {
      title: "Data saved",
      message: "Data saved successfully"
    });
  });
  con.end();
});

app.listen(process.env.port || 1337, function() {
  console.log("now listenin for request");
});
