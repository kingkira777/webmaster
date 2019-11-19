const crypto = require('crypto');


var master = {  

    // Return  value 'd5be8583137b'
    randomValuesHex : function(len){
        return crypto.randomBytes(Math.ceil(len)).toString('hex').slice(0,len);
    }

};



module.exports =  master;