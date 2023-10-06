import { useLocalStorage } from '../hooks';
import  { User }  from '../types';


const Profile = () => {

	//const user = JSON.parse(localStorage.getItem('user') as string) as User;
	const [user, ] = useLocalStorage<User | null>('user', null);	

	return (
		<>
			<h2 className="text-center m-4 text-lg font-medium">Profile</h2>
			<div className='flex-row items-center justify-center'>
				<p> Name: {user?.name}</p>
				<p> Email: {user?.email}</p>
				<div className='mt-2'>
					<img src={user?.picture } referrerPolicy='no-referrer' alt="User img"></img>
				</div>
			</div>
		</>
	);
};

export default Profile;