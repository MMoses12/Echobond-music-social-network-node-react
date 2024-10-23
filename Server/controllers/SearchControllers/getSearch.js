// Import database client.
import client from "../../config/database.js"

// Import needed libraries.
import jwt from 'jsonwebtoken'

// Get search results, with albums, artists and songs.
async function GetSearch(req, res) {
    let albumResults
    let artistResults 
    let songResults

    try {
        // Verify token.
        let token = req.headers.authorization
        if (!token) {
            return res.status(401).json({ error: "Unauthorized access" })
        }

        token = token.split(' ')[1]
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        let searchValue = req.query.value
        
        let album = client.db("EchoBond").collection("Albums")
        let artist = client.db("EchoBond").collection("Artists")
        let song = client.db("EchoBond").collection("Songs")
        
        albumResults = await album.find({
            $or: [
                { name: new RegExp(searchValue, 'i') }
            ]
        }).toArray()
        albumResults = albumResults.map(album => {
            if (album.image && album.image.buffer) {
              // Assuming the binary data is in a Buffer adjust as necessary based on your actual data structure
              album.image = `data:image/jpeg;base64,${album.image.buffer.toString('base64')}`
            }
            return album
        })


        artistResults = await artist.find({
            $or: [
                { name: new RegExp(searchValue, 'i') }
            ]
        }).toArray()

        artistResults = artistResults.map(artist => {
            if (artist.image && artist.image.buffer) {
              // Assuming the binary data is in a Buffer adjust as necessary based on your actual data structure
              artist.image = `data:image/jpeg;base64,${artist.image.buffer.toString('base64')}`
            }
            return artist
        })


        songResults = await song.find({ title: new RegExp(searchValue, 'i') }, 
            {projection: { title: 1, artist: 1, time: 1, image: 1 }}
        ).toArray()

        songResults = songResults.map(song => {
            if (song.image && song.image.buffer) {
              // Assuming the binary data is in a Buffer adjust as necessary based on your actual data structure
              song.image = `data:image/jpeg;base64,${song.image.buffer.toString('base64')}`
            }
            return song
        })

        res.status(200).json({  albums : albumResults,artists: artistResults,songs: songResults})
    } catch (error) {
        console.error("Error retrieving recent history:", error)
        res.status(500).json({ message: 'Error retrieving recent history.', error: error.message })
    }
}

export default GetSearch