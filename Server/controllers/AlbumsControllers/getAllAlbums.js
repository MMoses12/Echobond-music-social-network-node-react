// Import database client.
import client from "../../config/database.js"

// Import needed libraries.
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

// Get all albums' data.
async function GetAllAlbums(req, res) {
    // Get token from header.
    let token = req.headers.authorization
    let allAlbums
    
    try {
        // Verify token.
        if (!token) {
            return res.status(401).json({ error: "Unauthorized access" })
        }

        token = token.split(' ')[1]
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        
        // Finding the client and the right collection
        const albums = client.db("EchoBond").collection("Albums")

        // Returns all the albums
        allAlbums = await albums.find({}).toArray()
        allAlbums = allAlbums.map(album => {
            if (album.image && album.image.buffer) {
                // Assuming the binary data is in a Buffer adjust as necessary based on your actual data structure
                album.image = `data:image/jpeg;base64,${album.image.buffer.toString('base64')}`
            }
            return album
        })

        res.json(allAlbums) // Send albums data as JSON response
    } catch (error) {
        console.error("Error executing query or connecting to the database: ", error.message)
        return res.status(500).json({ "getAllAlbums": "error" })
    }
}

export default GetAllAlbums
