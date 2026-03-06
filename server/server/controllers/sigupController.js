const {addUser} = require('../memory/userStore')
const {brodcastUserStates} = require('../services/broadcastService')


function signUp (req, res) {
  
  const { email ,avatar , password , username } = req.body;
  const ip = req.ip;


  if (!email  || !avatar || !password || !username) {
    return res.status(400).json({ error: "All fields are required !" });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  const usernamePattern = /^[a-zA-Z0-9_]{3,15}$/;
  if (!usernamePattern.test(username)) {
    return res.status(400).json({ 
      error: "Username must be 3-15 characters and contain only letters, numbers, or underscores." 
    });
  }

  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  if (!passwordPattern.test(password)) {
    return res.status(400).json({ 
      error: "Password must be at least 8 characters long, including one uppercase letter and one number." 
    });
  }

  const response = addUser(email, ip , avatar  ,password , username);

  if (!response.error) {
    brodcastUserStates()
    return res.json(response); // contains token, email
  }

  return res.status(400).json(response);
}

module.exports = {signUp}