import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put('/reset', { email, password });

      if (response.data.success) {
        setMessage(
          'Password reset successful. You can now login with your new password.'
        );
      } else {
        setMessage(
          'Password reset failed. Please check your email and try again.'
        );
      }
    } catch (error) {
      console.error('Password reset failed:', error);
      setMessage('Password reset failed. Please try again later.');
    }
  };

  return (
    <div
      className='modal show'
      style={{ display: 'block', position: 'initial' }}
    >
      <Modal.Dialog>
        <h2 className='m-4'>Forgot Password</h2>
        <Form className='m-4' onSubmit={handleSubmit}>
          <Form.Group controlId='email' className='mb-3'>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type='email'
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId='password' className='mb-3'>
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Enter your new password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Button variant='primary' type='submit'>
            Reset Password
          </Button>
        </Form>
        {message && <p className='ms-4'>{message}</p>}
      </Modal.Dialog>
    </div>
  );
}

export default ForgotPassword;
