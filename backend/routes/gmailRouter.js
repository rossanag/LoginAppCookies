import {Router} from 'express';
import { UserRefreshClient } from 'google-auth-library';

import { getUser, setGmailAuth } from '../controllers/gmailControllers.js';
import { validateUserInfo } from '../schemas/user.js';
import handleNewUser from '../controllers/handleNewUser.js';

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


gmailRouter.post('/', async (req, res) => {    
                
        const oAuth2Client = setGmailAuth();

        const { tokens } = await oAuth2Client.getToken(req.body.code); // exchange code for tokens
        oAuth2Client.setCredentials(tokens);
        
        let user = undefined
        try {
            user = await getUser(tokens);
            console.log('\nObjeto de Usuario ', user)

            
            const result = validateUserInfo(user.userInfo);
            if (!result.success) {
                console.log('Error en el objeto de usuario ', result.error);
                return res.status(400).json({error: JSON.parse(result.error.message)});
            }                        
            
            // Set the refresh token in a cookie with a secure and httpOnly flag - NEW!
            res.cookie('refreshToken', tokens.refresh_token, {
                secure: false, // true - Requires HTTPS
                httpOnly: true, // Cookie cannot be accessed by JavaScript
                // maxAge: tokens.expires_in * 1000, // Set the expiration time based on token validity
            });
            
            // save the user in the database user and refresh token
            try {
                console.log('Guardando usuario en la base de datos al user ', user)
                await handleNewUser(req, res, user);                
                res.status(201).json(user);     
            }
            catch (err) {
                console.log('Error al guardar usuario ', err)
                if (err.message.includes('User already exists')) {
                    //return res.status(409).json({ error: 'User already exists' });
                    console.log("Usuario duplicado ", user)
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
    
        
        const user = new UserRefreshClient(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            req.body.refreshToken,
        );
        // check if it exists in our database
        // if exists, then check if it is expired, if not exist send 403.  
        res.cookie('refreshToken', tokens.refresh_token, {
            secure: false, // true - Requires HTTPS
            httpOnly: true, // Cookie cannot be accessed by JavaScript
            // maxAge: tokens.expires_in * 1000, // Set the expiration time based on token validity
        });

        const { credentials } = await user.refreshAccessToken(); // otain new tokens
        res.json(credentials);
 })    

 gmailRouter.post('/logout', async (req, res) => {    
        console.log('Logout de Gmail')
        res.clearCookie('refreshToken');
        res.send('Logged out - Google');
});

export default gmailRouter;