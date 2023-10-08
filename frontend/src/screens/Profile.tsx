import { useLocalStorage } from '../hooks';
import  { UserData }  from '../types';


const Profile = () => {
	
	const [user, ] = useLocalStorage<UserData | null>('user', null);	

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