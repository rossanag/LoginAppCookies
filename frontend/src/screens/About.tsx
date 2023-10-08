import { useState, useEffect } from 'react';
import { apiGoogle } from '../api/apiAxios';

const About = () => {									 
	const aboutURL = import.meta.env.VITE_SERVER_ENDPOINT + '/about' as string;	
	const [aboutData, setAboutData] = useState<string | undefined>();
	
	useEffect(() => {
		const fetchData = async () => {
			try {
				const resp = await apiGoogle.post(aboutURL);				
				setAboutData(resp.data);
			} catch (error) {
				console.log('error en About ', error);
				//Change this to a toast
			}
		};
		fetchData();

	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [aboutURL]);

	return (
		<>
			{aboutData && (
				<h2 className="text-center m-3 text-lg font-medium">{aboutData}</h2>
			)}
		</>
	);
};

export default About;
