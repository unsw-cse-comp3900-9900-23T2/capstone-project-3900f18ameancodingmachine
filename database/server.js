import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import { router as userRouter } from './routes/user.router.js';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/user", userRouter);
app.use(express.static('public'));

const server = app.listen(process.env.SERVER_PORT, () => {
    console.log("Server is up and running on port ", process.env.SERVER_PORT)
});

export { app, server }