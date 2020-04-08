function getString(length){
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
async function isUniqueISFC(isfc){
    let r='p';
    let check=new Promise((resolve,reject)=>{
        const db=require('./db')
        db.query("select isfc from banks where isfc="+isfc,(err,result)=>{
            if(result.length>0)
              r=false
            else 
              r=true
            resolve(r)
        })
    })
    r=await check
    return r
}
async function isUniqueKEY(key){
    let r='p';
    let check=new Promise((resolve,reject)=>{
        const db=require('./db')
        db.query("select _KEY from accounts where _KEY="+key,(err,result)=>{
            if(result.length>0)
              r=false
            else 
              r=true
            resolve(r)
        })
    })
    r=await check
    return r
}
async function isUniqueAC(AC){
    let r='p';
    let check=new Promise((resolve,reject)=>{
        const db=require('./db')
        db.query("select AC from accounts where AC="+AC,(err,result)=>{
            if(result.length>0)
              r=false
            else 
              r=true
            resolve(r)
        })
    })
    r=await check
    return r
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
exports.getString=getString
exports.isUniqueISFC=isUniqueISFC
exports.isUniqueKEY=isUniqueKEY
exports.isUniqueAC=isUniqueAC
exports.getRandomInt=getRandomInt