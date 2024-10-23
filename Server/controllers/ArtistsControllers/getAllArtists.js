// Import database client.
import client from "../../config/database.js"

// Import needed libraries.
import jwt from "jsonwebtoken"

// Get all the artists' data from the database.
async function GetAllArtists (req, res) {
    let allArtists 
    let token = req.headers.authorization

    try {
        // Verify token.
        if (!token) {
            return res.status(401).json({ error: "Unauthorized access" })
        }
    
        token = token.split(' ')[1]
    
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        
        //Finding the client and the right collection
        const artists = client.db("EchoBond").collection("Artists")
        //returns all the artists 
        allArtists = await artists.find({}).toArray()
        allArtists = allArtists.map(artist => {
            if (artist.image && artist.image.buffer) {
              // Assuming the binary data is in a Buffer adjust as necessary based on your actual data structure
              artist.image = `data:image/jpeg;base64,${artist.image.buffer.toString('base64')}`
            }
            return artist
          })
        res.json(allArtists) // Send artists data as JSON response
    } catch (error) {
        console.error("Error in GetAllArtists executing query or connecting to the database: ", error.message)
        return res.status(500).json({ "getAllArtists": "error" })
    }
} 

export default GetAllArtists