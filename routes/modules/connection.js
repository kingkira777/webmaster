const mysql = require('mysql');
var con;

function Connetion(){

    con = mysql.createPool({
        host : 'localhost',
        user : 'root',
        password : 'admin',
        database :  'master'
    }); 

    return con; 
}


module.exports = Connetion();