const express=require("express")
const app =express()

app.use(express.urlencoded({extended:true}))

app.set('view engine','pug')
app.set('views','./public/views')

app.use(require('./server/functions/logger.js').httplogger)

app.get('/',(req,res)=>{
    res.render('index',{ title: 'BANK-APP', message: 'Welcome TO Bank' })
})

app.use('/user',require('./server/route/user.js'))
app.use('/bank',require('./server/route/bank.js'))
app.use('/admin',require('./server/route/admin.js'))

app.listen(8080)
