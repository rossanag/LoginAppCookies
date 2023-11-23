import { OAuth2Client, UserRefreshClient} from 'google-auth-library';

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


export const refreshTokenCookie = async (maxAge) => {
    const cookieOptions = {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'None',
        maxAge: maxAge * 1000,
    };

    return cookieOptions;
};

export const getRefreshConfig = async (access_token, refresh_token) => {
    const user = getUserToRefreshToken(refresh_token)    
    
    const cookieOptions = refreshTokenCookie(access_token);
    try {
    const { credentials } = await user.refreshAccessToken(); // obtain new tokens
    } catch (err) {
        const error = new Error();        
        if (err.message === 'Token has been expired or revoked') {
        // The refresh token has expired or is invalid
            error.message = 'Unauthorized';
            throw error;

        } else {
            // Server error
            error.message = 'Please log in again later';
            throw error;
        }
    }
    return {credentials, cookieOptions};
}
        


        