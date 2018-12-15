var mysql = require('mysql');
var cTable = require('console.table');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    port: 3306,
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    decision();
})

//Function that displays all items in stock
function showAllItems() {
    connection.query("select * from products", function (err, res) {
        if (err) throw err;
        console.table(res)
        decision();
        //connection.end();
    });
}

// Inquirer for decision
function decision() {
    inquirer.prompt([
        {
            name: "decision",
            type: "list",
            message: "What would you like to do",
            choices: ['Buy', 'View', 'Done Shopping']
        }
    ]).then(function (answers) {
        if (answers.decision === 'Buy') {
            console.log('Here is a list of items at our Store');
            buyItems();
        }

        else if (answers.decision === 'View') {
            showAllItems();
        }

        else {
            connection.end();
        }

    });
}

//Buy Function

function buyItems() {
    inquirer.prompt([
        {
            name: "item",
            type: "input",
            message: "Enter ID of Item you would like to buy"
        },
        {
            name: "stock",
            type: "input",
            message: "Enter Quantity"
        }
    ]).then(function (answers) {
        connection.query("select stock_quantity from products where item_id=" + answers.item, function (err, res) {
            if (err) throw err;

            if (res[0].stock_quantity > answers.stock) {
                totalCost();
                updateQuery();
                
            }

            else {
                console.log('Insufficient quantity!');
                setTimeout(function () { showAllItems(); }, 3000);

            }
        })


        function totalCost()
        {
            connection.query("select (price*" + answers.stock + ") as c from products where item_id =" +answers.item,function(err,res){
                if (err) throw err;
                console.log('Total Cost is '+res[0].c);
                console.log('Thank you for shopping with us');
                
            })
        }

        function updateQuery() {
                           
             connection.query("update products set stock_quantity = (stock_quantity -" + answers.stock + ") where item_id =" + answers.item, function (err) {
                if (err) throw (err);
            })
        }

      
    })
}
