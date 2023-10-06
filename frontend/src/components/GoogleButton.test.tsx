import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import GoogleButton from './GoogleButton'; // Import the GoogleButton component

describe('GoogleButton', () => {
	it('should call the onClick callback when clicked', () => {
		// Create a mock callback function
		const onClickMock = vi.fn();

		// Render the GoogleButton component with the mock callback
		const { getByText} = render(<GoogleButton onClick={onClickMock} />);

		// Find the button element by its text content		
		const button = getByText('Sign In');

		// Simulate a click event on the button
		fireEvent.click(button);

		// Expect the onClick callback to have been called once
		expect(onClickMock).toHaveBeenCalledTimes(1);
	});
});