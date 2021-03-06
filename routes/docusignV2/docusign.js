var express = require('express');
var router = express.Router();
var master = require('../modules/master');
var con = require('../modules/connection');
var fs = require('fs');


/* Docusign Login Page. */
router.get('/login?',function(req,res,next){
    var failed = req.query.failed;
    res.render('docusign/login',{title: 'Login', isFailed : failed});
    res.end();
});


/* Docusign Home page NOT Signed. */
router.get('/', function(req, res, next) {  
    if(req.session.branch){
        var sql = `SELECT * FROM docusign WHERE doc_branch = ? AND (doc_sign IS NULL OR doc_sign = '') 
            ORDER BY doc_id DESC`;
        con.query(sql,[req.session.branch],function(err,rs){
            if(err){
                console.log(err);
            }
            res.render('docusignv2/index', { title: 'Docusign', doclist : rs, accesslvl: req.session.accesslvl, pending: 'active'});        
        });
    }else{
        res.redirect('/docusign/login');
        res.end();
    }
    
});


//Open PDF File
router.get('/open-file?',function(req,res,next){
    var filename = req.query.filename;
    var filepath = 'files/docusign/signed/'+ req.session.branch+"/"+filename;
    fs.readFile(filepath,function(err,data){
        res.setHeader('Content-disposition', 'attachment; filename='+ filename);
        res.setHeader('Content-type', 'application/pdf');
        // res.contentType("application/pdf");
        res.download(data,'Sample Title');
        res.end();
    });
});

//Get Signed Docs
router.get('/signed-docs',function(req,res,next){
    if(!req.session.branch)
        res.redirect('/docusign/login');

    var sql = `SELECT * FROM docusign WHERE  doc_sign = 'true' AND doc_branch = ? 
        ORDER BY doc_id DESC`;
    con.query(sql,[req.session.branch],function(err,rs){
        if(err){
            console.log(err);
        }
        res.render('docusignv2/signed',{title : 'Signed Docs', data : rs, signed: 'active'});
        res.end();
    });

});


//Open Document
router.get('/open-document?',function(req,res,next){
    if(req.session.branch){
        res.render('docusignv2/open_docu',{title : 'Open Document', accesslvl : req.session.accesslvl});
        res.end();
    }else{
        res.redirect('/docusign/login');
        res.end();
    }
});


//Get Signs Locations
router.get('/get-signs-loc?',function(req,res,next){

    if(!req.session.branch)
        res.redirect('/docusign/login');

    var filename = req.query.filename;
    var sql = `SELECT * FROM docusign WHERE doc_name = ? AND doc_branch = ?`;
    var sql_val = [filename, req.session.branch];
    con.query(sql,sql_val,function(err,rs){
        if(err){
            console.log(err);
        }
        res.json(rs[0]);
        res.end();
    });
});

//Delete Docu 
router.get('/delete-doc?', function(req,res,next){
    if(!req.session.branch)
        res.redirect('/docusign/login');


    var filename = req.query.filename;
    var path = req.query.path;

    var sql = `DELETE FROM docusign WHERE doc_name = ?`;
    var sql_val = [filename];
    con.query(sql,sql_val,function(err,rs){
        if(err){
            console.log(err);
        }
        fs.unlinkSync(path,function(xerr){
            if(xerr){
                console.log(xerr);
            }
        });
        res.redirect('/docusignv2');
        res.end();
    });
    
});


//====================================POST PART======================================//


//Signed All
router.get('/signed-all',function(req,res,next){
    if(!req.session.branch)
        res.redirect('/docusign/login');

    var sql = `UPDATE docusign SET doc_sign = 'true', doc_signdate = ? WHERE (doc_sign IS NULL OR doc_sign = "") AND doc_branch = ?`;
    con.query(sql,[master.get_currentdate(), req.session.branch],function(err,rs){
        if(err){
            console.log(err);
        }
        res.redirect('/docusignv2');
        res.end();
    })
});

//Single Singed 
router.post('/single-signed',function(req,res,next){
    
    if(!req.session.branch)
        res.redirect('/docusign/login');

    var filename = req.body.filename;
    var sql = `UPDATE docusign SET doc_sign = 'true', doc_signdate = ? WHERE doc_name = ? AND doc_branch = ?`;
    var sql_val = [master.get_currentdate(), filename, req.session.branch];
    con.query(sql,sql_val,function(err,rs){
        if(err){
            console.log(err);
        }
        res.json({
            message : 'signed'
        });
        res.end();
    });
});



/*Save Signs Locations*/
router.post('/save-sign-loc',function(req,res,next){

    if(!req.session.branch)
        res.redirect('/docusign/login');


    var filename = req.body.filename;
    var signloc = req.body.signloc;
    var sql = `UPDATE docusign SET  doc_signloc = ? WHERE doc_name = ? AND doc_branch = ?`;
    var sql_val = [signloc,filename, req.session.branch];
    con.query(sql,sql_val,function(err,rs){
        if(err){
            console.log(err);
        }
        res.json({
            message : 'updated'
        });
        res.end();
    });
});



/** Save PDF File to the Server */
router.post('/save-file-to-server',function(req,res,next){

    if(!req.session.branch)
        res.redirect('/docusign/login');

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    var path = "files/docusign/signed/" + req.session.branch;
    if(!fs.existsSync(path)){
        fs.mkdirSync(path);
    }

    var filename = req.body.filename;
    let file = req.files.file;

    var xfile = path +"/"+ filename;

    file.mv(xfile,function(err){
        if(err){
            console.log(err);
        }
        res.send('saved');
        res.end();
    });

});


/*Upload Files ==================================*/
router.post('/upload-file',function(req,res,next){
    if(!req.session.branch)
        res.redirect('/docusign/login');
    

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    
    var path = "files/docusign/pending/"+ req.session.branch;
    if(!fs.existsSync(path)){
        fs.mkdirSync(path)
    }

    var filename = master.randomValuesHex(12)+".pdf";
    let file = req.files.file;

    var xfile = path +"/"+ filename;
    file.mv(xfile,function(err){
        if(err){
            console.log(err);
        }

        var sql = `INSERT INTO docusign(doc_branch,doc_name, doc_filename, doc_path)
        VALUES ?`;
        var sql_val = [
            [req.session.branch,filename, file.name, xfile]
        ];
        con.query(sql,[sql_val],function(err,rs){
            if(err){
                console.log(err);
            }
            res.redirect('/docusignv2');
            res.end();
        });
    });
});


//==================LOGIN USERS=========================================//
router.post('/login-user',function(req,res,next){
    var username = req.body.username;
    var password = req.body.password;
    var sql = `SELECT * FROM docusign_users WHERE docuser_name = ? AND docuser_password = ?`;
    var sql_val = [username,password];
    con.query(sql,sql_val,function(err,rs){
        if(err){
            console.log(err);
        }
        if(rs.length != 0){
            req.session.branch = rs[0].docuser_branch;
            req.session.accesslvl = rs[0].docuser_accesslvl;
            req.session.user = rs[0].docuser_name;
            res.redirect('/docusignv2');
            res.end();
        }else{
            res.redirect('/docusign/login?failed='+ true);
            res.end();
        }
    });

});


//====================LOGOUT=========================//
router.get('/logout',function(req,res,next){
    if(!req.session.branch)
        return;

    if(req.session.destroy()){
        res.redirect('/docusign/login');
        res.end();
    }
});


module.exports = router;
