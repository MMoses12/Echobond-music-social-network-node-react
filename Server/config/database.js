// Import MongoDB library.
import { MongoClient } from "mongodb"

// Connect to mongoDB
const uri = "mongodb+srv://EchoBond:echobond2024@echobond.awedfnh.mongodb.net/?retryWrites=true&w=majority&appName=EchoBond";
const client = new MongoClient(uri)

export default client