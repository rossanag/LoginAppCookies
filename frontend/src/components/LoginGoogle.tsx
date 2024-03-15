import { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios , {AxiosError} from 'axios';
import { CodeResponse, useGoogleLogin, GoogleOAuthProvider  } from '@react-oauth/google';

import { apiGoogle }  from '../api/apiAxios';
import GoogleButton from './GoogleButton';
import { useLocalStorage } from '../hooks';
import {User, UserData, UserTokens} from '../types';


const Login = () => {
		
	const [user, setUser] = useLocalStorage<UserData | null>('user', null);	
	const [, setTokens] = useLocalStorage<UserTokens | null>('token', null);	
	const [, setCodeResponse] = useState<CodeResponse | null >();		
	const [error, setError] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	const navigate = useNavigate();

	const getUser = async(token: CodeResponse): Promise<User> => {		
		const controller = new AbortController();

		try {			
			setLoading(true);

			console.log('Va a buscar la data del usuario');			
			const urlLogin = (import.meta.env.VITE_GOOGLE_OAUTH_ENDPOINT as string) + '/loginGmail';			
			const data = await apiGoogle.post<User>(urlLogin, token, { signal: controller.signal });			
			console.log('Data recibida en getUser ', data);
			console.log('Datos recibidos en getUser ', data.data);
			const user = data.data.userInfo;
			const userTokens = data.data.userTokens;
			console.log('user tokens en getUser ', userTokens);
			//ToDo: save tokens in local storage or redux
			
			setError(false);			
			
			console.log('userData en getUser ', user);
			console.log('access_token tokens en getUser ', userTokens.access_token);
						

			return data.data;			

		} catch (error) {
			setError(true);		
			if (axios.isCancel(error)) {
				// request cancelled							
				controller.abort();					
			} else if (error instanceof AxiosError) {
				throw error.response?.data || error.message;
			}
		
		}				
		
		return {} as User;		
	};
			
	const googleLogin = useGoogleLogin({				
		onSuccess: async (code ) => {				
			try {						
				const {userInfo, userTokens} = (await getUser(code ));								
				console.log('user en googleLogin ', userInfo);
				console.log('userTokens en googleLogin ', userTokens);
				setCodeResponse(code);			
				setUser(userInfo);	
				setTokens(userTokens);
				console.log('user en googleLogin ', userInfo);			
			}
			catch (error) {
				console.log('There was an error when retrieving user information. Please, try later ', error);
			}
			
		},
		flow: 'auth-code',
		select_account: false,
		//include_granted_scopes: false
		
		
	});

	useEffect(() => {	 
		
		console.log('user en useEffect ', user);
		if (user) {		
			console.log('user en useEffect dentro del if', user);								
			setLoading(false);			
			
			navigate('home', {replace: true});									
		}	
			
	},[navigate, user]); 
			
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
