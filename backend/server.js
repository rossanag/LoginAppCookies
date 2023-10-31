
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
// const jwt = require("jsonwebtoken");

import corsOptions from './config/corsOptions.js';
import connectDB from './config/dbConn.js';
import createCommonRoutes from './routes/common.js';
import credentials from './middleware/credentials.js';
import gmailRouter from './routes/gmailRouter.js';
import { handleError } from './middleware/error.js';
import { handleAuthorization, verifyGmailAccessToken } from './middleware/gmailMiddleware.js';

dotenv.config();

const app = express();

app.use(cors(corsOptions)); 
app.use(credentials)
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Gmail authentication

app.use('/oauth/google', handleAuthorization, verifyGmailAccessToken, gmailRouter);

//app.use('/oauth/google/logout', handleAuthorization, verifyGmailToken, gmailRouter);
//app.use('/logout', handleAuthorization, verifyGmailToken)
//app.use('/logout', gmailRouter)
// Define specific route for logout and attach middlewares and router to it


createCommonRoutes(app);

app.use(handleError)
connectDB();

app.listen(process.env.PORT, () => console.log(`Server is running at port`, process.env.PORT));