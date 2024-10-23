// Import database client.
import client from "../../../config/database.js"

// Import needed libraries.
import jwt from "jsonwebtoken"

// Remove artist from favourites.
async function RemoveFavouriteArtist (req, res) {
    let token = req.headers.authorization

    try {
        // Verify token.
        if (!token) {
            return res.status(401).json({ error: "Unauthorized access" })
        }
    
        token = token.split(' ')[1]
    
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const username = decode.username

        // Get the name of the aritst
        const artistName = req.query.name
        const favourites  = client.db("EchoBond").collection("Favourites")

        // Create the item
        const favourite = {
            username: username,
            artistName: artistName,
            type:"artist"
        }

        // Delete the favorite from the database
        const result = await favourites.deleteOne(favourite)

        res.send({ message: 'Favorite removed successfully', _id: result.insertedId })
    
    } catch (error) {
        console.error("Error executing query or connecting to the database: ", error.message)
        return res.status(500).json({ "removeFavouriteArtist": "error" })
    }
} 

export default RemoveFavouriteArtist