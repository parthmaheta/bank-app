const express=require("express")
const router=express.Router()

const filelogger=require('./../functions/logger.js').filelogger
const file='user.log'

router.post("/signup",signup)
router.post("/login",login)
router.post("/send",send)
router.get("/home",home)
router.get("/logout",logout)


function send(req,res){
    if(req.session.user&&req.body.to&&req.body.mn){
       let db=require('./../functions/db.js')
       db.query(`select _KEY from accounts where _KEY=${req.body.to}`,(err,result)=>{
           if(result.length==1){
                db.query('insert into transaction (`_FROM`,`_TO`,`MONEY`) value('+req.session.user+','+req.body.to+','+req.body.mn+')',(err,result)=>{
                    if(result){
                        filelogger(file,'s send '+req.session.user+' '+req.body.mn+' '+req.body.to)
                        return res.redirect('home')
                    }
                }) 
           }
           else
            return res.redirect('home')
       })
       
    }
    else{
        return res.send('invalid')
    }
}

function logout(req,res){
    filelogger(file,'s logout'+req.ip+' '+req.session.user)
    delete  req.session.user
    res.redirect('/')
}

function home(req,res){
    if(req.session.user){
        let balance
        let transaction
        let db=require('./../functions/db.js')
        db.query('select MONEY from accounts where _KEY='+req.session.user,(err,result)=>{
            if(!err)
            {
              balance=result[0].MONEY
              db.query(`select MONEY,DATETIME,(
                case 
                  WHEN _FROM=${req.session.user} then  (SELECT NAME from accounts where _KEY=_TO) 
                  when _TO=${req.session.user} then  (SELECT NAME from accounts where _KEY=_FROM)  
                END)as NAME,(
                case 
                  WHEN _FROM=${req.session.user} then _TO
                  when _TO=${req.session.user} then _FROM
                END) as AC ,
                (
                case 
                  WHEN _FROM=${req.session.user} then 'sent'
                  when _TO=${req.session.user} then 'received'
                END) as ACTION
                 from transaction order by DATETIME desc limit 10`,(err,result)=>{
                  if(result)
                  return res.render('user_home',{balance,transaction:result})
              })
            }
        })
    }
    else{
        res.redirect('/')
    }
}

function signup(req,res){
     if(req.body.uid&&req.body.pw&&req.body.key){
         let db=require('./../functions/db.js')
         let pw=require('crypto').createHash('md5').update(req.body.pw).digest('hex')
        
       
         db.query('select _KEY from accounts where _KEY='+req.body.key,(err,result)=>{
             if(result.length==1)
             {  db.query('insert into users values("'+req.body.uid+'","'+pw+'","'+req.body.key+'")',(err)=>{
                if(!err)
                 {    filelogger(file,'s signup '+req.ip)
                      return res.redirect('/')
                 }
                 filelogger(file,'f signup '+req.ip)
                 return res.redirect('/')
                 })
            }
            else
                return res.redirect('/')
         })
         
     }
     else
          return res.redirect('/')

     
}
function login(req,res){
    if(req.body.uid&&req.body.pw){
        let db=require('./../functions/db.js')
        let pw=require('crypto').createHash('md5').update(req.body.pw).digest('hex')
        db.query('select _KEY from users where ID="'+req.body.uid+'" and PW="'+pw+'"',(err,result)=>{
            if(result.length==1)
            { req.session.user=result[0]._KEY
             filelogger(file,'s login '+req.session.uid+' '+req.ip)
             return res.redirect('/user/home')
            }
            else
             { filelogger(file,'f login '+req.ip)
               return res.redirect('/')
            }
        })
    }
    else
     return res.redirect('/')
     
}
module.exports=router