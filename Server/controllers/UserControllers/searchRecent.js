// Import database client.
import client from "../../config/database.js"

// Import needed libraries.
import jwt from 'jsonwebtoken'

// Get a specific user's search history.
async function SearchRecent(req, res) {
    try {
        // Token-based user identification.
        let token = req.headers.authorization
        if (!token) {
            return res.status(401).json({ error: "Unauthorized access" })
        }

        token = token.split(' ')[1]
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const username = decode.username

        let history = client.db("EchoBond").collection("History")
        let alb = client.db("EchoBond").collection("Albums")
        let art = client.db("EchoBond").collection("Artists")
        let song = client.db("EchoBond").collection("Songs")

        const historyData = await history.find({ username: username })
            .sort({ _id: -1 })  // Assuming that the MongoDB ObjectId is used for ordering by time
            .limit(5)
            .toArray()

        if (historyData.length === 0) {
            return res.status(200).json({ albums: [], artists: [], songs: [] })
        }
        
        const albums = []
        const artists = []
        const songs = []
        
        for (const item of historyData){
            if (item.type === 'album') {
                const albumsDetails = await alb.find({ name: item.title }).toArray()
                const processedAlbums = albumsDetails.map(album => {
                    if (album.image && album.image.buffer) {
                        // Assuming the binary data is in a Buffer; adjust as necessary based on your actual data structure
                        album.image = `data:image/jpeg;base64,${album.image.buffer.toString('base64')}`
                    }
                    return album
                })
                albums.push(...processedAlbums)
            } else if (item.type === 'artist') {
                const artistDetails = await art.find({ name: item.title }).toArray()
                const processedArtists = artistDetails.map(artist => {
                    if (artist.image && artist.image.buffer) {
                        // Assuming the binary data is in a Buffer; adjust as necessary based on your actual data structure
                        artist.image = `data:image/jpeg;base64,${artist.image.buffer.toString('base64')}`
                    }
                    return artist
                })
                artists.push(...processedArtists)
            }
            else if (item.type === 'song') {
                // Assuming you have a songs collection and need to fetch details from there
                const songDetails = await song.find({ title: item.title },
                    {projection: { title: 1, artist: 1, time: 1, image: 1 }}
                ).toArray()

                const processedSongs = songDetails.map(songg => {
                    if (songg.image && songg.image.buffer) {
                        // Assuming the binary data is in a Buffer; adjust as necessary based on your actual data structure
                        songg.image = `data:image/jpeg;base64,${songg.image.buffer.toString('base64')}`
                    }
                    return songg
                })
                songs.push(...processedSongs)
            }
        }
        res.status(200).json({ albums: albums, artists:artists, songs:songs })
    } catch (error) {
        console.error("Error retrieving recent history:", error)
        res.status(500).json({ message: 'Error retrieving recent history.', error: error.message })
    }
}

export default SearchRecent