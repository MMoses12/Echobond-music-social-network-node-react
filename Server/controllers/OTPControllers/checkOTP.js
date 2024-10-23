// Import database client.
import client from "../../config/database.js"

// Import needed libraries.
import bcrypt from "bcrypt"
import dotenv from "dotenv"

dotenv.config()

// Check if inserted one time password
// is correct.
async function CheckOTP (user) {
    // Get user's email and inserted OTP.
    const { email, insertedOTP } = user

    try {
        let otpCollection = client.db("EchoBond").collection("OTP")
        // Search sent based on user's email.
        let otpFound = await otpCollection.findOne({ email: email })

        // Check if the password has expired.
		const dateNow = new Date(Date.now())
		const timestamp = Date.parse(otpFound.requestDate) + 1000 * 60 * 5
		const dateExpire = new Date(timestamp)

        // If otp expired or inserted OTP is not correct.
        if (dateExpire < dateNow || !await bcrypt.compare(insertedOTP, otpFound.otp)) {
            return false
        }

        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export default CheckOTP