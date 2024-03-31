import { useState } from 'react';

export interface LoginFormValues {
    email: string;
    password: string;
}

export interface LoginFormHandler {
    onSubmit: (values: LoginFormValues) => void;
}

const  useLoginForm = ({ onSubmit }: LoginFormHandler) => {
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');

	const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(event.target.value);
	};

	const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(event.target.value);
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		onSubmit({ email, password });
	};

	return {
		email,
		password,
		handleEmailChange,
		handlePasswordChange,
		handleSubmit
	};
};

export default useLoginForm;


