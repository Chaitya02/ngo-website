import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import './../../src/App.css';

function Nav_comp() {
  const dispatch = useDispatch();
  const user_id = useSelector((state) => (state.user ? state.user.id : ''));
  const name = useSelector((state) => (state.user ? state.user.name : ''));
  const admin = useSelector((state) => (state.user ? state.user.is_admin : ''));

  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  };
  return (
    <div className='mb-5'>
      <Navbar expand='lg' className='bg-body-tertiary' fixed='top'>
        <Container fluid>
          <Link to='/'>
            <Navbar.Brand>
              <img
                src='logo.jpg'
                className='ms-3'
                style={{ maxHeight: '30px' }}
              />
            </Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls='navbarScroll' />
          <Navbar.Collapse id='navbarScroll'>
            <Nav className='ms-auto me-5 my-2 my-lg-0' navbarScroll>
              <Link to='/Request' type='button' className='tdn'>
                <Navbar.Brand className='nav_tdn'>Request Blood</Navbar.Brand>
              </Link>
              <Link to='/Donate' type='button' className='tdn'>
                <Navbar.Brand className='nav_tdn'>Donate Blood</Navbar.Brand>
              </Link>
              <Alert.Link href='/#About' type='button' className='tdn'>
                <Navbar.Brand className='nav_tdn'>About</Navbar.Brand>
              </Alert.Link>
              <Alert.Link href='/#Contact' type='button' className='tdn'>
                <Navbar.Brand className='nav_tdn'>Contact</Navbar.Brand>
              </Alert.Link>
              {token ? (
                <div className='ms-5'>
                  {admin ? (
                    <Navbar.Brand className='nav_tdn_user'>
                      <b className='nav_admin'>Admin</b>
                    </Navbar.Brand>
                  ) : (
                    <Link
                      to={`/profile/${user_id}`}
                      type='button'
                      className='tdn'
                    >
                      <Navbar.Brand className='nav_tdn'>
                        <>{name}</>
                      </Navbar.Brand>
                    </Link>
                  )}
                  <Navbar.Brand>/</Navbar.Brand>
                  <Link onClick={handleLogout} type='button' className='tdn'>
                    <Navbar.Brand className='nav_tdn_user'>Logout</Navbar.Brand>
                  </Link>
                </div>
              ) : (
                <Link to='/Login' type='button' className='tdn'>
                  <Navbar.Brand className='nav_tdn'>Login</Navbar.Brand>
                </Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default Nav_comp;
