import asyncHandler from 'express-async-handler';
import bcyrpt from 'bcrypt';
import { validationResult } from 'express-validator';

import User from '../models/User.js';
import Token from '../models/Token.js';

export const signin = asyncHandler(async (req,res,next) => {
    const error = validationResult(req);
    if(!error.isEmpty()) return res.status(400).json(error.mapped());

    const { email, password} = req.body;
    const user = await User.findOne({email});
    if(!user) return res.status(400).json({message:'이메일 혹은 비밀번호가 일치하지 않습니다'})

    const isMatched = await bcyrpt.compare(password, user.password);
    if(!isMatched) return res.status(400).json({message:'이메일 혹은 비밀번호가 일치하지 않습니다.'})


    const accessToken = Token.generateAccessToken(user);
    const refreshToken = Token.generateRefreshToken(user);

    const tokenWithUser = await Token.findOne({ user: user.id });
    if(tokenWithUser) {
        tokenWithUser.refreshToken = refreshToken;
        await tokenWithUser.save();
    } else {
        await Token.create({user: user._id, refreshToken})
    }

    const { password:_, ...others} = user._doc;

    res.cookie('refreshToken',refreshToken, {
        maxAge: 24 * 60 * 60 * 1000 * process.env.JWT_COOKIE_EXPIRE,
        httpOnly:true
    })
        .status(200)
        .json({accessToken, ...others})
})

export const signup = asyncHandler(async (req,res,next) => {
    const error = validationResult(req);
    if(!error.isEmpty()) return res.status(400).json(error.mapped());

    const { email,password,name } = req.body;
    const hashedPassword = await bcyrpt.hash(password,10);

    const newUser = await User.create({name,email, password: hashedPassword});
    const { password:_, ...others } = newUser._doc;
    const accessToken = Token.generateAccessToken(newUser);
    const refreshToken = Token.generateRefreshToken(newUser)

    const tokenWithUser = await Token.findOne({ user: newUser.id });
    if(tokenWithUser) {
        tokenWithUser.refreshToken = refreshToken;
        await tokenWithUser.save();
    } else {
        await Token.create({ user: newUser._id, refreshToken });
    }


    res.cookie('refreshToken',refreshToken, {
        maxAge: 24 * 60 * 60 * 1000 * process.env.JWT_COOKIE_EXPIRE,
        httpOnly:true
    })
        .status(200)
        .json({accessToken, ...others})

})


export const refresh = asyncHandler(async (req,res,next) => {
    const refreshToken = req.cookies?.refreshToken;
    if(!refreshToken) return res.status(401).json({message:'토큰이 없습니다.'})

    const verifiedToken = Token.verifyRefreshToken(refreshToken);
    const tokenData = await Token.findOne({ user: verifiedToken.id});
    if(!tokenData) return res.status(404).json({message:'재발급 토큰을 찾을수 없습니다.'})

    const user = await User.findById(tokenData.user);
    const { password, ...others } = user._doc;
    const resetAccessToken = Token.generateAccessToken(user);
    const resetRefreshToken = Token.generateRefreshToken(user);

    tokenData.refreshToken = resetRefreshToken;
    await tokenData.save();

    res.cookie('refreshToken',refreshToken, {
        maxAge: 24 * 60 * 60 * 1000 * process.env.JWT_COOKIE_EXPIRE,
        httpOnly:true
    })
        .status(200)
        .json({accessToken:resetAccessToken, ...others})

});