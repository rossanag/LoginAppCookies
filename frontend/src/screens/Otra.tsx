import { useEffect, useState } from 'react';
//import { apiGoogle } from '../api/apiAxios';
import { useLocalStorage } from '../hooks';
//import { useNavigate } from 'react-router';
import { UserData } from '../types';
import { apiGoogle } from '../api/apiAxios';

const Otra = () => {									 
	const [user, ] = useLocalStorage<UserData | null>('user', null);
	const [otraData, setOtraData] = useState<string | undefined>();
	//const navigate = useNavigate();
	const urlOtra = (import.meta.env.VITE_SERVER_ENDPOINT as string) + '/protected/otra'; 

	console.log('user en OTRA ', user);

	useEffect(() => {
		const otra = async () => {
			try {
				console.log('entró al useEffect de OTRA!!!!!!!!!!!!');
				
				const resp = await apiGoogle.post(urlOtra);
				setOtraData(resp.data);
			} catch (error) {
				console.log('error en OTRA ', error);								
			}
		};
		
		otra();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); 
	
	return (
		<>
			{otraData && (
				<h2 className="text-center m-3 text-lg font-medium">{otraData}</h2>
			)}
		</>
	);
};

export default Otra;
