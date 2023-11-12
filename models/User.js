import mongoose from 'mongoose'
import crypto from 'crypto'

const UserSchema = new mongoose.Schema({
    name: { 
        type: String,
    },
    email: { 
        type: String,
        required:[true,'이메일을 입력해주세요.'],
        unique:true,
        match:[
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            '올바른 이메일 형식이 아닙니다.'
        ]
    },
    password:{
        type: String,
        required:[true, '비밀번호를 입력해주세요'],
        minlength:6
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
    confirmEmailToken:String,
    isEmailConfirmed:{
        type:Boolean,
        default: false
    },
    favorites:[{
        type:mongoose.Types.ObjectId,
        ref:"Listing"
    }]
},{
    timestamps: true
})

UserSchema.methods.removeFavorite = function (listingId) {
    const favorites = [...this.favorites || [] ];
    const foundFav = favorites.find(id=> id.toString() === listingId);
    if(!foundFav) return null;

    const updatedFav = favorites.filter(id=> id.toString() !== listingId );
    this.favorites = updatedFav;

    return this.save();
}
UserSchema.methods.addFavorite = function (listingId) {
    const favorites = [...this.favorites || [] ];
    const checkExists = favorites.find(id=> id.toString() === listingId);
    if(checkExists) return null;

    favorites.push(listingId)
    this.favorites = favorites;

    return this.save();
}

UserSchema.methods.generateResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')
    
    this.resetPasswordExpire = Date.now() + 1000 * 60 * 10

    return resetToken;
}

UserSchema.methods.generateEmailConfirmToken = function () {
    const confirmToken = crypto.randomBytes(20).toString('hex');

    this.confirmEmailToken = crypto
        .createHash('sha256')
        .update(confirmToken)
        .digest('hex')


    const confirmtokenExtend = crypto.randomBytes(100).toString('hex');
    const confirmTokenCombined = `${confirmToken}.${confirmtokenExtend}`;
    return confirmTokenCombined;
}

export default mongoose.model('User', UserSchema);