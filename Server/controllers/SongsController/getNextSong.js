// Import database client.
import client from "../../config/database.js"

// Get next song from the same album.
async function GetNextSong (songTitle) { 
    try {
        // Find the album of the playing song.
        const songs = client.db("EchoBond").collection("Songs")
        
        // Fetch the current song to find its album
        const currentSong = await songs.findOne({ title: songTitle }, 
            { projection: { album: 1 } }
        )

        const albumTitle = currentSong.album

        // Fetch the list of songs in the album ordered by their natural order (using _id)
        const albumSongs = await songs.find({ album: albumTitle },
            { projection: { title: 1, artist: 1, time: 1, image: 1 }}
        ).sort({ _id: 1 }).toArray()

        // Find the index of the current song
        const currentSongIndex = albumSongs.findIndex(song => song.title === songTitle)

        // Check if there's a next song in the album
        if (currentSongIndex >= 0 && currentSongIndex < albumSongs.length - 1) {
            const nextSong = albumSongs[currentSongIndex + 1]
            
            // Fetch the next song's data
            const nextSongData = await songs.findOne({ _id: nextSong._id }, 
                { projection: { title: 1, artist: 1, time: 1, image: 1 }}
            )

            if (nextSongData.image && nextSongData.image.buffer) {
                // Assuming the binary data is in a Buffer adjust as necessary based on your actual data structure
                nextSongData.image = `data:image/jpeg;base64,${nextSongData.image.buffer.toString('base64')}`
            }

            return nextSongData
        } else {
            // No next song found or the current song is the last one in the album
            return null
        }
    } catch (error) {
        console.log(error)
        return null
    }
}

export default GetNextSong