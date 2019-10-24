
var log = ((req,res,next)=>{
    console.log("loging");
    next(); // if i comment it the request get hanging
});

module.exports = log;

