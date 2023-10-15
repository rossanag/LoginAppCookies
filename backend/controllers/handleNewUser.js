import mongoose from "mongoose";

import { generateHash } from "../Utils/utils";
import User from "../model/User";


const handleNewUser = async (req, res, user) => {
    
    //console.log('Datos del usuario ', req.body)
    try {

        const duplicate = await User.findOne({ email: user.userInfo.email });
        if (duplicate) {
            console.log('Usuario duplicado ', duplicate);
            return res.status(409).json({ error: 'User already exists' });
        }

        let hashRefreshToken = undefined;
        try {
            hashRefreshToken = await generateHash(user.userInfo.refreshToken);
        }
        catch (err) {
            return res.status(500).json({ error: 'Please, log again' });
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
            newGmailUser.save((err, savedGmailUser) => {
                if (err) {
                    throw new Error('Error creating Gmail user:', err);
                } else {
                    console.log('Gmail user created:', savedGmailUser);
                }
                });            
        } else {

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
            } else {
                console.log('Regular user created:', savedRegularUser);
            }
});

            //////////////////////////////////7
            userDB = await User.create({
                "name": user.userInfo.name,
                "email": user.userInfo.email,
                "password": hashedPasword,
                "authMode": 'local',
                "refreshToken": hashRefreshToken
            });
        }
            
        console.log('Usuario creado ', user)
        res.status(201).json(userDB);

    } catch (error) {
        console.log('Error al crear usuario ', error)
        res.status(500).json({ error: error.message });
    }
}

export default handleNewUser;