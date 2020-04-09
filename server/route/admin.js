const express=require("express")
const crypto=require("crypto")
const router=express.Router()
const filelogger=require('./../functions/logger').filelogger
const fun=require('./../functions/function')
const file='admin.log'


router.get("/",admin)
router.post("/login",login)

router.get('/logout',logout)
router.get('/bank',home)
router.post('/bank/add',addBank)
router.delete('/bank/:id',deleteBank)

function admin(req,res){
    if(req.session.admin)
     return res.redirect('/admin/bank') 
     
    res.render('admin',{title:'Login',message:'Login'})
     
}
function home(req,res){
    if(req.session.admin)
     {
         const db=require('./../functions/db.js')
         db.query('select name,isfc from banks',(err,result)=>{
            if(!err)
            {  
             return res.render('admin_home',{banks:result})
            }
            filelogger('db.log','cant get banks detail')
            res.render('admin_home',{banks:[]})
         })
         
     }
    else
     res.redirect('/')
}
function login(req,res){
    //admin
    if("21232f297a57a5a743894a0e4a801fc3"===crypto.createHash('md5').update(req.body.userid).digest('hex'))
     {     //admin
         if("21232f297a57a5a743894a0e4a801fc3"===crypto.createHash('md5').update(req.body.password).digest('hex'))
          {
              filelogger(file,'s login\t'+req.ip)
              req.session.admin="1"
              return res.redirect('/admin/bank')
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
    if(!req.session.admin)
     return res.redirect('/admin')

    const db=require("./../functions/db.js")
    let isfc=fun.getRandomInt(100000,999999)
    while(!await fun.isUniqueISFC(isfc))
         isfc=fun.getRandomInt(100000,999999)

    let pw=crypto.createHash("md5").update(req.body.pw).digest("hex")    
    db.query(`insert into banks values('${req.body.nm}',${isfc},'${pw}')`,(err,result)=>{
        filelogger(file,req.body.nm+" bank\t"+isfc+" inserted")
        res.send(isfc+'')
    }) 
}

function deleteBank(req,res){
    if(!req.session.admin)
     return res.redirect('/admin')
     
    const db=require("./../functions/db.js")
    db.query('delete from banks where isfc='+req.params.id,(err)=>{
        if(!err){
            filelogger(file,'deleted isfc '+req.params.id)
            return res.send(true)
        }
        filelogger(file,'cant delete isfc '+req.params.id)
    })
    
}
module.exports=router
