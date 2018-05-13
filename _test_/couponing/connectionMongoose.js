import mongoose from 'mongoose'

const MONGO_URL = 'mongodb://localhost:27017/relevanc'
export default mongoose.createConnection(MONGO_URL);