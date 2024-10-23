// Import database client.
import client from "../../config/database.js"

// Import needed libraries.
import { Buffer } from 'buffer'
import sharp from 'sharp'
import jwt from "jsonwebtoken"

// Change user's profile picture.
// Insert the image binary into the database.
async function ChangeProfileImage (req, res) {
    let token = req.headers.authorization
    let image = req.body.image // get image with base64 encode

    // Remove the 'data:image/jpegbase64,' or similar prefix if present
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "")

    try {
        if (!token) {
            return res.status(401).json({ error: "Unauthorized access" })
        }

        token = token.split(' ')[1]

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const username = decoded.username

        const imageBuffer = Buffer.from(base64Data, 'base64')

        // Process the image using sharp
        const processedImage = await sharp(imageBuffer)
            .resize(100, 100) // Resize to 100x100 pixels
            .jpeg({ quality: 90 }) // Convert to JPEG with 90% quality
            .toBuffer() // Convert to a buffer for insertion

        const users = client.db("EchoBond").collection("Users")

        // Update the user's photo in the database
        const updateResult = await users.updateOne(
            { username: username },
            { $set: { Photo: processedImage } }  // Storing the image as binary
        )

        if (updateResult.matchedCount === 0) {
            return res.status(404).json({ message: "User not found" })
        }

        return res.status(200).json({ message: "Profile image successfully updated" })
    } catch (error) {
        console.error("Error updating profile image:", error)
        return res.status(500).json({ error: "Internal server error", errorMessage: error.message })
    }
}

export default ChangeProfileImage
