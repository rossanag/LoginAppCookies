//import { AxiosResponse } from 'axios';

import { UserData } from '../types';
import { apiGoogle } from './apiAxios';

const logoutGmail =  async () => {
	
	const urlLogout = (import.meta.env.VITE_SERVER_ENDPOINT as string) + '/protected/logoutGmail'; 
		
	const user =  JSON.parse(localStorage.getItem('user') as string) as UserData;

	console.log('urlLogout de gmail', urlLogout);
	try {
		return await apiGoogle.post(urlLogout, { email: user.email });	
			
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

// to avoid ifs
export const AUTH_USER = {
	Google : logoutGmail,
	Jwt : logoutJwt
};

