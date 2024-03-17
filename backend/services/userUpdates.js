import mongoose from 'mongoose';

import { EMPTY_STRING } from '../types/constants.js';
import User from '../model/User.js';   


export const findUser = async (email) => {
  
  const user = await User.findOne({email });
  return user;
}

export const setGmailUserData = async (gmailUserData) => {
  const GmailUser = mongoose.model('GmailUser');
  const newGmailUser = new GmailUser(gmailUserData);
  
  console.log('newUser - gmailUserData ', gmailUserData);
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

export const setLocalUserData = async (regularUserData) => {
  const RegularUser = mongoose.model('RegularUser');
  const newRegularUser = new RegularUser(regularUserData);
  
  newRegularUser.save((err, regularUserData) => {
    if (err) {
        throw new Error('Error creating the user:', err);
    } 
    else {
          console.log('Regular user created:', regularUserData);
    }
  });
}

export const updateUserRefreshToken = async (email, hashedRefreshToken) => {  
    
  const userDB = mongoose.model('User');
  //const emailString = String(email);
  const filter = { email: email };

  const update = { refreshToken: hashedRefreshToken };
  const options = { new: true };

  try {
    const result = await userDB.findOneAndUpdate(filter, update, options);
    return result;
  } catch (error) {
      console.error('Error updating Gmail user refreshToken:', error);
      const err = new Error('Error updating the user:', error);
      throw err
  } 
}

export const deleteUserRefreshToken = async (userId) => {
  try{        
      const userDb = await updateUserRefreshToken (userId, EMPTY_STRING)
      console.log('User refreshToken updated successfully:', userDb);
      return userDb;
      
  } catch(error) {
      console.error('Error deleting refresh token:', error);
      throw error;
  
  }
}
