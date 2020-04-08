const express=require("express")
const crypto=require("crypto")
const filelogger=require('./../functions/logger').filelogger
const fun=require('./../functions/function')
const file='bank.log'
const router=express.Router()

router.get("/",loginPage)
router.get("/logout",logout)
router.get("/home",home)
router.post("/login",login)

function home(req,res){
    res.render('bank_home')
}
function logout(req,res){
    filelogger(file,'logout')
    delete req.session.bank
    res.redirect('/bank')
}
function loginPage(req,res){
    if(req.session.bank){
      return  res.redirect('bank/home')
    }
  res.render('bank',{})
}

function login(req,res){
    if(req.body.nm&&req.body.pw)
    {let pw=crypto.createHash('md5').update(req.body.pw).digest("hex")
    let db=require('./../functions/db.js')
     db.query(`select name from banks where isfc=${req.body.nm} and password='${pw}'`,(err,result)=>{
       if(result.length==1)
        {
            filelogger(file,'s login')
            req.session.bank=req.body.nm
            return res.redirect('./home')
        }
        filelogger(file,'f login')
        return res.redirect('./')
   })
  }
  else
   res.redirect('./')
}

module.exports=router