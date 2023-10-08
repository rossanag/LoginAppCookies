import { UserRefreshClient } from 'google-auth-library';
import axios from 'axios';

const createGmailRoutes = (app, oAuth2Client) => {

    app.get('/oauth2callback', async (req, res) => {
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
    
    
    const getUser = async (tokens) => {
        const userTokens = {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
        //id_token: tokens.id_token,
        // expiry_date : tokens.expiry_date
        }
            
        let user = {}   
        if (tokens.access_token) {
        try {
    
            let resp = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokens.access_token}`, {          
                headers: {
                    Authorization: `Bearer ${tokens.access_token}`,
                    Accept: 'application/json',               
                }
            })                         
            console.log('resp.data ', resp.data)
            const userInfo = {
                name: resp.data.name,
                email: resp.data.email,
                picture: resp.data.picture,
                authMode: 'google'         
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
            res.status(500).send("Please, try again later")
            
        };
        } 
    
        return user;
    
    }
        
    app.post('/oauth/google', async (req, res) => {
                
        const { tokens } = await oAuth2Client.getToken(req.body.code); // exchange code for tokens
        oAuth2Client.setCredentials(tokens);
        
        try {
        const user = await getUser(tokens);
        console.log('\nObjeto de Usuario ', user)
        
         // Set the refresh token in a cookie with a secure and httpOnly flag - NEW!
         res.cookie('refreshToken', tokens.refresh_token, {
            secure: false, // true - Requires HTTPS
            httpOnly: true, // Cookie cannot be accessed by JavaScript
            //maxAge: tokens.expires_in * 1000, // Set the expiration time based on token validity
        });
    
        res.json(user);     
        
        }
        catch(err) {
            console.log('Error al enviar usuario', err)
            res.status(500).send(err.message)
        }            
    });

    app.post('/auth/google/refresh-token', async (req, res) => {
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
            //maxAge: tokens.expires_in * 1000, // Set the expiration time based on token validity
        });

        const { credentials } = await user.refreshAccessToken(); // otain new tokens
        res.json(credentials);
    })    
}

export default createGmailRoutes;