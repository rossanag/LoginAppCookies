import { OAuth2Client, UserRefreshClient} from 'google-auth-library';
import { getRefreshTokenHash } from './utils.js';

export const getGmailAuth = () => {
    const oAuth2Client = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        'postmessage',  
    ); 
    
    return  oAuth2Client;
}

export const setGmailAuth = () => {
    const oAuth2Client = getGmailAuth();
     
    oAuth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      forceRefreshOnFailure: true
    });
    
    return  oAuth2Client;
}

export const getUserToRefreshToken = (refreshToken) => {
    const user = new UserRefreshClient(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        refreshToken,
    );
    return user;
}

export const refreshGmailToken = async (accessToken,refreshToken) => {  
   
    try {
        const {credentials, cookieOptions } = await getRefreshConfig(accessToken, refreshToken);
        return {credentials, cookieOptions};
    }
    catch (err ) {
        console.log('Error in getRefreshConfig:', err.message);
        const error = new Error('Unauthorized');
        error.statusCode = 403; // Set the status code to 401 for unauthorized
        throw error; // Throw the caught error
    }                               
    
};

export const getCookieOptions = async (maxAge) => {
    const cookieOptions = {
        secure: true, //process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'None',
        maxAge: maxAge * 1000,
    };

    return cookieOptions;
};

export const isRefreshTokenValid = async (newRefreshToken, storedRefreshToken) => {
        let hashedRefreshToken = undefined;
        try {
            hashedRefreshToken = await getRefreshTokenHash(newRefreshToken)
        }catch (error) {
            console.error('Error generating hash:', error);
            throw error;
        }

        return hashedRefreshToken === storedRefreshToken;                                
}

export async function validateRefreshToken (newRefreshToken, userSavedRefreshToken) {
    try {
      const validRefreshToken = await isRefreshTokenValid(newRefreshToken, userSavedRefreshToken);      
      return validRefreshToken;
    } catch (err) {
        console.log('Error in isRefreshTokenValid in validateRefreshToken:', err.message);
        
        return false; // Or throw a custom error: throw new Error("Invalid refresh token");
    }
  }

  
export const getRefreshConfig = async (access_token, refresh_token) => {
    const user = getUserToRefreshToken(refresh_token)    
    
    const cookieOptions = getCookieOptions(access_token);
    try {
        const { credentials } = await user.refreshAccessToken(); // obtain new tokens
        return {credentials, cookieOptions};
    } catch (err) {
        const error = new Error();        
        if (err.message === 'Token has been expired or revoked') {
        // The refresh token has expired or is invalid
            error.message = 'Unauthorized';
            error.statusCode = 403; // Set the status code to 403 for forbidden
            throw error;

        } else {
            // Server error
            error.message = 'Please log in again later';
            error.statusCode = 500; // Set the status code to 500 for internal server error
            throw error;
        }
    }    
}
//https://github.com/googleapis/google-api-nodejs-client#handling-refresh-tokens
// exchange code for tokens
export const getUserTokenData = async (code) => {
    
    const oAuth2Client = getGmailAuth();

    const { tokens } = await oAuth2Client.getToken(code); 
    oAuth2Client.setCredentials(tokens);
    
        
    const tokenInfo = await oAuth2Client.getTokenInfo(
            oAuth2Client.credentials.access_token
    );
    console.log('info en geUserTokenData ', tokens, tokenInfo)
    
    return {tokens, tokenInfo}    
}


export async function verifyToken(token) {
  const oAuth2Client = getGmailAuth();
  try {
    const ticket = await oAuth2Client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (payload.aud === process.env.GOOGLE_CLIENT_ID) {
      return payload;
    } else {
      throw new Error('Token is not issued for this client ID');
    }
  } catch (error) {
    throw new Error('Invalid token');
  }
}

        