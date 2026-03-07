const {getUserByEmail,usersByToken,usersByEmail} = require('../memory/userStore')
const { v4: uuidv4 } = require('uuid');


function signIn(req, res) {

    const { email, password } = req.body;
    const ip = req.ip;

    const user = getUserByEmail(email);

    if (!user) {
        return res.status(400).json({ error: "email or password incorrect" });
    }

    if (user.ip !== ip) {
        return res.status(400).json({
            error: "blocked: different IP"
        });
    }

    if (password !== user.password) {
        return res.status(400).json({
            error: "email or password incorrect"
        });
    }

    let new_token;
    do {
        new_token = uuidv4();
    } while (usersByToken.has(new_token));

    usersByToken.delete(user.token);
    const updatedUser = { ...user, token: new_token };

    usersByEmail.set(user.email, updatedUser);
    usersByToken.set(new_token, updatedUser);
    usersByToken.delete(user.token);

    return res.json({
            username : user.username , 
            token : new_token , 
            email : user.email , 
            avatar : user.avatar 
    });
}

module.exports = {signIn}