import {BrowserRouter} from 'react-router-dom';
import Route from './Routes/Route';
import logo from './logo.svg';
import './App.css';


function App() {
  return (
    <div className="App">
        <BrowserRouter>
        <Route />
      </BrowserRouter>
    </div>
  );
}

export default App;
