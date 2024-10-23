// Import database client.
import client from "../../config/database.js"

// Import needed libraries.
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import CheckOTP from "../OTPControllers/checkOTP.js"

dotenv.config()

// Simple register function to insert new user's data
// in the database.
async function Register (req, res) {
    // Get user's data from request body.
    let { username, password, email, insertedOTP } = req.body

    try {
        if (!(await CheckOTP({ email, insertedOTP }))) {
            res.status(404).json({ Register: "Check OTP error" })
            return
        }

        // Connect in the database.
        await client.connect()

        const users = client.db("EchoBond").collection("Users")
        
        // Encrypt password.
        let encryptedPassword = await bcrypt.hash(password, 10)
        
        // Insert new user in the database.
        users.insertOne({ username: username, password: encryptedPassword, email: email })

        res.status(200).json({ Register: "Register OK" })
    } catch (error) {
        res.status(500).json({ error: "Register error" })
    }
}

export default Register