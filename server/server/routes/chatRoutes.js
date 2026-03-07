const express  = require("express") ; 
const router = express.Router() ; 
const {signUp} = require('../controllers/sigupController')
const {signIn} = require('../controllers/signinController')
const {getGifs} = require('../controllers/getgifController')

const authMiddleware = require('../middleware/authMiddleware')


router.post('/signin',signIn)

router.post('/signup' ,authMiddleware, signUp );

router.get('/get-gif',getGifs)  ; 


router.get('/',( _ , res)=>{


    res.status(200).json({
    message: "Welcome to Dot Messenger!",
    status: "Online",
    timestamp: new Date().toISOString()
    });


})


module.exports = router  ; 