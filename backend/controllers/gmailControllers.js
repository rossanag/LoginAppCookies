import { OAuth2Client} from 'google-auth-library';


export const setGmailAuth = () => {
    const oAuth2Client = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        'postmessage',  
      ); 
      
      oAuth2Client.on('tokens', (tokens) => {
        //save refresh_token
        if (tokens.refresh_token) {
          console.log('refresh token ', tokens.refresh_token);
        }
        console.log('access token ', tokens.access_token);
      });
      
      oAuth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
        forceRefreshOnFailure: true
      });
    
      return  oAuth2Client;
}

  /* const User = require('../model/User');
  const bcrypt = require('bcrypt');
  const jwt = require('jsonwebtoken');
   */
  export const handleGmailLogin = async (req, res) => {
      const cookies = req.cookies;
  
      const { user } = req.body;
      if (!user) return res.status(400).json({ 'message': 'Username and password are required.' });
  
      //const foundUser = await User.findOne({ username: user }).exec();
      //if (!foundUser) return res.sendStatus(401); //Unauthorized 
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
  
  