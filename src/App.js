import './App.css';
import AppRoutes from './Routes';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'jotai';

function App() {
  return (
    <Provider>
      <Router>
        <AppRoutes />
      </Router>
    </Provider>
  );
}

export default App;
