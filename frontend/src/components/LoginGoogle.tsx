import { useState, useEffect} from 'react';
import axios , {AxiosError} from 'axios';
import { useNavigate } from 'react-router-dom';
import { CodeResponse, useGoogleLogin, GoogleOAuthProvider  } from '@react-oauth/google';

import { apiGoogle }  from '../api/apiAxios';
import GoogleButton from './GoogleButton';
import { useLocalStorage } from '../hooks';
import {User} from '../types';


const Login = () => {
	
	// const [user, setUser] = useState<User | null>(null);	
	const [user, setUser] = useLocalStorage<User | null>('user', null);	
	const [, setCodeResponse] = useState<CodeResponse | null >();		
	const [error, setError] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	const navigate = useNavigate();

	const getUser = async(token: CodeResponse): Promise<User> => {		
		const controller = new AbortController();

		try {			
			setLoading(true);

			const data  = await apiGoogle.post(import.meta.env.VITE_GOOGLE_OAUTH_ENDPOINT as string,  token, { signal: controller.signal});												
			const user = data.data;
			const gtokens = data.data.gtokens;
			setError(false);			

			console.log('user en getUser ', user);
			console.log('gtokens en getUser ', gtokens);	
			
			//axios.defaults.headers.common['Authorization'] = 'Bearer ' + gtokens['access_token'];
			// after any request we have the user authenticated with this sentences
												
			return user as User;
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
		
		return {} as User;
		
	};
		
	
	const googleLogin = useGoogleLogin({				
		onSuccess: async (code ) => {				
			try {
				const userInfo = await getUser(code );				
				setCodeResponse(code);			
				setUser(userInfo);	
				//console.log('user en googleLogin ', userInfo);			
			}
			catch (error) {
				console.log('Hubo un error al recuperar los datos del usuario ', error);
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
	},[user]); 
		
	
	return (
		<>
			<GoogleButton onClick={googleLogin}/>			
			<br></br><br></br>
			{error ? 
				<p>Hubo un error al recuperar los datos del usuario</p> 
				:
				(loading ?	<p>Cargando...</p> :
					!user ? null :	<p>Cargó usuario {user?.name}</p>) 					 									 										
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
