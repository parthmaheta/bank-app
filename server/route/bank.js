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
router.post("/add",addAccount)
router.post("/:id",getTransaction)
router.delete('/:id',deleteAC)

function getTransaction(req,res){
      
}

async function addAccount(req,res){
  if(req.session.bank)
  {
       let db=require('./../functions/db.js')
       let key=fun.getRandomInt(100000,999999)
       while(!await fun.isUniqueKEY(key))
         key=fun.getRandomInt(100000,999999)

       let AC=fun.getRandomInt(1000000000,9999999999)
        while(!await fun.isUniqueAC(AC))
           AC=fun.getRandomInt(100000,999999)

       db.query(`insert into accounts values('${req.body.nm}',${req.session.bank},${AC},${req.body.mn},${key})`,(err)=>{
         if(!err)
           {
             filelogger(file,'s added '+AC+' '+req.session.bank)
             return res.send(AC+','+key)
           }
           else
            { filelogger(file,'f insert account'+req.session.bank)
             res.send('error occured')
          }
       })
       
  }
  else
   res.send('logged out')
}

function home(req,res){
    if(req.session.bank)
     {  let db=require('./../functions/db.js')
        db.query('select NAME,AC,_KEY from accounts where ISFC='+req.session.bank,(err,result)=>{
          return res.render('bank_home',{ACCOUNTS:result})
        }) 
        
     }
    else
     res.redirect('/bank')
    
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
function deleteAC(req,res){
  if(!req.session.bank)
   return res.redirect('/')
   
  const db=require("./../functions/db.js")
  db.query('delete from accounts where AC='+req.params.id,(err)=>{
      if(!err){
          filelogger(file,'deleted account '+req.params.id+' '+req.session.bank)
          return res.send(true)
      }
      else
      { filelogger(file,'cant delete account '+req.params.id+' '+req.session.bank)
        return res.send(false)
      }
  })
  
}

function login(req,res){
    let hour=new Date().getHours()

    // if(hour>10&&hour<16)
    // {
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
// }
  else
   res.redirect('./')
}

module.exports=router