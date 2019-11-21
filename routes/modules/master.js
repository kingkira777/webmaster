const crypto = require('crypto');


var master = {  

    //Get the Current Date
    get_currentdate : function(){
        let ts = Date.now();
        let date_ob = new Date(ts);
        let date = date_ob.getDate();
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();

        let xdate = year+ "-" +month+ "-"+date;
        return xdate;
    },

    // Return  value 'd5be8583137b'
    randomValuesHex : function(len){
        return crypto.randomBytes(Math.ceil(len)).toString('hex').slice(0,len);
    }

};



module.exports =  master;