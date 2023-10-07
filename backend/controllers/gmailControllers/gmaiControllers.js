
import { OAuth2Client} from 'google-auth-library';

  /**

 * @returns {OAuth2Client}
 */
  const setGmailAuth = () => {
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

    export default setGmailAuth;