// Import database client.
import client from "../../config/database.js"

// Import needed libraries.
import jwt from "jsonwebtoken"

// Get a specific user's data.
async function GetUserInfo(req, res) {
    let token = req.headers.authorization

    try {
        if (!token) {
            return res.status(401).json({ error: "Unauthorized access" })
        }
        token = token.split(' ')[1]
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const username = decode.username

        let users = client.db("EchoBond").collection("Users")

        const userInfo = await users.findOne(
            { username: username },
            { projection: { username: 1, email: 1, Photo: 1, Country: 1 } }
        )

        if (userInfo && userInfo.Photo) {
            // Convert the photo buffer to a Base64 string
            userInfo.Photo = `data:image/jpeg;base64,${userInfo.Photo.toString('base64')}`
        }

        res.status(200).json({ userInfo: userInfo })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error fetching user info.', error: error.message })
    }
}

export default GetUserInfo