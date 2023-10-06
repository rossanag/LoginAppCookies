import { Button } from './common/Button';
import googleLogo from '../assets/icons/googleLogo.svg';

/* button props
border: string;
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
 */
export default function GoogleButton( props:{onClick:()=> void}):JSX.Element {
	return (
		<Button className='hover:bg-sky-800 focus:bg-sky-900 flex items-center space-x-2' color="bg-sky-700" width="100" height="400" radius="20" onClick={props.onClick} >
			<img src={googleLogo} alt="Google Logo" /><span>Sign In</span>
		</Button> 
    
      
	);
}
