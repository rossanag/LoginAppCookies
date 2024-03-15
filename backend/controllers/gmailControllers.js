import axios from 'axios';
import jwt from 'jsonwebtoken';
import { GOOGLE } from '../types/constants.js';

//import fetch from 'node-fetch';
  /* const User = require('../model/User');
  const bcrypt = require('bcrypt');
  const jwt = require('jsonwebtoken');
   */
export const handleGmailLogin = async (req, res) => {
      const cookies = req.cookies;
  
      const { user } = req.body;
      if (!user) return res.status(400).json({ 'message': 'Username and password are required.' });
  
      const foundUser = await user.findOne({ username: user }).exec();
      if (!foundUser) return res.sendStatus(401); //Unauthorized 
      // evaluate password 
      const match = await bcrypt.compare(pwd, foundUser.password);
      if (match) {
          const roles = Object.values(foundUser.roles).filter(Boolean);
          // create JWTs
          const accessToken = jwt.sign(
              {
                  "UserInfo": {
                      "username": foundUser.username,
                      "roles": roles
                  }
              },
              process.env.ACCESS_TOKEN_SECRET,
              { expiresIn: '10s' }
          );
          const newRefreshToken = jwt.sign(
              { "username": foundUser.username },
              process.env.REFRESH_TOKEN_SECRET,
              { expiresIn: '15s' }
          );
  
          // Changed to let keyword
          let newRefreshTokenArray =
              !cookies?.jwt
                ? foundUser.refreshToken
                : foundUser.refreshToken.filter(rt => rt !== cookies.jwt);
  
          if (cookies?.jwt) {
  
              /* 
              Scenario added here: 
                  1) User logs in but never uses RT and does not logout 
                  2) RT is stolen
                  3) If 1 & 2, reuse detection is needed to clear all RTs when user logs in
              */
              const refreshToken = cookies.jwt;
              const foundToken = await User.findOne({ refreshToken }).exec();
  
              // Detected refresh token reuse!
              if (!foundToken) {
                  // clear out ALL previous refresh tokens
                  newRefreshTokenArray = [];
              }
  
              res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
          }
  
          // Saving refreshToken with current user
          foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
          const result = await foundUser.save();
  
          // Creates Secure Cookie with refresh token
          res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
  
          // Send authorization roles and access token to user
          res.json({ accessToken });
  
      } else {
          res.sendStatus(401);
      }
  }
  
  export const getGmailUser = async (tokens) => {
    const userTokens = {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,        
    }
       
    let user = {}   
    if (tokens.access_token) {
        try {
            let resp = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {          
                headers: {
                    Authorization: `Bearer ${tokens.access_token}`,
                    Accept: 'application/json',               
                }
            })                                         
            console.log('resp.data cuando obtengo usuario ', resp.data)
        
            const userInfo = {
                name: resp.data.name,
                email: resp.data.email,
                picture: resp.data.picture,
                authMode: GOOGLE,
                //access_token: tokens.access_token,
                //refresh_token: tokens.refresh_token    
            }
        
            user = {
                userInfo,
                userTokens
            }           
            // if the user exists, if it's not already in the database, save it
            // if not exists, send the message to the client
            console.log('user in server ', user);                  
        }    
        catch(err) { 
            console.log(err)         
            // instead of err.message we use a more UX friendly approach  
            throw new Error(err.response.data.error.message)
            
        };
    } 

    return user;
}

