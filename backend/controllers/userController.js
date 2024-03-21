import {getRefreshTokenHash}  from "../Utils/utils.js";
import {setGmailUserData, setLocalUserData, updateUserRefreshToken, deleteUserRefreshToken, findUser} from '../services/userUpdates.js';
import { GOOGLE} from '../types/constants.js';


export const existsUser = async (id) => {    
    return findUser(id);
}

const getHashedRefreshToken = async (refreshToken) => {
    let hashedRefreshToken = undefined;
    try{
        return hashedRefreshToken = await getRefreshTokenHash(refreshToken);        
    } catch(error) {
        console.error('Error generating hash:', error);
        throw error;
    }
}

export const handleNewUser = async (user) => {
    //Pre: the user has been validated and doesnt exists in the database    
     console.log("HANDLE NEW USER". user)   
    let hashedRefreshToken = await getHashedRefreshToken(user.userTokens.refresh_token)
    
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
    try {           
        const user = await deleteUserRefreshToken(email)
        console.log('User refreshToken deleted successfully:', user);
    } catch(error) {
        console.error('Error deleting user refreshToken:', error);
        throw error;
    }   
}

export const updateRefreshToken = async (email, refreshToken) => {
        
    let hashedRefreshToken = await getHashedRefreshToken(refreshToken)
    try {          
        const user = await updateUserRefreshToken (email, hashedRefreshToken)
        console.log('User refreshToken updated successfully:', user);
    } catch(error) {
        console.error('Error updating user refreshToken:', error);
        throw error;
    }           
}
