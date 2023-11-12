import expressAsyncHandler from "express-async-handler";

import Reservation from "../models/Reservation.js";
import Listing from "../models/Listing.js";


// DELETE: api/reservations/:id
// 숙소 예약 취소하기
export const cancelReservation = expressAsyncHandler(async(req,res) => {
    const { id } = req.params;
    if(!id) return res.status(400).json('예약 ID가 필요합니다.')

    const reserveration = await Reservation.findById(id).populate('listing');
    console.log('reservation : ', reserveration)
    if(!reserveration) return res.status(404).json('해당 예약을 찾을 수 없습니다.')

    if(
        (reserveration.user.toString() === req.userId) || // 숙소 예약한 손님이 취소하는 경우 
        (reserveration.listing.user.toString() === req.userId) // 주인장이 예약 취소하는 경우
    ) {
        await reserveration.deleteOne();
        const listing = await Listing.findById(reserveration.listing);
        const updatedReservations = listing.reservations.filter(reservationId=> reservationId.toString() !== id.toString());
        listing.reservations = updatedReservations;
        await listing.save();
        res.status(200).json('숙소 예약 취소 완료')
    } else {
        res.status(401).json('해당 예약을 취소 할수 없습니다.');
    }

})

// POST: api/reservations
// 숙소 예약하기
export const createReservation = expressAsyncHandler(async(req,res,next) => {
    const {
        listId,
        startDate,
        endDate,
        totalPrice
    } = req.body;

    const listing = await Listing.findById(listId);
    if(!listing) return res.status(404).json('해당 숙소를 찾을수 없습니다.')

    const newReservation = await Reservation.create({
        startDate,
        endDate,
        totalPrice,
        user: req.userId,
        listing: listId        
    });

    listing.reservations = [...listing.reservations, newReservation._id];
    await listing.save();

    return res.status(200).json(newReservation);    
})

// GET: api/reservations
// 예약 정보 불러오기 (query에 의존함)
export const getReservations = expressAsyncHandler(async(req,res,next) => {
    const { listId, userId, creatorId } = req.query;

    // find all reservations that other users made our listings
    if(creatorId) {
        const listing = await Listing.findOne({user: creatorId})
        const reservations = await Reservation.find({
            _id : { $in : listing.reservations }
        }).populate('listing');

        return res.status(200).json(reservations);
     } else {

        const query = {};

        // find all reservations for single listing. (ex. listing detail view.)
        if(listId) query.listing = listId;
    
        // find all of the trips a user have (ex. a user clicked trip on nav.)
        if(userId) query.user = userId;
    
        const reservations = await Reservation.find(query).populate('listing').sort({created:'desc'});
    
        return res.status(200).json(reservations);
     }   
});