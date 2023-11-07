import asyncHandler from "express-async-handler";
import User from "../models/User.js";

export const getMe = asyncHandler(async (req,res,next) => {
    const user = await User.findById( req.userId);
    if(!user) return res.status(404).json(null);
    const { password:_, ...others } = user._doc;

    return res.status(200).json(others);
});