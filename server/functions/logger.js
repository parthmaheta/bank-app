const fs=require('fs')

function httplogger(req,res,next){
    fs.appendFile(__dirname+'/../logs/general.log',req.url+"\t"+req.ip+"\t"+ new Date().toString()+"\n",(err)=>{
        if(err)
         console.log('cant write to general.log file ')
    })
    next()
}

function filelogger(file,message){
    fs.appendFile(__dirname+'/../logs/'+file,message+"\t"+ new Date().toString()+"\n",(err)=>{
        if(err)
         console.log('cant write to '+file +'file ')
    })
}
exports.filelogger=filelogger   
exports.httplogger=httplogger