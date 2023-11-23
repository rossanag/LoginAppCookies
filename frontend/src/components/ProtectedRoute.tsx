import { Navigate, Outlet } from 'react-router-dom';

import { useLocalStorage } from '../hooks';
import {User} from '../types';

interface IProps {
    children: JSX.Element;
}

const ProtectedRoute = ( {children}: IProps ): JSX.Element => {
	const [user,] = useLocalStorage<User | null>('user',null);		
    
	if (!user) {
		return <Navigate to="/" />;
		
	}
	//console.log('children ');
	return children ? children : <Outlet/>;		
};

export default ProtectedRoute;

