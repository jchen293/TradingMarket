var mysql = require("mysql");
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var alert = require("alert-node");

var con2 = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "19981002"
});

con2.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con2.query("CREATE DATABASE IF NOT EXISTS CSE410", function(err, result) {
    if (err) throw err;
    console.log("Database created");
  });
});

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "19981002",
  database: "CSE410",
  multipleStatements: true
});

var accountAddress = [
  "0xca35b7d915458ef540ade6068dfe2f44e8fa733c",
  "0x14723a09acff6d2a60dcdf7aa4aff308fddc160c",
  "0x4b0897b0513fdc7c541b6d9d7e929c4e5364d2db",
  "0x583031d1113ad414f02576bd6afabfb302140225",
  "0xdd870fa1b7c4700f2bd7f44238821c26f7392148"
];
chairPersonAcc = true;
app.get("/", function(req, res) {
  res.sendFile("/Users/Jack/Desktop/CSE410PROJECT/index.html");
  con.query(
    "CREATE TABLE IF NOT EXISTS userList (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), wallet INT UNSIGNED NOT NULL); CREATE TABLE IF NOT EXISTS marketPlace (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255), price VARCHAR(255), status VARCHAR(255), owner VARCHAR(255) , image VARCHAR(255)); CREATE TABLE IF NOT EXISTS settlePayment (itemID INT AUTO_INCREMENT PRIMARY KEY, buyerID VARCHAR(255), sellerID VARCHAR(255))",
    function(err, result) {
      if (err) {
        throw err;
      } else {
        con.query("select * from `marketPlace`", function(err, rows) {
          if (err) throw err;

          resultJSON = JSON.stringify(rows);
          resultJSON = JSON.parse(resultJSON);
          app.get("/showTable", function(req, res) {
            res.send(resultJSON);
          });
        });
        console.log("Create tabel if not exist");
      }
      con.query("select * from userList", function(err, userListCheck) {
        if (userListCheck.length != 0) {
          for (var i = 0; i < userListCheck.length; i++) {
            if (userListCheck[i].name.toString() == accountAddress[0]) {
              chairPersonAcc = false;
              break;
            }
          }
          if (chairPersonAcc) {
            con.query(
              "INSERT INTO userList (name, wallet) VALUES ('0xca35b7d915458ef540ade6068dfe2f44e8fa733c',500)",
              function(err, rows) {}
            );
          }
        } else {
          con.query(
            "INSERT INTO userList (name, wallet) VALUES ('0xca35b7d915458ef540ade6068dfe2f44e8fa733c',500)",
            function(err, rows) {
              if (err) throw err;
            }
          );
        }
      });
    }
  );
});

function addUser(userAddress, check) {
  if (check) {
    alert("you have registered an account!!");
    con.query(
      "INSERT INTO userList (name, wallet) VALUES (" +
        "'" +
        userAddress +
        "'" +
        "," +
        "'" +
        500 +
        "'" +
        ")",
      function(err, rows) {
        if (err) throw err;
      }
    );
  } else {
    alert("this account has already been registered");
  }
}

app.post("/register", urlencodedParser, function(req, res) {
  console.log(
    "You selected register from this account " +
      req.body.registerFrom +
      " ou selected register to this account " +
      req.body.registerTo
  );
  personRegisterCheck = true;

  charPerson = req.body.registerFrom;
  personRegister = req.body.registerTo;

  if (
    charPerson == accountAddress[0] &&
    personRegister != accountAddress[0] &&
    personRegister != -1
  ) {
    con.query("select * from userList", function(err, registerCheck) {
      if (err) throw err;
      for (var i = 0; i < registerCheck.length; i++) {
        console.log(personRegister);
        if (registerCheck[i].name.toString() == personRegister) {
          personRegisterCheck = false;
          console.log(personRegisterCheck);
          break;
        }
      }
      addUser(req.body.registerTo, personRegisterCheck);
    });
    console.log("true of false " + personRegisterCheck);
  } else {
    alert(
      "you need to be chaiperson in order to register account or the account has already been registered!"
    );
  }
});

app.post("/unregister", urlencodedParser, function(req, res) {
  console.log(
    "You selected unregister from this account " + req.body.unregisterFrom
  );
  unregisterPerson = req.body.unregisterFrom;

  if (unregisterPerson.toString() != accountAddress[0]) {
    con.query(
      "DELETE FROM userList WHERE name =" + "'" + unregisterPerson + "'",
      function(err, rows) {
        if (err) throw err;
        alert("you have unregister an account!");
      }
    );
  } else {
    alert("You cannot unregister chairperson!");
  }
});

function updateAccount(amount, account, depAmt) {
  con.query(
    "UPDATE userList SET wallet =" +
      "'" +
      amount +
      "'" +
      "WHERE name = " +
      "'" +
      account +
      "'",
    function(err, rows) {
      if (err) throw err;
      alert("You have deposited " + depAmt + " to this account: " + account);
    }
  );
}
app.post("/deposit", urlencodedParser, function(req, res) {
  console.log(
    "You selected to deposit this account " + req.body.depositAccount
  );
  depositAmount = req.body.depositTotalAmount;
  currentAmount = 0;
  con.query("select * from userList", function(err, rows) {
    if (err) throw err;
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].name == req.body.depositAccount) {
        currentAmount = rows[i].wallet + parseInt(depositAmount);
        console.log("total amount deposit" + currentAmount);
        updateAccount(currentAmount, req.body.depositAccount, depositAmount);
        return;
      }
    }
  });
});

app.post("/getBalance", urlencodedParser, function(req, res) {
  console.log(
    "you have selected to get balance this account:" + req.body.getBalance
  );
  con.query("select * from userList", function(err, bal) {
    if (err) throw err;
    for (var i = 0; i < bal.length; i++) {
      if (bal[i].name.toString() == req.body.getBalance) {
        alert("Your current balance is:" + bal[i].wallet);
        return;
      }
    }
    alert("No user found in our database");
  });
});

app.post("/addBook", urlencodedParser, function(req, res) {
  console.log("Image url is:" + req.body.imageurl);
  con.query(
    "INSERT INTO marketPlace (title, price, status, owner,image) VALUES (" +
      "'" +
      req.body.title +
      "'" +
      "," +
      "'" +
      req.body.price +
      "'" +
      "," +
      "'" +
      "Available" +
      "'" +
      "," +
      "'" +
      req.body.itemOwner +
      "'" +
      "," +
      "'" +
      req.body.imageurl +
      "'" +
      ")",
    function(err, result) {
      if (err) throw err;
      alert(
        "you have added an item to marketplace, please refresh the page to see the update"
      );
    }
  );
});
app.post("/buyItem", urlencodedParser, function(req, res) {
  console.log("You have item id:  " + req.body.itemid);
  console.log("You have buyer id:  " + req.body.buyerID);
  console.log("You have seller id from dropdown:  " + req.body.sellerID);
  itemid = req.body.itemid;
  buyerid = req.body.buyerID;
  sellerid = req.body.sellerID;
  var itemPrice = 0;
  var buyerMoney = 0;
  con.query("SELECT * FROM marketPlace", function(err, market) {
    if (err) {
      throw err;
    } else {
      con.query("SELECT * FROM userList", function(error, users) {
        if (error) throw error;
        for (var i = 0; i < users.length; i++) {
          if (users[i].name == buyerid) {
            buyerMoney = users[i].wallet;
          }
        }
        for (var i = 0; i < market.length; i++) {
          if (market[i].id == itemid) {
            itemPrice = market[i].price;
          }
        }
        console.log("Item price is:" + itemPrice);
        var buyable = false;
        for (i in market) {
          if (
            market[i].id == itemid &&
            market[i].owner.toString() == sellerid &&
            market[i].status.toString() == "Available" &&
            market[i].owner.toString() != buyerid
          ) {
            buyable = true;
            break;
          }
        }
        if (buyerMoney > itemPrice && buyable) {
          con.query(
            "INSERT INTO settlePayment (itemID, buyerID, sellerID) VALUE(" +
              "'" +
              itemid +
              "'" +
              "," +
              "'" +
              buyerid +
              "'" +
              "," +
              "'" +
              sellerid +
              "'" +
              ")",
            function(err, result) {
              if (err) throw err;
              console.log(
                "you have successfully added the table to settlePayment!!!"
              );
            }
          );
        } else {
          alert(
            "Your money is not enought or you have wrong input or the item is unavailable"
          );
          return;
        }

        for (var i = 0; i < market.length; i++) {
          if (market[i].id == itemid) {
            con.query(
              "UPDATE marketPlace SET status = 'pending' WHERE id = " + itemid,
              function(err, rows) {
                if (err) throw err;
                alert(
                  "Item is in pending now, please refresh the page to see the update"
                );
              }
            );
          }
        }
      });
    }
  });
});

function changeOwner(newOwner, itemID) {
  con.query(
    "UPDATE marketPlace SET owner = '" +
      newOwner +
      "' WHERE id = '" +
      itemID +
      "'",
    function(err, row) {
      if (err) throw err;
    }
  );
}

function setValue(temp, temp2, buyer, seller, item) {
  finalAmountStringBuyer = temp.toString();
  finalAmountStringSeller = temp2.toString();

  con.query(
    "UPDATE userList SET wallet = '" +
      finalAmountStringBuyer +
      "' WHERE name = '" +
      buyer +
      "'",
    function(err, row) {
      if (err) throw err;
    }
  );
  alert(
    "Seller now has " +
      finalAmountStringSeller +
      "\nBuyer now has " +
      finalAmountStringBuyer +
      "\nYou have successfully bought the item, the buyer has become the owner \nplease refresh the page to see the update"
  );
  con.query(
    "UPDATE userList SET wallet = '" +
      finalAmountStringSeller +
      "' WHERE name = '" +
      seller +
      "'",
    function(err, row) {}
  );
  con.query(
    "UPDATE marketPlace SET status = 'Sold' WHERE id = " + item,
    function(err, row) {
      if (err) throw err;
    }
  );
  changeOwner(buyer, item);
}
app.post("/settlePayment", urlencodedParser, function(req, res) {
  console.log("You have item id:  " + req.body.itemid);
  console.log("You have buyer id:  " + req.body.buyerID);
  console.log("You have seller id:  " + req.body.sellerID);
  itemIDAddress = req.body.itemid;
  buyerIDAddress = req.body.buyerID;
  sellerIDAddress = req.body.sellerID;
  marketPrice = 0;
  var finalAmountForBuyer = 0;
  var finalAmountForSeller = 0;
  var buyerMoney = 0;
  var recordCheck = false;

  con.query("SELECT * FROM settlePayment", function(err, record) {
    if (err) {
      throw err;
    }

    for (var i = 0; i < record.length; i++) {
      if (
        record[i].itemID == itemIDAddress &&
        record[i].buyerID.toString() == buyerIDAddress &&
        record[i].sellerID.toString() == sellerIDAddress
      ) {
        console.log("database found it!");
        con.query("SELECT * FROM marketPlace", function(err, market) {
          if (err) throw err;
          for (var i = 0; i < market.length; i++) {
            if (
              market[i].id == itemIDAddress &&
              market[i].status.toString() != "Sold"
            ) {
              marketPrice = market[i].price;

              console.log("Item price is:" + marketPrice);
              break;
            }
          }
        });
        recordCheck = true;
      }
    }
    if (recordCheck == true) {
      con.query("SELECT * FROM userList", function(err, users) {
        if (err) throw err;

        for (var i = 0; i < users.length; i++) {
          if (users[i].name.toString() == buyerIDAddress) {
            finalAmountForBuyer = users[i].wallet - marketPrice;
            buyerMoney = users[i].wallet - 0;
          }
        }
        for (var i = 0; i < users.length; i++) {
          if (users[i].name.toString() == sellerIDAddress) {
            finalAmountForSeller = users[i].wallet - 0 + (marketPrice - 0);
          }
        }
        console.log("outside the loop marketprice:" + marketPrice);
        console.log("outside the loop buyerMoney:" + buyerMoney);

        if (buyerMoney > marketPrice) {
          setValue(
            finalAmountForBuyer,
            finalAmountForSeller,
            buyerIDAddress,
            sellerIDAddress,
            itemIDAddress
          );
        } else {
          alert("You don't have enough money now");
        }
        console.log("finalAmount for buyer:" + finalAmountForBuyer);
        console.log("finalAmount for seller:" + finalAmountForSeller);
      });
    } else {
      alert(
        "You input does not match the record we have in our database, please check your input"
      );
    }
  });
});

app.listen(process.env.port || 1337, function() {
  console.log("now listenin for request");
});
