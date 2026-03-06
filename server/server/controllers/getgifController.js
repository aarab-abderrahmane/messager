require("dotenv").config();

async function getGifs (req, res)  {
  const limit = req.query.limit || 'funny';
  const apiKey = process.env.GIPHY_API_KEY;
  const query = req.query.q || 'funny';

  try {
    const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${query}&limit=${limit}`);
    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      res.json(data.data);
    } else {
      res.json([]); 
    }

  } catch (error) {
    res.status(500).json({ error: "Could not fetch GIF" });
  }
}

module.exports = {getGifs}
