// Import database client.
import client from "../../config/database.js"

// Import needed libraries.
import jwt from "jsonwebtoken"

// Get a specific artist's all songs.
async function GetArtistsSongs (req, res) {
    let allAlbums
    let favourite
    let allSongs
    let token = req.headers.authorization

    try { 
        if (!token) {
            return res.status(401).json({ error: "Unauthorized access" })
        }
    
        token = token.split(' ')[1]
    
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const username = decode.username

        const artists = req.query.name

        // Finding the client and the right collection
        const albums = client.db("EchoBond").collection("Albums")

        // returns all the albums from the artist 
        allAlbums = await albums.find({artist:artists}).toArray()
        allAlbums = allAlbums.map(album => {
            if (album.image && album.image.buffer) {
              // Assuming the binary data is in a Buffer adjust as necessary based on your actual data structure
              album.image = `data:image/jpeg;base64,${album.image.buffer.toString('base64')}`
            }
            return album
          })
        
        const Songs = client.db("EchoBond").collection("Songs")
        allSongs = await Songs.find({artist:artists}, 
            { projection: { title: 1, artist: 1, time: 1, image: 1 }}
        ).toArray()
        allSongs = allSongs.map(song => {
            if (song.image && song.image.buffer) {
              // Assuming the binary data is in a Buffer adjust as necessary based on your actual data structure
              song.image = `data:image/jpeg;base64,${song.image.buffer.toString('base64')}`
            }
            return song
          })

          const favourites = client.db("EchoBond").collection("Favourites")
          favourite = await favourites.find({username:username, artistName:artists}).toArray()
          if(favourite.length === 0){
              favourite = false
          }

        res.json({albums:allAlbums , songs:allSongs,isFavorite:favourite}) // Send albums data as JSON response
    } catch (error) {
        console.error("Error executing query or connecting to the database: ", error.message)
        return res.status(500).json({ "GetArtistsSongs": "error" })
    }
} 

export default GetArtistsSongs