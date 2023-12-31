import {useState, useEffect } from 'react';

import { NavLink } from 'react-router-dom';
import { UserData } from '../types';
import { useLocalStorage } from '../hooks';

const Navbar = () => {
	const activeLink = 'bg-blue-100 text-black';
	const normalLink = '';

	const [isLogged, setIsLogged] = useState(false);

	console.log('en Navbar');
	
	
	// const  user : User = JSON.parse(localStorage.getItem('user' ) as string);
	const [user,] = useLocalStorage<UserData | null>('user',null);

	useEffect(() => {		
		if (user?.email) {			
			setIsLogged(true);			
		}	
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user?.email]);


	return (
		<>
			<section className="bg-blue-100 h-20 w-full centered">
				<div className="w-full h-16 bg-black text-white text-xl uppercase font-bold grid grid-cols-4 overflow-hidden">										
					{(!isLogged) &&
						<NavLink
							to="/"
							className={({ isActive }) => (isActive ? activeLink : normalLink)}
						>
							{/* 	<p className="border w-full h-full px-4 centered">Login</p>  */}
							
						</NavLink>
					}					
					<NavLink
						to="/home" 
						className={({ isActive }) => (isActive ? activeLink : normalLink)}
					>
						<p className="border w-full h-full px-4 centered">Home</p>
					</NavLink>											
					<NavLink
						to="/profile"
						className={({ isActive }) => (isActive ? activeLink : normalLink)}
					>
						<p className="border w-full h-full px-4 centered">Profile</p>
					</NavLink>					
					<NavLink
						to="/about"
						className={({ isActive }) => (isActive ? activeLink : normalLink)}
					>
						<p className="border w-full h-full px-4 centered">About</p>
					</NavLink>					
					{isLogged && 
						<NavLink
							to="/logout"
							className={({ isActive }) => (isActive ? activeLink : normalLink)}
						>
							<p className="border w-full h-full px-4 centered">Logout</p>
						</NavLink>					
					}
				</div>
			</section>
		</>
	);
};

export default Navbar;
