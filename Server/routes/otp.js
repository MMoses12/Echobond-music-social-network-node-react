import express from "express"

// Import controllers.
import SendOTP from "../controllers/OTPControllers/sendOTP.js"

const router = express.Router()

// Send one time password to user's email.
router.post("/send-otp", SendOTP)

export default router