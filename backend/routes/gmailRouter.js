import {Router} from 'express';

import { AUTH_TYPE } from '../types/constants.js';
import {findUser, handleNewUser, deleteRefreshToken} from '../controllers/userController.js';
import { getRefreshConfig, getUserTokenData} from '../Utils/login.js';
import { getGmailUser } from '../controllers/gmailControllers.js';
import { validateUserInfo } from '../schemas/user.js';
import verifyUserAuth from '../controllers/verifyUser.js';


// Consent screenhttps://github.com/MomenSherif/react-oauth
//https://www.dhiwise.com/post/react-google-oauth-the-key-to-secure-and-quick-logins

//https://mrbytebuster.medium.com/oauth-2-0-using-node-js-249d7b67257S
// https://github.com/shaikahmadnawaz/access-refresh-tokens-nodejs/blob/master/src/controllers/user.controller.js
const gmailRouter = Router();

gmailRouter.get('/oauth2callback', async (req, res) => {    
           
    const today = new Date();
    //const { tokens } = await oAuth2Client.getToken(req.query.code);
    const {tokens, tokenInfo} = await getUserTokenData(req.body.code);
    res
    .cookie('@react-oauth/google_ACCESS_TOKEN', tokens.access_token, {
        httpOnly: true,
        secure: true,
        maxAge: 1 * 60 * 60 * 1000,
    })
    .cookie('@react-oauth/google_REFRESH_TOKEN', tokens.refresh_token, {
        httpOnly: true,
        secure: true,
        expires: new Date(today.getFullYear(), today.getMonth() + 6),
    })
    .redirect(301, process.env.URL_ORIGIN);
});

gmailRouter.post('/loginGmail', async (req, res) => {    
    // refresh_token: 
    
        const {tokens, tokenInfo} = await getUserTokenData(req.body.code);
        console.log("Tokens obtenidos en loginGmail ", tokens)        
        let user = undefined
        try {
           
            console.log("tokenInfo, ", tokenInfo);       
            
            user = await getGmailUser(tokens);
            
            console.log('\nObjeto de Usuario nuevo ', user)
    
            //Check if the user exists in the database
            const foundUser = await findUser(user.userInfo.email);            
            if (foundUser) {  
                                                
                console.log("User already exists in the database")
                const { GOOGLE_AUTH } = AUTH_TYPE;

                console.log('***req.cookies ', req.cookies);                
                const  userData = {
                    userSaved: foundUser,
                    newRefreshToken: tokens.refresh_token,
                    receivedRefreshToken: req.cookies,
                    authMode: GOOGLE_AUTH
                }     
                console.log('userData dp de logueado ', userData)
                //console.log('tokens del usuario ', user.userTokens)
                //console.log('Verificando usuario en verifyUserAuth');
                verifyUserAuth(userData, req, res);                
                return;                
            } 
                        
            // New user

            console.log("User NOT exists in the database. usuario a ser creado ", user)                        
            console.log("Refresh token in loginGmail ", tokens.refresh_token)

            const result = validateUserInfo(user.userInfo); //Before saving in DB
            if (!result.success) {
                console.log('Error: when validating user schema object ', result.error);
                return res.status(400).json({error: JSON.parse(result.error.message)});
            } 
            
            // save the user in the database user and refresh token
            try {                
                console.log('User created after logged ', user)
                await handleNewUser(user);                              
                const today = new Date(); //** */
                res.cookie('refreshToken', tokens.refresh_token, {                         
                    secure: true, // Cookie only sent in https
                    httpOnly: true, // Cookie cannot be accessed by JavaScript
                    sameSite: 'None',
                    //maxAge: tokenInfo.expiry_date * 1000,
                    expires: new Date(today.getFullYear(), today.getMonth() + 6)  //** */
                });
                
                return res.status(201).json(user);                   
            }
            catch (err) {
                console.log('An issue or an error was thrwon when attemping to save the user ', err)
                if (err.message.includes('User already exists')) {
                    //return res.status(409).json({ error: 'User already exists' });
                    console.log("For log puroposes - Duplicated user ", user)
                    return res.json(user);
                }
                return res.status(409).json({ error: 'Error creating the user' });
            }
        }                        
        catch(err) {
            console.log('Error when logging', err);
            return res.status(500).send("Please, log again");
        }            
});

gmailRouter.post('/refresh-token', async (req, res) => {   
    
        const accessToken = req.headers.authorization.split(' ')[1];        
        
        try {
            const {credentials, cookieOptions } = await getRefreshConfig(accessToken, req.cookies.refreshToken);
            res.cookie('refreshToken', req.cookies.refreshToken, cookieOptions);
            //update refresh token in DB
            res.json(credentials);
        }
        catch (err ) {
            //delete refresh token from DB
            res.clearCookie('refreshToken', { httpOnly: true });
            deleteRefreshToken(req.email);
            res.status(401).json({error: 'login again'});            
        }  
        return;                          
 })    

gmailRouter.post('/logoutGmail', (req, res) => {    
    console.log('Cookies en Logout: ', req.cookies)
    console.log('req en logout', req.body.email)
    res.clearCookie('refreshToken', { httpOnly: true });
    console.log('req.mail en logout ', req.body.email)
    deleteRefreshToken(req.body.email);
    console.log('Logout de Gmail')            
    res.send('SERVER:Logged out - Google');            
    return;
});
  
export default gmailRouter;