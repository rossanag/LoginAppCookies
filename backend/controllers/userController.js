import {getRefreshTokenHash}  from "../Utils/utils.js";
import {setGmailUserData, setLocalUserData} from '../services/userUpdates.js';
import { GOOGLE } from '../types/constants.js';

import User from '../model/User.js';    

export const findUser = async (email) => {
    const user = await User.findOne({ email });
    return user;
}

export const handleNewUser = async (user) => {
    //Pre: the user has been validated and doesnt exists in the database    
    
    let hashedRefreshToken = undefined;
    try{
        hashedRefreshToken = await getRefreshTokenHash(user.userTokens.refresh_token);
    } catch(error) {
        console.error('Error generating hash:', error);
        throw error;
    }
    
    if (user.userInfo.authMode === GOOGLE) {        
        const gmailUserData = {     
            "name": user.userInfo.name,       
            "email": user.userInfo.email,
            "picture": user.userInfo.picture,             
            "authMode": GOOGLE,
            "refreshToken": hashedRefreshToken
        };            
        console.log("gmailUserData en userController ", gmailUserData)
         await setGmailUserData(gmailUserData);
    }
    else {              
        const regularUserData = {
            "name": user.userInfo.name,       
            "email": user.userInfo.email,
            "password": userInfo.password,
            "picture": user.userInfo.picture,             
            "authMode": "local",
            "refreshToken": hashedRefreshToken
        };
        
        await setLocalUserData (regularUserData)
    }            
}

export const deleteRefreshToken = async (email) => {
    const foundUser = await findUser(email);     
    if (!foundUser) {
        console.log('User not found in the database')
        return;
    }
    foundUser.refreshToken = '';
    await foundUser.save();
}
