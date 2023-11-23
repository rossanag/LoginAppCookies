
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import https from 'https';
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



const options = {
  key: fs.readFileSync('./certs/localhost-key.pem'),
  cert: fs.readFileSync('./certs/localhost.pem'),
};

app.use(cookieParser());
app.use(cors(corsOptions)); 
app.use(credentials)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Gmail authentication

app.use('/oauth/google', gmailRouter);
app.use('/protected', handleAuthorization, verifyGmailAccessToken, gmailRouter)

//Common routes
createCommonRoutes(app);


connectDB();
app.use(handleError)

const httpsServer = https.createServer(options, app);
httpsServer.listen(process.env.PORT, () => console.log(`Server is running at port`, process.env.PORT));

//app.listen(process.env.PORT, () => console.log(`Server is running at port`, process.env.PORT));
