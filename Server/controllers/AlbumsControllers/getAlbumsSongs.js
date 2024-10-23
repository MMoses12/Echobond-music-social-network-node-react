// Import database client.
import client from "../../config/database.js"

// Import needed libraries.
import jwt from "jsonwebtoken"

// Get all songs from a specific album.
async function GetAlbumSongs (req, res) {
    // Check if user's token is valid.
    let allAlbumSongs
    let favourite
    let token = req.headers.authorization

    try {
        if (!token) {
            return res.status(401).json({ error: "Unauthorized access" })
        }

        token = token.split(' ')[1]

        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const username = decode.username

        const albumTitle = req.query.name

        // Finding the client and the right collection
        const Songs = client.db("EchoBond").collection("Songs")
        // Returns all the albums 
        allAlbumSongs = await Songs.find({ album:albumTitle },
            {projection: {title: 1, artist: 1, album: 1,time: 1,image: 1}}).toArray()

        // Get all the song's images.
        allAlbumSongs = allAlbumSongs.map(songs => {
            if (songs.image && songs.image.buffer) {
                // Assuming the binary data is in a Buffer adjust as necessary based on your actual data structure
                songs.image = `data:image/jpeg;base64,${songs.image.buffer.toString('base64')}`
            }
            return songs
        })
        
        const favourites = client.db("EchoBond").collection("Favourites")
        favourite = await favourites.find({username:username, albumName:albumTitle}).toArray()
        if(favourite.length === 0){
            favourite = false
        }

        res.json({ albums: allAlbumSongs, isFavorite:favourite}) // Send albums data as JSON response
    } catch (error) {
        console.error("Error executing query or connecting to the database: ", error.message)
        return res.status(500).json({ "getAlbumSongs": "error" })
    }
} 

export default GetAlbumSongs