import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AuthProvider } from './component/AuthContent';

const rootElement = document.getElementById('root');
ReactDOM.render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
  rootElement
);
