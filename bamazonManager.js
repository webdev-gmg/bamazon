var mysql = require('mysql');
var inquirer = require('inquirer');
var cTable = require('console.table');

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "bamazon",
    port: 3306
});

connection.connect(function (err) {
    if (err) throw err;
    decision();
    //  console.log(connection.threadId);
})

//Manager sees all items
function showItems() {
    connection.query("select * from products", function (err, res) {
        if (err) throw err;
        console.table(res);
        connection.end();
    })
}


function decision() {

    inquirer.prompt([{
        name: "viewProducts",
        type: "list",
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Close App']
    }]).then(function (answers) {
        if (answers.viewProducts === 'View Products for Sale') {
            showItems();
        }
        else if (answers.viewProducts === 'View Low Inventory') {
            showLowInventory();
        }
        else if (answers.viewProducts === 'Close App') {
            connection.end();
        }
        else if (answers.viewProducts === 'Add to Inventory') {
            addInventory();
        }
        else if (answers.viewProducts === 'Add New Product') {
            addProduct();
        }
    })
}

function showLowInventory() {
    connection.query("select * from products where stock_quantity < 15", function (err, res) {
        ;
        if (err) throw err;
        console.table(res);
        decision();
    })
}

function addInventory() {

    inquirer.prompt([{
        name: "id",
        type: "input",
        message: "Enter ID of the item"
    },
    {
        name: "qty",
        type: "input",
        message: "Enter the number of Items"
    }
    ]).then(function (answers) 
    {

        connection.query("update products set stock_quantity = (stock_quantity +" + answers.qty + ") where item_id =" + answers.id,function(err,res){
            if(err) throw err;
           showItems();
        })
    })}
   
    function addProduct()
    {
        inquirer.prompt([{
            name:"product",
            message:"Enter Product Name",
            type:"input"
        },
            {
                name:"brand",
                message:"Enter Brand Name",
                type:"input"
            },
            {
                name:"dept",
                message:"Enter Department Name",
                type:"input"
            },
            {
                name:"price",
                message:"Enter Price",
                type:"input"
            },
            {
                name:"stock",
                message:"Enter Stock Quantity",
                type:"input"
            }

    ]) . then(function(answers){
         connection.query('insert into products (PRODUCT_NAME,BRAND,DEPARTMENT_NAME,PRICE,STOCK_QUANTITY) values ("'+answers.product+'","'+answers.brand+'","'+answers.dept+'","'+answers.price+'","'+answers.stock+'")',function(err){
            if (err) throw err;
            console.log('Item added');
            showItems();
        })
    })
    }

    
