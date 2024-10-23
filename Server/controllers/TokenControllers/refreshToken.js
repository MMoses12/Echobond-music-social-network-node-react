// Import needed libraries.
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

// Refresh the accessToken using refreshToken.
async function RefreshToken(req, res) {
    let refreshToken = req.headers.authorization

    if (!refreshToken) {
        return res.status(401).json({ error: "Refresh token not provided" })
    }
    
    refreshToken = refreshToken.split(" ")[1]

    try {
        // Verify the refresh token
        let payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        
        // Remove any sensitive or unnecessary fields from the payload
        const { exp, iat, ...newPayload } = payload

        // Create a new access token with the updated payload
        const accessToken = jwt.sign(newPayload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })

        return res.status(200).json({ accessToken: accessToken })
    } catch (err) {
        console.error("Error verifying refresh token: ", err.message)
        return res.status(401).json({ error: "Invalid refresh token" })
    }
}

export default RefreshToken
