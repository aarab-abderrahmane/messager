const usersByToken = new Map();
const usersByEmail = new Map()
const userIps = new Set();    // track unique userIps

const { v4: uuidv4 } = require('uuid');

function addUser(email, ip, avatar, password, username) {

    let token;
    do {
        token = uuidv4();
    } while (usersByToken.has(token)); // ensure token unique

    // Create user object
    const newUser = { email, ip, token, avatar, password, username, creationDate: Date.now() };

    // Save

    usersByEmail.set(email, newUser);
    usersByToken.set(token, newUser);

    userIps.add(ip);

    return newUser;
}

function removeUser(token) {
    const user = users.get(token);
    if (!user) return;

    emails.delete(user.email);
    userIps.delete(user.ip);
    // users.delete(token);
}


function getUserByToken(token) {
    return usersByToken.get(token);
}

function getRegistredUsers() {
    return Array.from(usersByToken.values());
}





module.exports = {
    usersByEmail,
    usersByToken,
    userIps,
    getRegistredUsers,
    getUserByToken,
    removeUser,
    addUser
}