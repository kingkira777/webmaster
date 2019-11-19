const mysql = require('mysql');
var con;

function Connetion(){

    // con = mysql.createPool({
    //     host : 'localhost',
    //     user : 'root',
    //     password : 'admin',
    //     database :  'master'
    // }); 

    con = mysql.createPool({
        host : '182.50.132.78',
        user : 'master',
        password : 'master707!',
        database :  'master'
    }); 

    return con; 
}


module.exports = Connetion();