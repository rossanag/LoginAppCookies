import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { useLocalStorage } from '../hooks';

const Logout = () => {
    
	localStorage.clear();
	const[user,,clear] = useLocalStorage<User | null>('user', null);	

	
	console.log('user en logout ', user);
	
	const navigate = useNavigate();
		
	useEffect(() => {
		clear();
		navigate('/'); 

		// navigate(0);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <div />;
};

export default Logout;