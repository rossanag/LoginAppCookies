import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserData } from '../types';
import { useLocalStorage } from '../hooks';
import { AUTH_USER } from '../api/authMode';

import { googleLogout } from '@react-oauth/google';

const Logout = () => {
	const [user, ,clear] = useLocalStorage<UserData | null>('user', null);
	const navigate = useNavigate();

	console.log('user en logout ', user);

	useEffect(() => {
		const logout = async () => {
			try {
				console.log('entró al useEffect de Logout!!!!!!!!!!!!!!!!!!!!!!!!!');
				
				const userAuth = user?.authMode as keyof typeof AUTH_USER;
				const resp = await (AUTH_USER[userAuth])();				
				console.log('Respuesta de logout ', resp.data);
				console.log('Logout ');  // toast */
						
				clear();
				googleLogout();
				navigate('/');
				console.log('se deslogueó en client');
			} catch (error) {
				console.log('error en Logout ', error);
				
				//Change this to a toast
			}
		};
		
		logout();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [clear, navigate, user]); //clear, navigate, user
	
	return <div/>;
};



export default Logout;