// Import database client.
import client from "../../config/database.js"

// Get a song's data (artist, title, image, time)
async function GetSongData (req, res) {
    let songTitle = req.query.songTitle

    try {
        const songs = client.db("EchoBond").collection("Songs")
        const song = await songs.findOne({ title: songTitle }, 
            { projection: { title: 1, artist: 1, time: 1, image: 1 }}
        )

        if (song.image && song.image.buffer) {
            // Assuming the binary data is in a Buffer; adjust as necessary based on your actual data structure
            songs.image = `data:image/jpeg;base64,${song.image.buffer.toString('base64')}`
        }

        res.status(200).json(song)
    } catch (error) {
        console.log(error)
        res.status(500).json("Get song error")
    }
} 

export default GetSongData