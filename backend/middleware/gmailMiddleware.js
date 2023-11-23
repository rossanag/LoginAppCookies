import axios from 'axios'
import { getGmailAuth, refreshGmailToken } from '../Utils/login.js';

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

        /* if (req.cookies){
            console.log("Hay cookies en el request ", req.cookies);
        } 
        
 */     req.client = client;         

        next();
    } catch (err) {
        console.error('Error in handleAuthorization:', err.message);
        const error = new Error('Unauthorized');
        error.statusCode = 401; // Set the status code to 400        
        next(error)
    }
};  
  

export const verifyGmailAccessToken = async (req, res, next) => {
        

    let accessToken = req.headers.authorization.split(' ')[1]; // Extract the access token from the request headers        
    
    try {
        const response = await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo`, {
            params: {
                access_token: accessToken
            }
        });
        
        const data = response.data;
        
        if (response.status === 200) {
            console.log("response ok")
            req.tokenInfo = data; 
            
            next(); // Proceed to the next middleware
        } else {
                // Call refreshToken function or perform appropriate actions
            console.log("response not ok")    
            try {
                 const {credentials, cookieOptions} = await refreshGmailToken(accessToken, req.cookies.refreshToken);
                 res.cookie('refreshToken', req.cookies.refreshToken, cookieOptions);
                 res.json(credentials);                 
            }   
            catch (err) {    
                console.log('Error refreshing token:', err);            
                const error = new Error('Unauthorized');
                error.statusCode = 403; // Set the status code to 400
                next(error)
            }                    
        }
    }
    catch (err) {
        console.log('Error verifying token:', err.message);
        const error = new Error('Internal Server Error');
        error.statusCode = 500; // Set the status code to 500
        
        next(error)
    }           
};