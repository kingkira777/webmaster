const mysql = require('mysql');
var con;

function Connetion(){


    // //LOCAL DATABASE
    // con = mysql.createPool({
    //     host : 'localhost',
    //     user : 'root',
    //     password : 'admin',
    //     database :  'master'
    // }); 

    //HOSPICE FUSION DATABASE
    // con = mysql.createPool({
    //     host : '182.50.132.78',
    //     user : 'master',
    //     password : 'master707!',
    //     database :  'master'
    // }); 


    //TRIUNION DATABASE 

    con = mysql.createPool({
        host : 'localhost',
        user : 'master',
        password : '*Master7!',
        database :  'master'
    }); 

    return con; 
}


module.exports = Connetion();