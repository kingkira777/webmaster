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
    con = mysql.createPool({
        host : 'localhost',
        user : 'hfusion',
        password : '*hfusion124!',
        database :  'master'
    }); 


    //TRIUNION DATABASE 

    // con = mysql.createPool({
    //     host : '148.72.202.211',
    //     user : 'master',
    //     password : '*Master7!',
    //     database :  'master'
    // }); 

    return con; 
}


module.exports = Connetion();