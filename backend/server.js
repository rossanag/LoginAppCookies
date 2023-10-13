import axios from 'axios';
// const jwt = require("jsonwebtoken");
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

import corsOptions from './config/corsOptions.js';
import createGmailRoutes from './routes/gmailRoutes.js';
import createCommonRoutes from './routes/common.js';
import credentials from './middleware/credentials.js';

const app = express();

app.use(cors(corsOptions)); 
app.use(credentials)
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

createGmailRoutes(app)
createCommonRoutes(app);

app.listen(process.env.PORT, () => console.log(`Server is running at port`, process.env.PORT));