import axios from 'axios'
import { getGmailAuth} from '../Utils/login.js';

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
    
   if (!req.cookies){
        console.log("No cookies in the request ");        
            
        const error = new Error('Unauthorized');
        error.statusCode = 401; // Set the status code to 400        
        next(error)
    } 
    else {        
        req.client = getGmailAuth();            
        next(); // Proceed to the next middleware
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
        }    
    } catch (err) { 
        if (err.status === 401) {
            console.log('Error with the access token:', err);            
            const error = new Error('Unauthorized');
            error.statusCode = 401; 
            next(error)                
        }
        console.log('Internal error server', err);            
        const error = new Error('Unauthorized');
        error.statusCode = 500; 
        next(error)                
    }               
};