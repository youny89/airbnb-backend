import mongoose from 'mongoose'

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log('✔ 몽고DB 연결')
}

export default connectDB;