import express from 'express'
import { body } from 'express-validator'
import { refresh, signin, signup } from '../controllers/auth.js'
import User from '../models/User.js';

const router = express.Router();


router.get('/refresh',refresh);

router.post('/signin',
    [
        body("email").notEmpty().withMessage('이메일을 입력해주세요'),
        body("password").notEmpty().withMessage('비밀번호를 입력해주세요')
    ],
    signin)

router.post(
    '/signup',
    [
        body('email')
            .isEmail()
            .withMessage('올바른 이메일 형식이 아닙니다.')
            .custom(async(value) => {
                const user = await User.findOne({email: value})
                if(user) throw new Error('이미 존재하는 메일 주소입니다. 다른 메일 주소를 골라주세요.')
                return true;
            }),
            body("password")
                .isLength({min:6})
                .withMessage('최소 6 글자 이상 입력해주세요')

    ],
    signup)

export default router;