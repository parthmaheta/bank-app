const express=require("express")
const router=express.Router()

const filelogger=require('./../functions/logger.js').filelogger
const file='user.log'

router.post("/signup",signup)
router.post("/login",login)
router.get("/home",home)
router.get("/logout",logout)

function logout(req,res){
    filelogger(file,'s logout'+req.ip+' '+req.session.user)
    delete  req.session.user
    res.redirect('/')
}

function home(req,res){
    if(req.session.user){
       res.render('user_home',{})
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