import Token from '../models/Token.js';

export const authenticate = (req,res,next) => {
    const authorization = req.headers.authorization;
    console.log('auth middleware req.headers : ', req.headers);
    if(!authorization) return res.status(400).json({msg:"로그인 해주세요"})

    const accessToken = authorization.startsWith('Bearer') && authorization.split('Bearer ')[1];
    if(!accessToken) return res.status(400).json({msg:"로그인 해주세요"})

    try {
        const verifiedToken = Token.verifyAccessToken(accessToken);
        req.userId = verifiedToken.id;
        next();
    } catch (error) {
        console.log('error in authenticate', error)
        if(error.name === 'TokenExpiredError'){
            return res.status(400).json({
                message:"토큰 유효기간 만료"
            })
        } 
        return res.status(500).json({message:"서버에러"});
    }
}