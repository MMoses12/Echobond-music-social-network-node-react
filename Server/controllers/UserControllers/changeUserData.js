// Import needed libraries.
import jwt from "jsonwebtoken"

// Import functions.
import ChangeCountry from "./changeCountry.js"
import ChangeEmail from "./changeEmail.js"
import ChangePassword from "./changePassword.js"

// Change all data for the user.
async function ChangeUserData (req,res) {
    let token = req.headers.authorization
    
    // Get new country from the user
    let newCountry = req.body.country
    let newEmail = req.body.email
    let oldPassword = req.body.oldPassword
    let newPassword = req.body.password
    
    try {
        if (!token) {
            return res.status(401).json({ error: "Unauthorized access" })
        }

        token = token.split(' ')[1]

        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const username = decode.username
            
        if (newCountry) {
            const changed = await ChangeCountry(username, newCountry)

            if (!changed) {
                res.status(500).json({ error: "Error in change country!" })
            }
        }

        if (newEmail) {
            const changed = await ChangeEmail(username, newEmail)

            if (!changed) {
                res.status(500).json({ error: "Error in change email!" })
            }
        }

        if (newPassword) {
            const changed = await ChangePassword(username, oldPassword, newPassword)

            if (!changed) {
                res.status(500).json({ error: "Error in change password!" })
            }
        }
        
        res.status(200).json({ message: "Changed" })
    } catch (error) {
    }
}

export default ChangeUserData