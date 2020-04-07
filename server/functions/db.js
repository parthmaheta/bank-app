const mysql=require('mysql')
const filelogger=require('./logger').filelogger

const con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"bank_app"
    
})
con.connect(err=>{
    if(err)
     filelogger('db.log','err: mysql connection err'+err.message)
    else
     filelogger('db.log','s: mysql connected')
        
})
module.exports=con