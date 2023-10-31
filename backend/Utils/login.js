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


export const refreshGmailToken = async (req, res) => {  
    try {
        
        // res.set('Authorization', `Bearer ${newAccessToken}`);

        const accessToken = req.headers.authorization.split(' ')[1];        

        try {
            const {credentials, cookieOptions } = await getRefreshConfig(accessToken, req.body.refreshToken);
            return {credentials, cookieOptions};
        }
        catch (err ) {
            const error =  new Error(err.message)            
            error.statusCode = 401; // Set the status code to 400
            
            throw Error;
        }               
                
    } catch (error) {
        console.error('Error in refreshToken:', error.message);
        throw new Error(error.message)  //500        
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
    const { credentials } = await user.refreshAccessToken(); // obtain new tokens

    return {credentials, cookieOptions};
}
        


        