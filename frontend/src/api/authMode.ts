//import { AxiosResponse } from 'axios';
import { apiGoogle } from './apiAxios';


// types of authentication to avoid ifs
const logoutGmail =  async () => {
	
	const urlLogout = (import.meta.env.VITE_SERVER_ENDPOINT as string) + '/protected/logoutGmail'; 	

	console.log('urlLogout de gmail', urlLogout);
	try {
		return await apiGoogle.post(urlLogout);	
		
	} catch (error) {
		const err = new Error('error en logoutGmail');		
		console.log('error en logoutGmail', error);
		throw err;	
	}	
};
				

const logoutJwt = async () => {
	const resp = await apiGoogle.post('/logoutJwt');
	return resp; 
};

export const AUTH_USER = {
	Google : logoutGmail,
	Jwt : logoutJwt
};

