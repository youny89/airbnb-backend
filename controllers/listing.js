import expressAsyncHandler from "express-async-handler";

import Listing from '../models/Listing.js';
import Reservation from '../models/Reservation.js';
import User from "../models/User.js";

// DELETE: /api/listings/:id 
// 숙소 제거 
export const removeList = expressAsyncHandler(async(req,res,next) => {
    const { id } = req.params;
    if(!id) return res.status(400).json('숙소 Id가 필요합니다')

    const listing = await Listing.findById(id);
    if(!listing) return res.status(404).json('해당 숙소를 찾을 수 없습니다.')
    const haveToDeleteReservationIds = listing.reservations;
    if(req.userId.toString() !== listing.user.toString()) return res.status(403).json('해당 작업을 수행 할 수 없습니다')

    await listing.deleteOne();
    if(haveToDeleteReservationIds.length !== 0) {
        haveToDeleteReservationIds.forEach(async id => {
            await Reservation.findByIdAndDelete(id);
        })
    }

    return res.status(200).json('숙소 삭제 완료');
});

// DELETE: /api/listings/favorites/:id 
// 관심 숙소 삭제 
export const removeFavorite = expressAsyncHandler(async(req,res,next) => {
    const { id } = req.params;
    const user = await User.findById(req.userId);

    if(!user) return res.status(404).json('유저를 찾을 수 없습니다.')
    if(!id) return res.status(400).json('숙소 Id가 필요합니다')

    const updatedUser = await user.removeFavorite(id);
    if(!updatedUser) return res.status(400).json('먼저 관심 숙소에 추가 해주세요')

    return res.status(200).json(updatedUser);
});

// POST: /api/listings/favorites/:id 
// 관심 숙소 추가 
export const addFavorite = expressAsyncHandler(async(req,res,next) => {
    const { id } = req.params;
    const user = await User.findById(req.userId);

    if(!user) return res.status(404).json('유저를 찾을 수 없습니다.')
    if(!id) return res.status(400).json('숙소 Id가 필요합니다')

    const updatedUser = await user.addFavorite(id);
    if(!updatedUser) return res.status(400).json('이미 관심 숙소에 추가 되어 있습니다.')

    return res.status(200).json(updatedUser);
});

// POST: /api/listings 
// 숙소 등록 
export const createList = expressAsyncHandler(async(req,res,next) => {

    const listing = await Listing.create({
        ...req.body,
        locationValue:req.body.location.value,
        user: req.userId
    })
    res.json(listing);
});

// GET: /api/listings 
// 숙소 불러오기 
// TODO: QUERY FILTERING FOR SEARCHING
export const getLists = expressAsyncHandler(async(req,res,next) => {
    const {
        roomCount,
        guestCount,
        bathroomCount,
        locationValue,
        startDate,
        endDate,
        category
    } = req.query;


    const query = {}

    if(category) query.category = req.query.category;
    if(locationValue) query.locationValue = req.query.locationValue;
    if(roomCount) query.roomCount = { $gte: +roomCount };
    if(guestCount) query.guestCount = { $gte: +guestCount };
    if(bathroomCount) query.bathroomCount = { $gte: +bathroomCount };
    
    const q = Listing.find(query);
    
    if(startDate && endDate) {
        q.populate({
            path:'reservations',
            match:  {
                endDate: { $gte: startDate },
                startDate : { $lte: endDate}
            }
        })
    }    

    const listings = await q;
    // const listings = await Listing.find(query).populate('reservations');


    return res.status(200).json(listings)
});

// GET: /api/listings/:id 
// 하나의 숙소  불러오기 
export const getListDetail = expressAsyncHandler(async(req,res,next) => {
    const {id} = req.params;
    if(!id) return res.status(400).json('숙사 ID 필요')
    const list = await Listing.findById(id).populate('user','-password');
    if(!list) return res.status(404).json('해당 숙소를 찾을 수 없습니다.');

    return res.status(200).json(list)
});