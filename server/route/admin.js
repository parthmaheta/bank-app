const express=require("express")
const crypto=require("crypto")
const router=express.Router()
const filelogger=require('./../functions/logger').filelogger
const file='admin.log'

router.get("/",(req,res)=>res.render('admin',{title:'admin',message:'LOGIN'}))
router.post("/login",(req,res)=>{
    
    if("21232f297a57a5a743894a0e4a801fc3"===crypto.createHash('md5').update(req.body.userid).digest('hex'))
     {
         if("21232f297a57a5a743894a0e4a801fc3"===crypto.createHash('md5').update(req.body.password).digest('hex'))
          {
              filelogger(file,'success login\t'+req.ip)
              return res.send('success')
          }
     }
     filelogger(file,'fail login\t'+req.ip)
     res.redirect('/admin')
})

module.exports=router