import axios from 'axios';
// const jwt = require("jsonwebtoken");
import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

// import { OAuth2Client, UserRefreshClient } from 'google-auth-library';

const app = express();

import url from 'url';
import cookieParser from 'cookie-parser';

import corsOptions from './config/corsOptions.js';
//import {setGmailAuth} from './controllers/gmaiControllers.js';
import createGmailRoutes from './routes/gmailRoutes.js';
import createCommonRoutes from './routes/common.js';

//import credentials from './middleware/credentials.js';


app.use(cors(corsOptions)); 
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


//const oAuth2Client = setGmailAuth();
createGmailRoutes(app)

createCommonRoutes(app);

app.listen(process.env.PORT, () => console.log(`Server is running at port`, process.env.PORT));