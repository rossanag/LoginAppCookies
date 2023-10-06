import axios , {AxiosError} from 'axios';

import { User } from '../types';

export const apiGoogle = axios.create({
	baseURL:  import.meta.env.VITE_GOOGLE_OAUTH_ENDPOINT,
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

/* apiGoogle.interceptors.response.use (
	(response) => {		
		if (response.headers.authorization) {
						
			localStorage.setitem('token', response.headers.authorization);
		}
		return response;

	}, (error) => {
		//const [user] = useLocalStorage<User | null>('user', null);	
		const user  = localStorage.getItem('user') as unknown as User;
		
		console.log('error ', error);
		if(error.response.status === 403){
			console.log('error 403');			
		}
		if(error.response.status === 401){
			console.log('error 401');
			// refesh token goes here
			(async () => {
				try {
					const data = await refreshToken(user as User);
					axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.accessToken;
				}
				catch (error) {
					console.log('error ', error);
				}
			})();			
			// end refresh
		}
	});

 */

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
	console.log('interceptor request ', request.data);
	const token = localStorage.getItem('token');
	
	if (token) {
		request.headers['Authorization'] = 'Bearer ' + token	;
	}
	return request;
	
},
(error) => {Promise.reject(error);}
); 



