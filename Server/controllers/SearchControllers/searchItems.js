// Import database client.
import client from "../../config/database.js"

// Import needed libraries.
import jwt from 'jsonwebtoken'

// Add searched items to search history.
async function SearchItems(req, res) {
    try {
        // Verify token.
        let token = req.headers.authorization
        if (!token) {
            return res.status(401).json({ error: "Unauthorized access" })
        }

        token = token.split(' ')[1]
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const username = decode.username

        let title = req.body.name
        let type = req.body.type
        
        // Insert searched into history.
        let history = client.db("EchoBond").collection("History")

        if (history.countDocuments({}) != 0) {
            await history.findOneAndDelete ({title : title, type : type, username : username})
        }

        await history.insertOne({ title : title, type : type, username : username})

        res.status(200).json({  message : "History has been updated" })
    } catch (error) {
        console.error("Error retrieving recent history:", error)
        res.status(500).json({ message: 'Error retrieving recent history.', error: error.message })
    }
}

export default SearchItems