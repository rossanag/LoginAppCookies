import { GOOGLE, EMPTY_STRING } from '../types/constants.js';
import {updateUserRefreshToken} from '../services/userUpdates.js';
import { validateRefreshToken } from '../Utils/login.js';


function verifyUserAuth(userData, req, res) { 

    const { userSaved, newRefreshToken, authMode, receivedRefreshToken } = userData;            
    console.log("authMode en verifyUserAuth ", authMode)
    console.log("userSaved en verifyUserAuth ", userSaved)

    if  ((!receivedRefreshToken) && (userSaved.refreshToken === EMPTY_STRING)) {
        console.log('Refresh token is not valid') 
        updateUserRefreshToken(userSaved.userInfo,newRefreshToken );
        return res.status(403).json({ error: 'login' });
    }
    
    const isValidRefreshToken = validateRefreshToken(newRefreshToken, receivedRefreshToken)
    
    if (!isValidRefreshToken){
        console.log('Refresh token is not valid') 
        
        try {
            res.clearCookie('refreshToken', { httpOnly: true });
            
            const idUser = {email: userSaved.email}
            updateUserRefreshToken(idUser, newRefreshToken);            
            //return res.status(401).json({ error: 'login' });
            //return res.redirect('/login');
            userSaved.refreshToken = newRefreshToken;
            res.cookie('refreshToken', tokens.refresh_token, {
                secure: true, 
                httpOnly: true, 
                sameSite: 'None',
                maxAge: tokenInfo.expiry_date * 1000,
            });     
            
            return res.status(200).json(userSaved);                   
           
        }
        catch (err) {
            console.log('Error in updateRefreshToken in DB', err.message)
            return res.status(409).json({ error: 'Could not update user credentials. Please, login later' });
        }
     }
          
     if (userSaved.authMode !== authMode) {
        if (authMode === GOOGLE) {
            console.log('User logged with local auth ', userSaved)
            return res.status(405).send('Please, log in with your email and password ');
        } 
               
        return res.status(405).send('Please, log in with your Gmail account ');
    }
    return res.status(409).json({ error: 'Could not update user credentials. Please, login later' }); 
}

export default verifyUserAuth;