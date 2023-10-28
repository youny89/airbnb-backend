import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan';
import cookieParser from 'cookie-parser';


import auth from './routes/auth.js';


dotenv.config();
import connectDB from './db.js';

connectDB();

const app = express();


app.use(express.json())
app.use(cookieParser())


if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use('/api/auth', auth)

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT,()=> console.log(`✔ ${process.env.NODE_ENV} 서버시작`));

process.on('unhandledRejection', (err, promise) => {
    console.log(err)
    // 서버 종료
    server.close(()=> process.exit(1));
})