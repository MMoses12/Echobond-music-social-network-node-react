import express from "express"

// Controller imports.
import GetSongData from "../controllers/SongsController/getSongData.js"
import GetAllSongs from "../controllers/SongsController/getAllSongs.js"

const router = express.Router()

// Get a specific song.
router.get("/get-song-data", GetSongData)

// Get all songs from the database.
router.get("/get-all-songs", GetAllSongs)

export default router