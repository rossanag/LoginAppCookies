import mongoose from 'mongoose';

import {generateHash}  from "../Utils/utils.js";


import User from '../model/User.js';    

const handleNewUser = async (req, res, user) => {
        
    console.log('user received to save', user)
    const duplicate = await User.findOne({ email: user.userInfo.email });
    
    if (duplicate) {
        //console.log('Usuario duplicado ', duplicate);                
        throw new Error('User already exists - Error 409');                         
    }     

    let hashRefreshToken = undefined;
    try {
        hashRefreshToken = await generateHash(user.userTokens.refresh_token);
    }
    catch (err) {
        //return res.status(500).json({ error: 'Please, log again' });
         throw new Error('Error creating the hash:', err);
     
    }

    if (user.userInfo.authMode === 'google') {
        const gmailUserData = {     
            "name": user.userInfo.name,       
            "email": user.userInfo.email,
            "picture": user.userInfo.picture,             
            "authMode": "google",
            "refreshToken": hashRefreshToken
        };            

        const GmailUser = mongoose.model('GmailUser');
        const newGmailUser = new GmailUser(gmailUserData);
        console.log('gmailUserData ', gmailUserData);
        console.log('Guardando usuario en la base de datos al user ', newGmailUser)

        try {
            //const savedGmailUser = await newGmailUser.save({ writeConcern: { w: 'majority' } });                
            const savedGmailUser = await newGmailUser.save();                
            console.log('Gmail user created:', savedGmailUser);
        } catch (error) {
            console.error('Error creating Gmail user:', error);
            throw new Error('Error creating the user:', error);    
        }                          
    }
    else {

        let hashedPasword = undefined;
        try {
             hashedPasword = await generateHash(user.userInfo.password);
        }
        catch (err) {
            throw new Error('Error creating the user:', err);
        }            
    
        const RegularUser = mongoose.model('RegularUser');
        const regularUserData = {
            "name": user.userInfo.name,       
            "email": user.userInfo.email,
            "password": userInfo.password,
            "picture": user.userInfo.picture,             
            "authMode": "local",
            "refreshToken": hashRefreshToken
        };
              
        const newRegularUser = new RegularUser(regularUserData);
        newRegularUser.save((err, savedRegularUser) => {
            if (err) {
                throw new Error('Error creating the user:', err);
            } 
            else {
                console.log('Regular user created:', savedRegularUser);
            }
        });
    }            
}

export default handleNewUser;