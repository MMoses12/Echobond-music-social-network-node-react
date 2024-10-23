import express from "express"

// Import controllers.
import GetAllArtists from "../controllers/ArtistsControllers/getAllArtists.js"
import GetArtistsSongs from "../controllers/ArtistsControllers/getArtistsSong.js"

const router = express.Router()

// Get all artists from the database.
router.get("/get-all-artists", GetAllArtists)

// Get a specific artist's all songs.
router.get("/get-artists-songs", GetArtistsSongs)

export default router