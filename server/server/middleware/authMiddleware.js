


const {usersByEmail , userIps} = require("../memory/userStore")

function authMiddleware(req , res , next){

        const {email }  = req.body ; 
        const userIp = req.ip ;

        if (usersByEmail.has(email)) {
            return res.status(400).json({error : 'Email already in use'});
        }

        if (userIps.has(userIp)) {
          return res.status(400).json({error : "An account has already been created from this network."})
        }


        next()


}

module.exports = authMiddleware ; 