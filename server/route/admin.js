const express=require("express")
const crypto=require("crypto")
const router=express.Router()
const filelogger=require('./../functions/logger').filelogger
const fun=require('./../functions/function')
const file='admin.log'



router.get("/",admin)
router.post("/login",login)

router.get('/logout',logout)

router.post('/bank/add',addBank)
router.delete('/bank/:id',deleteBank)

function admin(req,res){
    if(req.session.admin)
     return res.render('admin_home',{banks:[]})

     res.render('admin',{title:'Login',message:'Login'})
}

function login(req,res){
    
    if("21232f297a57a5a743894a0e4a801fc3"===crypto.createHash('md5').update(req.body.userid).digest('hex'))
     {
         if("21232f297a57a5a743894a0e4a801fc3"===crypto.createHash('md5').update(req.body.password).digest('hex'))
          {
              filelogger(file,'s login\t'+req.ip)
              req.session.admin="1"
              return res.render('admin_home',{banks:[]})
          }
     }
     filelogger(file,`f login\t${req.ip}`)
     res.redirect('/admin')
}

function logout(req,res){
    delete req.session.admin
    filelogger(file,'s logout\t'+req.ip)
    res.redirect('/admin')
}

async function addBank(req,res){
    const db=require("./../functions/db.js")
    let isfc=fun.getRandomInt(100000,999999)
    while(!await fun.isUniqueISFC(isfc))
         isfc=fun.getRandomInt(100000,999999)
    db.query(`insert into banks values('${req.body.nm}',${isfc},'${req.body.pw}')`,(err,result)=>{
        filelogger('db.log',req.body.nm+" bank\t"+isfc+" inserted")
        res.send(isfc+' ')
    }) 
}

function deleteBank(req,res){
    res.send(true)
}
module.exports=router
