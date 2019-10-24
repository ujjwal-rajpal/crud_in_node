var auth = ((req,res,next)=>{
    console.log("Authenticating");
    next(); // if i comment it the request get hanging
});

module.exports = auth;