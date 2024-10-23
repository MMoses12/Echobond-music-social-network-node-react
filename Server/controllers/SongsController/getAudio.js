// Import database client.
import client from "../../config/database.js"

// Get a song's audio.
async function GetAudio (songTitle) {
    try {
        const songs = client.db("EchoBond").collection("Songs")
        const song = await songs.findOne({ title: songTitle }, 
            {projection: { data: 1 }}
        )

        const audioData = song.data.buffer // Get the buffer from the Binary data
        const buffer = Buffer.from(audioData)

        return buffer
    } catch (error) {
        console.log(error)
        return null
    }
} 

export default GetAudio