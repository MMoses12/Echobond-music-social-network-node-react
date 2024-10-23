import express from "express"

// Import controllers.
import GetSearch from "../controllers/SearchControllers/getSearch.js"
import SearchItems from "../controllers/SearchControllers/searchItems.js"

const router = express.Router()

// Get search items.
router.get("/get-search", GetSearch)

// Add searched items to history.
router.put("/search-items", SearchItems)

export default router