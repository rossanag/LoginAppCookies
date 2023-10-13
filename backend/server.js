
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
// const jwt = require("jsonwebtoken");

dotenv.config();

import corsOptions from './config/corsOptions.js';
//import createGmailRoutes from './routes/gmailRoutes.js';
import createCommonRoutes from './routes/common.js';
import credentials from './middleware/credentials.js';
import gmailRouter from './routes/gmailRouter.js';

const app = express();

app.use(cors(corsOptions)); 
app.use(credentials)
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

//createGmailRoutes(app)
app.use('/oauth/google', gmailRouter)
createCommonRoutes(app);

app.listen(process.env.PORT, () => console.log(`Server is running at port`, process.env.PORT));