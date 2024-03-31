import { GOOGLE, EMPTY_STRING } from '../types/constants.js';
import {updateUserRefreshToken} from '../services/userUpdates.js';
import { validateRefreshToken } from '../Utils/login.js';
import { getRefreshTokenHash } from '../Utils/utils.js';


async function verifyUserAuth(userData, req, res) { 
    
    const { userSaved, newRefreshToken, authMode, receivedRefreshToken } = userData;            
    
    if  (userSaved.refreshToken === EMPTY_STRING) {        
        console.log('Refresh token is not valid, either not received or not saved in DB') 
        let hashedRefreshToken = await getRefreshTokenHash(newRefreshToken);
        //userSaved.refreshToken = hashedRefreshToken;
       
        updateUserRefreshToken(userSaved.email,hashedRefreshToken );
                
        return;
    }
    
    
    const isValidRefreshToken = validateRefreshToken(newRefreshToken, receivedRefreshToken)
    
    if (!isValidRefreshToken){
        console.log('Refresh token is not valid, diffs between received and saved in DB') 
        
        try {
            res.clearCookie('refreshToken', { httpOnly: true });
            console.log('User saved before update refresh token in DB ', userSaved) 
            const {email } = userSaved;
            let hashedRefreshToken = getUserToRefreshToken(newRefreshToken);
            userSaved.refreshToken = hashedRefreshToken;
            updateUserRefreshToken(email, hashedRefreshToken);                    
        
            userSaved.refreshToken = hashedRefreshToken;
                        
            return
           
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
    //return res.status(409).json({ error: 'Could not update user credentials. Please, login later' }); 
    return;
}

export default verifyUserAuth;