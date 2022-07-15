const jwt = require('jsonwebtoken')

const verifyToken = (req,res,next)=>{
    const auth = req.headers['authorization']
    let token_auth
    try{
    token_auth = auth.split(' ')[1] 
    }catch{}
    const token = req.body.token || req.query.token || req.headers['x-access-token'] || token_auth 

    if(!token){
        res.status(403).send('Token failed')
        return
    }

    try{
        jwt.verify(token,"km_dev")
    }catch{
        res.status(401).send("token")
        return
    }

    return next()
}

module.exports = verifyToken;