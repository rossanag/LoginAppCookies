import { useState, useEffect} from 'react';
import axios , {AxiosError} from 'axios';
import { useNavigate } from 'react-router-dom';
import { CodeResponse, useGoogleLogin, GoogleOAuthProvider  } from '@react-oauth/google';

import { apiGoogle }  from '../api/apiAxios';
import GoogleButton from './GoogleButton';
import { useLocalStorage } from '../hooks';
import {User, UserData} from '../types';



const Login = () => {
	
	// const [user, setUser] = useState<User | null>(null);	
	const [user, setUser] = useLocalStorage<UserData | null>('user', null);	
	const [, setCodeResponse] = useState<CodeResponse | null >();		
	const [error, setError] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	const navigate = useNavigate();

	const getUser = async(token: CodeResponse): Promise<UserData> => {		
		const controller = new AbortController();

		try {			
			setLoading(true);

			const data = await apiGoogle.post<User>(import.meta.env.VITE_GOOGLE_OAUTH_ENDPOINT as string, token, { signal: controller.signal });			
			const user = data.data.userInfo;
			const userTokens = data.data.userTokens;
			setError(false);			

			console.log('user en getUser ', data.data);
			console.log('userData en getUser ', user);
			console.log('tokens en getUser ', userTokens);

			//axios.defaults.headers.common['Authorization'] = 'Bearer ' + userTokens['access_token'];
			// after any request we have the user authenticated with this sentences

			return user;
		} catch (error) {
			setError(true);		
			if (axios.isCancel(error)) {
				// request cancelled							
				controller.abort();					
			} else if (error instanceof AxiosError) {
				throw error.response?.data || error.message;
			}
		
		}
		finally {
			setLoading(false);
		}		
		
		return {} as UserData;
		
	};
		
	
	const googleLogin = useGoogleLogin({				
		onSuccess: async (code ) => {				
			try {
				const userInfo = (await getUser(code ));								
				setCodeResponse(code);			
				setUser(userInfo);	
				console.log('user en googleLogin ', userInfo);			
			}
			catch (error) {
				console.log('There was an error when retrieving user information. Please, try later ', error);
			}
			
		},
		flow: 'auth-code',
	});

	useEffect(() => {	 
		
		console.log('user en useEffect ', user);
		if (user) {		
			console.log('user en useEffect dentro del if', user);					
			setLoading(false);				
			navigate('home', {replace: true});									
		}	
		
	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[user?.email]); 
		
	
	return (
		<>
			<GoogleButton onClick={googleLogin}/>			
			<br></br><br></br>
			{error ? 
				<p>There was an error when trying to login. Please try later</p> 
				:
				(loading ?	<p>Loading...</p> :
					!user ? null :	<p>User loaded {user?.name}</p>) 					 									 										
			}			
		</>
	);		
};

const LoginGoogle = ():JSX.Element => {		
	console.log('login google');
	return (
		<> 		
			<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID as string}>				
				<Login/>
			</GoogleOAuthProvider>
		</>				
	);
};	
 
export default LoginGoogle;
