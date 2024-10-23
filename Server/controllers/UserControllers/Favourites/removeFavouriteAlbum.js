// Import database client.
import client from "../../../config/database.js"

// Import needed libraries.
import jwt from "jsonwebtoken"

// Remove a favourite album from a certain user
async function RemoveFavouriteAlbum (req, res) {
    let token = req.headers.authorization

    try {
        // Verify token.
        if (!token) {
            return res.status(401).json({ error: "Unauthorized access" })
        }
    
        token = token.split(' ')[1]
    
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const username = decode.username

        // Take the albumname
        const albumName = req.query.name

        // Find the correct collection
        const favourites  = client.db("EchoBond").collection("Favourites")

        // Create the item
        const favourite = {
            username: username,
            albumName: albumName
        }

        // Remove the favourite from the database
        const result = await favourites.deleteOne(favourite)

        res.send({ message: 'Favourite removed successfully', _id: result.insertedId })
    
    } catch (error) {
        console.error("Error executing query or connecting to the database: ", error.message)
        return res.status(500).json({ "addFavouriteAlbum": "error" })
    }
} 

export default RemoveFavouriteAlbum