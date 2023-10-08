import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserData } from '../types';
import { useLocalStorage } from '../hooks';
import { AUTH_USER } from '../api/authMode';


const Logout = () => {
	const [user, , clear] = useLocalStorage<UserData | null>('user', null);

	console.log('user en logout ', user);

	const navigate = useNavigate();

	useEffect(() => {
		const logout = async () => {
			try {
				const userAuth = user?.authMode as keyof typeof AUTH_USER;
				await AUTH_USER[userAuth]();
				clear();
				navigate('/');
			} catch (error) {
				console.log('error en Logout ', error);
				//Change this to a toast
			}
		};
		logout();
	}, [clear, navigate, user]);
	
	return <div />;
};



export default Logout;