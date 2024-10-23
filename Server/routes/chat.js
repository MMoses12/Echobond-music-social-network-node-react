import express from "express"

// Import controllers.
import GetConversationID from "../controllers/MessageControllers/getConversationID.js"

const router = express.Router()

// Get the conversationID for a friend.
router.post("/get-conversation-id", GetConversationID)

export default router