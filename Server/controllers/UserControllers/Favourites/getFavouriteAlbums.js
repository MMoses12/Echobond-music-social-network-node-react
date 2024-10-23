// Import database client.
import client from "../../../config/database.js"

// Import needed libraries.
import jwt from "jsonwebtoken"

// Return all the favourite Albums from a certain user.
async function GetFavouriteAlbums (req, res) {
    let allFavouriteAlbums
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
        const favourites = client.db("EchoBond").collection("Favourites")
        const albumsCollection = client.db("EchoBond").collection("Albums")
        
        // Return all the Favourite Albums from the username
        allFavouriteAlbums = await favourites.find({username:username,type:"album"}).toArray()

        const favouriteAlbumnames = allFavouriteAlbums.map(album => album.albumName)
        allFavouriteAlbums = await albumsCollection.find({ name: { $in: favouriteAlbumnames } }).toArray()
    

        // Be possible use the image(base64) from the database
        allFavouriteAlbums = allFavouriteAlbums.map(album => {
            if (album.image && album.image.buffer) {
              // Assuming the binary data is in a Buffer; adjust as necessary based on your actual data structure
              album.image = `data:image/jpeg;base64,${album.image.buffer.toString('base64')}`
            }
            return album
          })

        res.json(allFavouriteAlbums) // Send Favourite albums data as JSON response
    } catch (error) {
        console.error("Error executing query or connecting to the database: ", error.message)
        return res.status(500).json({ "GetFavouriteAlbums": "error" })
    }
} 

export default GetFavouriteAlbums