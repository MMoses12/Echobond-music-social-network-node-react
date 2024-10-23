// Import database client.
import client from "../../config/database.js"

// Import needed libraries.
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import { SMTPClient } from "emailjs"

dotenv.config()

// Change user's password and send it to his email.
async function ForgotPassword (req, res) {
    const username = req.body.username

    try {
        let users = client.db("EchoBond").collection("Users")

        const user = await users.findOne({ username: username }, { projection: { email: 1 } })

        if (!user || !user.email) {
            return res.status(404).json({ error: "User not found or no email associated with this user." })
        }

        const email = user.email

        // Make the one time password with 8 characters.
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
        let password = ''
        for (let i = 0; i < 8; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length)
            password += chars[randomIndex]
        }

        // Send the email with the password.
        const emailClient = new SMTPClient({
            user: process.env.MAIL_USER,
            password: process.env.MAIL_PASS,
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            tls: true
        })

        // Message to be sent.
        const message = {
            text: `Your new password is: ${password}`,
            from: process.env.MAIL_USER,
            to: email,
            subject: "New password",
        }

        // Send message.
        await new Promise((resolve, reject) => {
            emailClient.send(message, (err, message) => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })

        // Hash password and save it in the database.
        const hashedPassword = await bcrypt.hash(password, 10)

        // Insert password in user database.
        await users.updateOne({ username: username }, { $set: { password: hashedPassword } })

        return res.status(200).json({ message: "New password has been sent to your email." })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}

export default ForgotPassword
