import mongoose from 'mongoose'

const ListingModel = new mongoose.Schema({
    title:String,
    description:String,
    imageSrc:String,
    category:String,
    roomCount:Number,
    bathroomCount:Number,
    guestCount:Number,
    locationValue:String,
    price:Number,
    user: {
        type: mongoose.Types.ObjectId,
        ref:"User"
    },
    reservations: [{
        type: mongoose.Types.ObjectId,
        ref:"Reservation"
    }],
},{
    timestamps: true
});

export default mongoose.model('Listing', ListingModel);