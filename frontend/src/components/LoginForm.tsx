
import { CSSProperties } from 'react';
import useLoginForm from '../hooks/useLoginForm';
import { LoginFormHandler, LoginFormValues } from '../hooks/useLoginForm';



export type LoginStyleProps = {
    inputStyle: CSSProperties;
    labelStyle: CSSProperties;
    formStyle: CSSProperties;
};

export type LoginFormProps = LoginStyleProps & LoginFormHandler;


function LoginForm({ inputStyle, labelStyle, formStyle }: LoginStyleProps):JSX.Element {

	
	const onSubmit = ({ email, password }: LoginFormValues): void => {
		console.log('Login form submitted with:', { email, password });
		//return ;
	};

	const { email, password, handleEmailChange, handlePasswordChange, handleSubmit } = useLoginForm({ onSubmit });

	return (
		<>
			<form onSubmit={handleSubmit} style={formStyle}>
				<h2 style={{ fontFamily: 'Arial, sans-serif' }}>Login</h2>
				<label htmlFor="email" style={labelStyle}>Email<span style={{ color: 'red' }}>*</span>:</label>
				<input
					type="email"
					id="email"
					name="email"
					value={email}
					onChange={handleEmailChange}
					style={inputStyle}
					required
					aria-label="Email"
					placeholder='Email'
				/>
				<label htmlFor="password" style={labelStyle}>Password<span style={{ color: 'red' }}>*</span>:</label>
				<input
					type="password"
					id="password"
					name="password"
					value={password}
					onChange={handlePasswordChange}
					style={inputStyle}
					required
					aria-label="Password"
					placeholder='Password'
				/>
				<input type="submit" value="Login" style={inputStyle} />
				<div className="register-link">
					<a href="/register">Register</a>
				</div>
			</form>
		</>
	);
}


export default LoginForm;
