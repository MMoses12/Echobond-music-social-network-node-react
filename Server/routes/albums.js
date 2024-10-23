import express from "express"

// Controller imports.
import GetAllAlbums from "../controllers/AlbumsControllers/getAllAlbums.js"
import GetAlbumSongs from "../controllers/AlbumsControllers/getAlbumsSongs.js"

const router = express.Router()
// Get one album's songs.
router.get("/get-album-songs", GetAlbumSongs)

// Get all the albums in the database.
router.get("/get-all-albums", GetAllAlbums)

export default router