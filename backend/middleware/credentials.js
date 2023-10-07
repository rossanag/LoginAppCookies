
import allowedOrigins from '../config/allowedOrigins.js';

import Express from 'express';


const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', true);
    }
    next();
}


export default credentials;