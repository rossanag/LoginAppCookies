import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';


//<GoogleOAuthProvider clientId="<your_client_id>">...</GoogleOAuthProvider>;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
