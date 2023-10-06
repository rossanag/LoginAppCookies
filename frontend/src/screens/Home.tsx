import { useLocalStorage } from '../hooks';
import { User } from '../types';


const Home = () => {
	const [ user ] = useLocalStorage<User | null>('user', null);
	console.log('user en Home ', user);	
	

	return (
		<>
			<h1 className="text-center m-3 text-xl font-medium">Welcome {user?.name} !!!</h1>
			<p> You are viewing this page because you are logged in or you just signed up</p>			
		</>	
	);
};
  
export default Home;

