
// const jwt = require("jsonwebtoken");

const express = require("express");
require('dotenv').config();
const cors = require("cors");

const { OAuth2Client, UserRefreshClient } = require("google-auth-library");
const app = express();

const axios = require('axios');
const url = require('url');
const cookieParser = require('cookie-parser');


app.use(
  cors({
    // origin: [process.env.URL_ORIGIN],
   origin: '*',
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    credentials:true,         
    optionSuccessStatus:200
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* app.use(function (req, res, next) {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  // res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});
 */

const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'postmessage',  
);

oAuth2Client.on('tokens', (tokens) => {
  //save refresh_toke
  if (tokens.refresh_token) {
    console.log('refresh token ', tokens.refresh_token);
  }
  console.log('access token ', tokens.access_token);
});

oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  forceRefreshOnFailure: true
});


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


async function verifyGoogleToken(token) {
  try {
    const ticket = await oAuth2Client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    console.log('ticket obtenido al verificar ',ticket)
    return { payload: ticket.getPayload() };
  } catch (error) {
      return { error: "Invalid user detected. Please try again" };
  }
}


const getUser = async (tokens) => {
  const gtokens = {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    id_token: tokens.id_token,
    expiry_date : tokens.expiry_date
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
        user = {
          ...resp.data,
          gtokens         
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

app.post('/auth/google/refresh-token', async (req, res) => {
  const user = new UserRefreshClient(//console.log('about')
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    req.body.refreshToken,
  );
  // check if it exists in our database
  // if exists, then check if it is expired, if not exist send 403.  
  
  const { credentials } = await user.refreshAccessToken(); // optain new tokens
  res.json(credentials);
})


app.post('/oauth/google', async (req, res) => {
  
  const { tokens } = await oAuth2Client.getToken(req.body.code); // exchange code for tokens
  oAuth2Client.setCredentials(tokens);

  try {
    const user = await getUser(tokens);
    console.log('\nObjeto de Usuario ', user)
  
    res.json(user);     
    
  }
  catch(err) {
    console.log('Error al enviar usuario', err)
    res.status(500).send(err.message)
  }
      
});

app.post('/about', async (req, res) => {  
  res.send('This is About page data from server').status(200)
});

app.listen(process.env.PORT, () => console.log(`Server is running`));