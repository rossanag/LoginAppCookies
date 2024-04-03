import { CSSProperties } from 'react';
import useLoginForm from '../hooks/useLoginForm';
import { LoginFormHandler, LoginFormValues } from '../hooks/useLoginForm';



interface LoginStyleProps {
    inputStyle?: CSSProperties;
    labelStyle?: CSSProperties;
    formStyle?: CSSProperties;
}  
// Example usage
const loginStyles: LoginStyleProps = {
	inputStyle: {
		width: '100%',
		padding: '8px',
		marginBottom: '10px',
		border: '1px solid #ccc',
		borderRadius: '3px'
	},
	labelStyle: {
		display: 'block',
		marginBottom: '5px',
		fontWeight: 'bold'
	},
	formStyle: {
		width: '300px',
		margin: '0 auto',
		padding: '20px',
		border: '1px solid #ccc',
		borderRadius: '5px',
		backgroundColor: '#f9f9f9'
	}
};
  
export type LoginFormProps = LoginStyleProps & LoginFormHandler;


function LoginLocalForm({ inputStyle, labelStyle, formStyle }: LoginStyleProps):JSX.Element {

	
	const onSubmit = ({ email, password }: LoginFormValues): void => {
		console.log('Login form submitted with:', { email, password });		
	};

	const { email, password, handleEmailChange, handlePasswordChange, handleSubmit } = useLoginForm({ onSubmit });

	return (
		<>
			<form onSubmit={handleSubmit} style={formStyle}>
				<fieldset>
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
						autoComplete='on'
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
						autoComplete='on'
					/>
					<input type="submit" value="Login" style={inputStyle} />
				</fieldset>
				<div className="register-link">
					<a href="/register">Register</a>
				</div>
			</form>
		</>
	);
}

const LoginForm = ():JSX.Element => {
	return(
		<LoginLocalForm inputStyle={loginStyles.inputStyle} labelStyle={loginStyles.labelStyle} formStyle={loginStyles.formStyle} />
	);
};

export default LoginForm;
