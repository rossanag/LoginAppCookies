import { apiGoogle } from './apiAxios';


// types of authentication
const logoutGmail =  async () => {
	return await apiGoogle.post('/logoutGmail');	
};

const logoutJwt = async () => {
	return await apiGoogle.post('/logoutJwt');
};

export const AUTH_USER = {
	google : logoutGmail,
	Jwt : logoutJwt
};

