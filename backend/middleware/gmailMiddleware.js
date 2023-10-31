import axios from 'axios'
import {getGmailAuth} from '../controllers/gmailControllers.js'
import { handleError } from './errorMiddleware.js';
import { refreshGmailToken } from '../Utils/login.js';

export async function verifyGoogleIdToken(token) {
    try {
      const oAuth2Client = getGmailAuth();

      const ticket = await oAuth2Client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      console.log('ticket obtenido al verificar ',ticket)
      return { payload: ticket.getPayload() };
    } catch (error) {
        throw new error;
    }
  }

export const handleAuthorization = async (req, res, next) => {
    try {        
        // console.log("req ", req)
        const client = getGmailAuth();
        
        req.client = client;        
        access_token = req.headers.authorization.split(' ')[1]; // Extract the access token from the request headers
        console.log("req.token en handleAuth ", access_token);

        next();
    } catch (err) {
        console.error('Error in handleAuthorization:', err.message);
        const error = new Error('Unauthorized');
        error.statusCode = 401; // Set the status code to 400        
        handleError(error, req, res, next); // Call the handleError middleware with the error 
    }
};  
  

export const verifyGmailAccessToken = async (req, res, next) => {
        
    verifyRefreshToken(req.cookies.refreshToken);

    const accessToken = req.headers.authorization.split(' ')[1]; // Extract the access token from the request headers        

    try {
        const response = await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo`, {
            params: {
                access_token: accessToken
            }
        });
        
        const data = await response.json();
        if (response.ok) {
            req.tokenInfo = data; 
            
            next(); // Proceed to the next middleware
        } else {
                // Call refreshToken function or perform appropriate actions
            try {
                 const {credentials, cookieOptions} = await refreshGmailToken(req, res);
                 res.cookie('refreshToken', req.cookies.refreshToken, cookieOptions);
                 res.json(credentials);                 
            }   
            catch (err) {                
                const error = new Error('Unauthorized');
                error.statusCode = 400; // Set the status code to 400
                handleError(error, req, res, next); // Call the handleError middleware with the error
            }                    
        }
    }
    catch (err) {
        console.error('Error verifying token:', error.message);
        
        const error = new Error('Internal Server Error');
        error.statusCode = 500; // Set the status code to 500
        handleError(error, req, res, next); // Call the handleError middleware with the error
    }           
};

const verifyRefreshToken = async (refreshToken) => {
    try {
        const response = await axios.post('https://www.googleapis.com/oauth2/v4/token', {
            refresh_token: refreshToken,
            client_id: env.GOOGLE_CLIENT_ID,
            client_secret: env.GOOGLE_CLIENT_SECRET,
            grant_type: 'refresh_token',
        });
        const data = response.data;
        console.log('Refresh token verified:', data);
        return data;
    } catch (err) {        
        console.error('Error verifying refresh token:', err.message);        
        if (err.response) {
            // Check for specific error codes or messages indicating token expiration
            if (err.response.status === 400 && err.response.data.error === 'invalid_grant') {
                // delete the refresh token from the database
                console.log('Refresh token has expired.');
                const error = new Error('Session expired. Please login again.');
                error.statusCode = 403;                 
            } else {
                const error = new Error('Unauthorized');
                error.statusCode = 400;                     
            }
            handleError(error, req, res, next);                 
        } 
    }
};


