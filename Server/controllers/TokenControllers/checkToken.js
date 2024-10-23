// Import needed libraries.
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

// Check if user's token is valid.
function CheckToken (req, res) {
    try {
        // Check if token exists.
        let accessToken = req.headers.authorization

        if (!accessToken) {
            return res.status(401).json({ error: "No token" })
        }

        // Check if token is expired.
        accessToken = accessToken.split(' ')[1]
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    
        return res.status(200).json( { status: "Okay" } )
    } catch (error) {
        return res.status(401).json({ error: "Token expired" })
    }
}

export default CheckToken