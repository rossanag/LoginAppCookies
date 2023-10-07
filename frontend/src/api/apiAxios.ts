import axios , {AxiosError} from 'axios';

import { User } from '../types';

export const apiGoogle = axios.create({
	baseURL:  import.meta.env.VITE_SERVER_ENDPOINT,
	timeout: 6000,	
	headers: { Accept: 'application/json' },
});

export const refreshToken = async (user:User) => {
	const controller = new AbortController();

	
	const refreshToken = user.gtokens.refresh_token;	
	try {
		const { data } = await axios.post(
			'/auth/google/refresh-token',
			{
				refreshToken: refreshToken,
			},
		);
		return data;
	}    
	catch (error) {
		if (axios.isCancel(error)) {
			// request cancelled	
			controller.abort(); 			
            
		} else if (error instanceof AxiosError) {
			throw error.response?.data || error.message;
		}
	}
};

apiGoogle.interceptors.response.use (
	(response) => {		
		if (response.headers.authorization) {
							
			localStorage.setitem('token', response.headers.authorization);
		}
		return response;
	
	}, async (error) => {		
		const user  = localStorage.getItem('user') as unknown as User;
			
		const originalRequest = error.config;
		if (error.response.status === 403 && !originalRequest._retry) {
			originalRequest._retry = true;
			try {
				const resp = await refreshToken(user);
				const access_token = resp.response.accessToken;
				localStorage.setItem('token', access_token);

				apiGoogle.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
			
				return apiGoogle(originalRequest);	
			}
			catch (error) {
				console.log('error ', error);
				//Add toast to show error
			}	
		}
		return Promise.reject(error);

	});
	

apiGoogle.interceptors.request.use((request) => {	
	const token = localStorage.getItem('token');
	
	if (token) {
		request.headers.common['Authorization'] = 'Bearer ' + token;		

	}
	return request;
},
(error) => {
	Promise.reject(error);
}
); 



