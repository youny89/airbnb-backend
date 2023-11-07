import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

const TokenSchema = new mongoose.Schema({
    user:{
        type: mongoose.Types.ObjectId,
        ref:"User"
    },
    refreshToken: {
        type:String,
        required:true
    }
},{
    timestamps: true
})


TokenSchema.statics.generateAccessToken = function (user) {
    return jwt.sign(
        {id: user._id},
        process.env.JWT_ACCESS_TOEKN_SECRET,
        { expiresIn: process.env.JWT_ACCESS_EXPIRE }
    )
}
TokenSchema.statics.generateRefreshToken = function (user) {
    return jwt.sign(
        {id: user._id},
        process.env.JWT_REFRESH_TOEKN_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRE }
    )
}

TokenSchema.statics.verifyAccessToken = function (accessToken) {
    const verifiedToken = jwt.verify(accessToken, process.env.JWT_ACCESS_TOEKN_SECRET)
    return verifiedToken;
}

TokenSchema.statics.verifyRefreshToken = function (refreshToken) {
    const verifiedToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOEKN_SECRET)
    return verifiedToken;
}

export default mongoose.model('Account', TokenSchema);