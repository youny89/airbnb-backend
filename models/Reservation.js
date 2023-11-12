import mongoose from 'mongoose'

const ReservationSchema = new mongoose.Schema({
    startDate:{ type:Date },
    endDate: { type: Date },
    totalPrice: Number,

    user: { type: mongoose.Types.ObjectId, ref:"User"}, // 예약한 손님.
    listing: { type: mongoose.Types.ObjectId, ref:"Listing"},
},{ timestamps: true})

export default mongoose.model('Reservation', ReservationSchema);