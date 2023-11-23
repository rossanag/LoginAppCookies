import { apiGoogle } from './apiAxios';


// types of authentication to avoid ifs
const logoutGmail =  async () => {
	const urlLogout = import.meta.env.VITE_SERVER_ENDPOINT + '/protected/logoutGmail'; 	
	console.log('urlLogout de gmail', urlLogout);
	return await apiGoogle.post(urlLogout);	
};

const logoutJwt = async () => {
	return await apiGoogle.post('/logoutJwt');
};

export const AUTH_USER = {
	google : logoutGmail,
	Jwt : logoutJwt
};

