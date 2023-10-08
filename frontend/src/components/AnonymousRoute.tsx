import { Navigate } from 'react-router-dom';

import {UserData} from '../types';
import {useLocalStorage} from '../hooks';

interface IProps {
    children: JSX.Element;
}


export const AnonymousRoute = ({ children }: IProps):JSX.Element => {
	//const user:User = JSON.parse(localStorage.getItem('user') as string);
	const [user,] = useLocalStorage<UserData | null>('user',null);
	if (user) {
		return <Navigate to="/home" />;
	}
  
	return children;
};

export default AnonymousRoute;