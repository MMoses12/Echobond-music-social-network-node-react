// Import database client.
import client from "../../config/database.js"

// Import needed libraries.
import jwt from "jsonwebtoken"

// Get all songs' data.
async function GetAllSongs (req, res) {
    // Check if user's token is valid.
    let allSongs
    let token = req.headers.authorization

    try {
        // Verify token.
        if (!token) {
            return res.status(401).json({ error: "Unauthorized access" })
        }

        token = token.split(' ')[1]

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        
        // Finding the client and the right collection
        const songs = client.db("EchoBond").collection("Songs")

        // Returns the songs 
        allSongs = await songs.find({}, 
            {projection: { title: 1, artist: 1, time: 1, image: 1 }}
        ).toArray()

        allSongs = allSongs.map(songs => {
            if (songs.image && songs.image.buffer) {
              // Assuming the binary data is in a Buffer adjust as necessary based on your actual data structure
              songs.image = `data:image/jpeg;base64,${songs.image.buffer.toString('base64')}`
            }
            return songs
        })

         //Send songs' data as JSON response
        res.json(allSongs)
    } catch (error) {
        console.error("Error executing query or connecting to the database: ", error.message)
        return res.status(500).json({ "GetAllSongs": "error" })
    }
} 

export default GetAllSongs