import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Person1 from './Pages/Person1';
import Person2 from './Pages/Person2';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/chat" element={<Person1 />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Receiver" element={<Person2 />} />
        </Routes>
      </BrowserRouter>

    </>

  );
}

export default App;
