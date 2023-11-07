import expressAsyncHandler from "express-async-handler";


import Listing from '../models/Listing.js';
import User from "../models/User.js";

// POST: /api/listings/favorites/:id 
// 관심 숙소 추가 
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
// TODO: filtering
export const getLists = expressAsyncHandler(async(req,res,next) => {
    const listings = await Listing.find({});

    return res.status(200).json(listings)
});