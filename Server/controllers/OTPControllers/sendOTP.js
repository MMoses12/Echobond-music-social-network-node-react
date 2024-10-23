// Import database client.
import client from "../../config/database.js"

// Import needed libraries.
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import { SMTPClient } from "emailjs"

// Import functions.
import FindUser from "../findUser.js"

dotenv.config()

// Send OTP to the user's email.
async function SendOTP (req, res) {
    // Get user data from request body.
    const { username, email, register } = req.body

    // Security check.
    if (!username && !email) {
        return
    }

    try {
        // If a user tries to register.
        if (register) {
            let userFound = await FindUser({ username, email })

            // If a user with this username or email
            // already exists.
            if (userFound) {
                res.status(400)
                return
            }
        }

        // Make the one time password with 4 digits.
		let otp = Math.floor(Math.random() * (9000 - 1000 + 1) + 1000)

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
			text: `Your one-time password is: ${otp}`,
			from: process.env.MAIL_USER,
			to: email,
			subject: "Register one-time password",
		}

        // Send message.
        await new Promise((resolve, reject) => {
			emailClient.send(message, (err, message) => {
				if (err) {
					reject(err)
				} 
				else {
					resolve()
				}
			})
		})
        
        // Hash the one time password and save it in the database.
		otp = await bcrypt.hash(otp.toString(), 10)
		const requestDate = new Date(Date.now())

        // Insert otp in database.
        let otpCollection = client.db("EchoBond").collection("OTP")
        await otpCollection.updateOne({ email: email }, { $set: { otp: otp, requestDate: requestDate } }, { upsert: true })

        res.status(200).json({ SendOTP: "OK" })
    } catch (error) {
        console.log(error)
        res.status(500)
    }
}

export default SendOTP