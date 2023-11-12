import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Listing from "../models/Listing.js";

export const getFavorites = asyncHandler(async(req,res,next) => {
    const user = await User.findById(req.userId);
    const listings = await Listing.find({ _id : { $in: user.favorites }});
    console.log('listings: ',listings);
    return res.status(200).json(listings);
});

export const getMe = asyncHandler(async (req,res,next) => {
    const user = await User.findById( req.userId);
    if(!user) return res.status(404).json(null);
    const { password:_, ...others } = user._doc;

    return res.status(200).json(others);
});

export const getMyListings = asyncHandler(async (req,res,next) => {
    const listings = await Listing.find({user: req.userId});
    return res.status(200).json(listings);
});