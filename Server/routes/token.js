import express from "express"

// Import controllers.
import CheckToken from "../controllers/TokenControllers/checkToken.js"
import RefreshToken from "../controllers/TokenControllers/refreshToken.js"

const router = express.Router()

// Check if token exists and is not expired.
router.get("/check-token", CheckToken)

// Refresh access token.
router.get("/refresh-token", RefreshToken)

export default router