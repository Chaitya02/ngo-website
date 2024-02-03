import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [inputs, setInputs] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset the error message and start loading
    setError('');
    setLoading(true);

    if (!inputs.email || !inputs.password) {
      setError('Both email and password are required.');
      setLoading(false);
      return;
    }

    if (!validateEmail(inputs.email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    if (inputs.password.length < 4) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/login', inputs);

      if (response.data.success === true) {
        console.log('Login successful:', response.data.success);
        dispatch({ type: 'SET_USER', payload: response.data.ud });
        navigate('/');
        localStorage.setItem('token', response.data.authToken);
        localStorage.setItem('user_id', response.data.user_id);
      } else {
        setError('Please enter a correct email and password.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email) => {
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div
      className='modal show'
      style={{ display: 'block', position: 'initial' }}
    >
      <Modal.Dialog>
        <Form className='m-4' onSubmit={handleSubmit}>
          <h2 className='mb-3' style={{ textAlign: 'center' }}>
            Login
          </h2>
          <Form.Group className='mb-3' controlId='formBasicEmail'>
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type='email'
              name='email'
              placeholder='Enter email'
              value={inputs.email}
              onChange={handleChange}
            />
            <Form.Text className='text-muted'>
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className='mb-3' controlId='formBasicPassword'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              name='password'
              placeholder='Password'
              value={inputs.password}
              onChange={handleChange}
            />
          </Form.Group>

          <Button
            className='mx-auto my-3'
            variant='primary'
            type='submit'
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>

          {error && <p className='text-danger'>{error}</p>}

          <div>
            Don't have an account? <Link to='/Register'>Register Now</Link>
          </div>
          <div>
            <Link to='/forgot-password'>Forgot Password?</Link>
          </div>
        </Form>
      </Modal.Dialog>
    </div>
  );
}

export default Login;
