import { GOOGLE, EMPTY_STRING } from '../types/constants.js';
import {updateUserRefreshToken} from '../services/userUpdates.js';
import { validateRefreshToken } from '../Utils/login.js';
import { getRefreshTokenHash } from '../Utils/utils.js';


async function verifyUserAuth(userData, req, res) { 
    console.log("Entre a verifyUserAuth")
    const { userSaved, newRefreshToken, authMode, receivedRefreshToken } = userData;            
    console.log("authMode en verifyUserAuth ", authMode)
    console.log("userSaved en verifyUserAuth ", userSaved)
    console.log("newRefreshToken en verifyUserAuth ", newRefreshToken)

    if  (userSaved.refreshToken === EMPTY_STRING) {        
        console.log('Refresh token is not valid, either not received or not saved in DB') 
        let hashedRefreshToken = await getRefreshTokenHash(newRefreshToken);
        //userSaved.refreshToken = hashedRefreshToken;
        console.log('hashed refreshtpken en verifyUserAuth ', hashedRefreshToken)
        updateUserRefreshToken(userSaved.email,hashedRefreshToken );
        
        //const today = new Date(); //** */
        //        res.cookie('refreshToken', newRefreshToken, {                         
        //            secure: true, // Cookie only sent in https
        //            httpOnly: true, // Cookie cannot be accessed by JavaScript
        //            sameSite: 'None',
        //            //maxAge: tokenInfo.expiry_date * 1000,
        //            expires: new Date(today.getFullYear(), today.getMonth() + 6)  //** */
        //        });
            
        //return res.status(403).json({ error: 'login' });
        //return res.status(200).json(userSaved);                   
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
            console.log('Refresh token updated in DB for existent user')
            //return res.status(401).json({ error: 'login' });
            //return res.redirect('/login');
            userSaved.refreshToken = hashedRefreshToken;
            
            //const today = new Date(); 
            //res.cookie('refreshToken', newRefreshToken, {
            //    secure: true, // Cookie only sent in https
            //    httpOnly: true, // Cookie cannot be accessed by JavaScript
            //    sameSite: 'None',
            //    //maxAge: tokenInfo.expiry_date * 1000,
            //    expires: new Date(today.getFullYear(), today.getMonth() + 6)  //** */
            //});

            //return res.status(200).json(userSaved);                   
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