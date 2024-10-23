// Import database client.
import client from "../../config/database.js"

// Import needed libraries.
import jwt from "jsonwebtoken"

// Get recent played songs of a user.
async function GetRecentSongs(req, res) {
    try {
        let token = req.headers.authorization
        if (!token) {
            return res.status(401).json({ error: "Unauthorized access" })
        }
        token = token.split(' ')[1]
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        let username = decode.username

        const history = client.db("EchoBond").collection("Listened_History")
        const song = client.db("EchoBond").collection("Songs")

        const historyData = await history.find({ username: username })
            .sort({ _id: -1 })  // Assuming that the MongoDB ObjectId is used for ordering by time
            .limit(4)
            .toArray()

        if (historyData.length === 0) {
            return res.status(200).json({ songs: [] })
        }

        const songPromises = historyData.map(item =>
            song.find({ title: item.title }, {
                projection: {
                    title: 1,
                    artist: 1,
                    album: 1,
                    time: 1,
                    image: 1
                }
            }).toArray()
        )

        const songsData = await Promise.all(songPromises)

        const songs = songsData.flat().map(song => {
            if (song.image && song.image.buffer) {
                song.image = `data:image/jpeg;base64,${song.image.buffer.toString('base64')}`
            }
            return song
        })

        res.status(200).json({ songs: songs })
    } catch (error) {
        console.error("Error retrieving recent history:", error)
        res.status(500).json({ message: 'Error retrieving recent history.' })
    }
}

export default GetRecentSongs
