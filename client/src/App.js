import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {Signup} from './pages/Signup/Signup';
import User from './pages/User/User';
import Home from './pages/Home/Home';
function App() {
  return (
    <div className='App'>
    <Router>
      <Routes>
        <Route path='/' element = {<Home/>}></Route>
        <Route path='/signup' element = {<Signup></Signup>}></Route>
        <Route path='/user/:id' element = {<User/>}></Route>
      </Routes>
    </Router>
    </div>
  );
  
}

export default App;
