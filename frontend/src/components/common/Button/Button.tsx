
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import '../../../index.css';

import  {__textSize, __border, __padding, __color, __backgroundColors } from './style';

interface Props {
  border?: string;
  color: string;
  children?: ReactNode;
  height: string;
  onClick: () => void;
  radius: string
  width: string;
  type?: 'primary' | 'secondary' | 'text';
  isBlock?: boolean;
  disabled?: boolean;
  className?: string;
  href?: string;
  target?: string;  

}


const Button = ({
	type = 'primary',
	border,
	children,
	onClick,
	className = '',
	disabled = false,
	href,
	target,
	isBlock = true,
	width,
}: Props): JSX.Element => {
	const disabledStyle = disabled ? 'opacity-50 cursor-not-allowed' : 'transition ease-in-out duration-300 hover:cursor-pointer';
  
	
	let baseClasses = ['uppercase','font-oswald',__textSize, __border[type],__backgroundColors[type],__color[type],__padding, disabledStyle];
  
	if (className) {
		baseClasses = [...baseClasses, ...className.split(' ')];
	}
	if (isBlock) {
		baseClasses = [...baseClasses, 'block w-full'];
	}
	if (width) {
		baseClasses = [...baseClasses, width];
	}
  
	if (href) {
		const linkClasses = [...baseClasses, 'flex items-center justify-center whitespace-nowrap'];
		return (
			<Link to={href} target={target} onClick={onClick} className={linkClasses.join(' ')}>
				{children}
			</Link>
		);
	}
  
	return (
		<button onClick={onClick} className={baseClasses.join(' ')} disabled={disabled}>
			{children}
		</button>
	);
};
  

export default Button;
