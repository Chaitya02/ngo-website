import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Nav_Bar from './components/navbar';
import Footer from './components/footer';
import Login from './screen/Login';
import Register from './screen/Register';
import Home from './screen/Home';
import Forgot from './screen/Forgot';
import Request from './screen/Request';
import Donate from './screen/Donate';
import Camp from './screen/Camp';
import Profile from './screen/Profile';

import './App.css';

function App() {
  return (
    <Router>
      <Nav_Bar />
      <main className='py-2'>
        <Container>
          <Routes>
            <Route path='/' element={<Home />} exact />
            <Route path='Login' element={<Login />} />
            <Route path='Register' element={<Register />} />
            <Route path='forgot-password' element={<Forgot />} />
            <Route path='Request' element={<Request />} />
            <Route path='Donate' element={<Donate />} />
            <Route path='Donate/Camp/:id' element={<Camp />} />
            <Route path='Profile/:id' element={<Profile />} />
          </Routes>
        </Container>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
