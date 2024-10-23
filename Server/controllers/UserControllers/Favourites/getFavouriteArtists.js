// Import database client.
import client from "../../../config/database.js"

// Import needed libraries.
import jwt from "jsonwebtoken"

// Return all the favourite Albums from a certain user
async function GetFavouriteArtists (req, res) {
    let allFavouriteArtists
    let token = req.headers.authorization

    try {
        // Verify token.
        if (!token) {
            return res.status(401).json({ error: "Unauthorized access" })
        }
    
        token = token.split(' ')[1]
    
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const username = decode.username

        // Find the client and the right collection
        const favourite = client.db("EchoBond").collection("Favourites")
        const artistsCollection = client.db("EchoBond").collection("Artists")

        // Return all the Favourite Albums from the username
        allFavouriteArtists = await favourite.find({username:username,type:"artist"}).toArray()
        
        const favouriteArtistsnames = allFavouriteArtists.map(artist => artist.artistName)
        allFavouriteArtists = await artistsCollection.find({ name: { $in: favouriteArtistsnames } }).toArray()

        // Be possible to use the image(base64) from the database.
        allFavouriteArtists = allFavouriteArtists.map(artist => {
            if (artist.image && artist.image.buffer) {
              // Assuming the binary data is in a Buffer; adjust as necessary based on your actual data structure
              artist.image = `data:image/jpeg;base64,${artist.image.buffer.toString('base64')}`
            }
            return artist
          })

        res.json(allFavouriteArtists) // Send Favourite albums data as JSON response
    } catch (error) {
        console.error("Error executing query or connecting to the database: ", error.message)
        return res.status(500).json({ "GetFavouriteArtists": "error" })
    }
} 

export default GetFavouriteArtists