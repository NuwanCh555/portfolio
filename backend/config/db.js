require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') })
const mongoose = require('mongoose')

const connectDB = async () => {
  const RETRY_DELAY = 10000  // 10 seconds between retries
  const connect = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 8000,
      })
      console.log(`✅ MongoDB connected: ${conn.connection.host}`)
    } catch (err) {
      console.error(`❌ MongoDB connection failed: ${err.message}`)
      console.log(`   ↻  Retrying in ${RETRY_DELAY / 1000}s...`)
      setTimeout(connect, RETRY_DELAY)
    }
  }
  await connect()
}

module.exports = connectDB
