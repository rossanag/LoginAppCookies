import {Router} from 'express';

import {findUser, handleNewUser} from '../controllers/handleNewUser.js';
import { getRefreshConfig } from '../Utils/login.js';
import { getUser } from '../controllers/gmailControllers.js';
import { setGmailAuth } from '../Utils/login.js';
import { validateUserInfo } from '../schemas/user.js';


const gmailRouter = Router();

gmailRouter.get('/oauth2callback', async (req, res) => {    
        
    const oAuth2Client = setGmailAuth();

    const today = new Date();
    const { tokens } = await oAuth2Client.getToken(req.query.code);
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
                
        const oAuth2Client = setGmailAuth();

        const { tokens } = await oAuth2Client.getToken(req.body.code); // exchange code for tokens
        oAuth2Client.setCredentials(tokens);

        console.log('tokens EN SERVER ', tokens)
        const tokenInfo = await oAuth2Client.getTokenInfo(
            oAuth2Client.credentials.access_token
        );
                
        let user = undefined
        try {
            user = await getUser(tokens);
            console.log('\nObjeto de Usuario nuevo ', user)
            
            const result = validateUserInfo(user.userInfo); //Before saving in DB
            if (!result.success) {
                console.log('Error: when validating user schema object ', result.error);
                return res.status(400).json({error: JSON.parse(result.error.message)});
            } 

            //Check if the user exists in the database
            const foundUser = await findUser(user.userInfo.email);
            if (foundUser) {                
                res.status(409).json({ error: 'User logged' });
            }
            
            console.log("Refresh token in loginGmail ", tokens.refresh_token)
            // Set the refresh token in a cookie with a secure and httpOnly flag - NEW!                                
            
            // save the user in the database user and refresh token
            try {
                console.log('User created ', user)
                await handleNewUser(user);                              
                res.cookie('refreshToken', tokens.refresh_token, {                         
                    secure: true, // Cookie only sent in https
                    httpOnly: true, // Cookie cannot be accessed by JavaScript
                    sameSite: 'None',
                    maxAge: tokenInfo.expiry_date * 1000,
                });
                
                res.status(201).json(user);                   
            }
            catch (err) {
                console.log('An issue or an error was thrwon when attemping to save the user ', err)
                if (err.message.includes('User already exists')) {
                    //return res.status(409).json({ error: 'User already exists' });
                    console.log("For log puroposes - Duplicated user ", user)
                    return res.json(user);
                }
                return res.status(500).json({ error: 'Error creating the user' });
            }
        }                        
        catch(err) {
            console.log('Error when logging', err.response.data.error.message)
            return res.status(500).send("Please, log again");
        }            
});

gmailRouter.post('/refresh-token', async (req, res) => {   
    
        const accessToken = req.headers.authorization.split(' ')[1];        
        
        try {
            const {credentials, cookieOptions } = await getRefreshConfig(accessToken, req.cookies.refreshToken);
            res.cookie('refreshToken', req.cookies.refreshToken, cookieOptions);
            res.json(credentials);
        }
        catch (err ) {
            //delete refresh token from DB
            res.clearCookie('refreshToken', { httpOnly: true });
            res.status(401).json({error: err.message});            
        }                            
 })    

gmailRouter.post('/logoutGmail', async (req, res) => {    
    console.log('Cookies en Logout: ', req.cookies)
    res.clearCookie('refreshToken', { httpOnly: true });
    console.log('Logout de Gmail')            
    return res.send('Logged out - Google');            
    
});
  
export default gmailRouter;