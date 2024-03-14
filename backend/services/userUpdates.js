import mongoose from 'mongoose';
import User from '../model/User.js';    

export async function updateRefreshToken(email, newRefreshToken) {
  try {
    const result = await User.updateOne(
      { email: email },
      { $set: { refreshToken: newRefreshToken } }
    );

    console.log('User refreshToken updated successfully:', result);
    // Handle success
    return result;
  } catch (err) {
        console.error('Error updating user refreshToken:', err);
        // Handle the error
        throw err;
  }
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
  

