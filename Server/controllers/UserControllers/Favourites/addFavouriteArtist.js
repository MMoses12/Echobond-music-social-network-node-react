// Import database client.
import client from "../../../config/database.js"

// Import needed libraries.
import jwt from "jsonwebtoken"

// Add a favourite Artists from a certain user
async function AddFavouriteArtist (req, res) {
    let token = req.headers.authorization

    try {
        // Verify token.
        if (!token) {
            return res.status(401).json({ error: "Unauthorized access" })
        }
    
        token = token.split(' ')[1]
    
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const username = decode.username

        // Get the name of the album 
        const artistName = req.body.name
        // Find the correct collection
        const favourites  = client.db("EchoBond").collection("Favourites")

        // Create the item we want to insert
        const favourite = {
            username: username,
            artistName: artistName,
            type:"artist"
        }

        // Insert the favourite into the database
        const result = await favourites.insertOne(favourite)

        res.send({ message: 'Favourite added successfully', _id: result.insertedId })
    
    } catch (error) {
        console.error("Error executing query or connecting to the database: ", error.message)
        return res.status(500).json({ "addFavouriteArtst": "error" })
    }
} 

export default AddFavouriteArtist