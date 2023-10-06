import LoginGoogle from './LoginGoogle';
import { screen } from '@testing-library/react';

describe('LoginGoogle', () => {
	it('should render successfully', () => {        
		<LoginGoogle />;
		expect(screen).toBeTruthy   ();
	
	});
});