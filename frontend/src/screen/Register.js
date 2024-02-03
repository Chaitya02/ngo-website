import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ToggleButton, ToggleButtonGroup, Col } from 'react-bootstrap';

function Register() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    name: '',
    email: '',
    password: '',
    mobile_no: '',
    is_admin: false,
    address: '',
    pin: '',
    state: '',
    dob: '',
    blood_group: '',
  });

  const [selectedBloodGroup, setSelectedBloodGroup] = useState('');
  const [error, setError] = useState(''); // Add state for error message

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const handleBloodGroup = (selected) => {
    setSelectedBloodGroup(selected);
    setInputs({
      ...inputs,
      blood_group: selected,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d+$/.test(inputs.pin) || !/^\d+$/.test(inputs.mobile_no)) {
      setError('Mobile number and pin should contain only numeric values.');
      return;
    }

    setError(''); // Clear any previous errors

    try {
      const response = await axios.post('http://localhost:5000/signup', inputs);

      if (response.data.success === true) {
        navigate('/Login');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Handle validation errors from the server
        setError(error.response.data.error);
      } else {
        console.error('Registration failed:', error);
        setError('An error occurred during registration. Please try again.');
      }
    }
  };

  return (
    <div
      className='modal show'
      style={{ display: 'block', position: 'initial' }}
    >
      <Modal.Dialog>
        <Form className='m-4' onSubmit={handleSubmit}>
          <h2 className='mb-3' style={{ textAlign: 'center' }}>
            Register
          </h2>
          <Form.Group className='mb-3' controlId='formBasicName'>
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type='text'
              name='name'
              placeholder='Enter your full name'
              value={inputs.name}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='formBasicEmail'>
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type='email'
              name='email'
              placeholder='Enter email'
              value={inputs.email}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='formBasicPhone'>
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type='text'
              name='mobile_no'
              placeholder='Phone Number'
              value={inputs.mobile_no}
              onChange={handleChange}
            />
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
          <Form.Group className='mb-3' controlId='formBasicAddress'>
            <Form.Label>Address</Form.Label>
            <Form.Control
              type='text'
              name='address'
              placeholder='Address'
              value={inputs.address}
              onChange={handleChange}
            />
          </Form.Group>
          <div className='d-flex mb-3'>
            <Form.Group className='mb-3 me-2' controlId='formBasicState'>
              <Form.Control
                type='text'
                name='state'
                placeholder='State'
                value={inputs.state}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className='mb-3' controlId='formBasicPin'>
              <Form.Control
                type='text'
                name='pin'
                placeholder='Pin'
                value={inputs.pin}
                onChange={handleChange}
              />
            </Form.Group>
          </div>
          <div className='d-flex mb-3'>
            <Form.Label className='mt-2 me-2'>Date of Birth:</Form.Label>
            <Form.Group as={Col} md='6'>
              <Form.Control
                type='date'
                name='dob'
                value={inputs.dob}
                onChange={handleChange}
              />
            </Form.Group>
          </div>
          <h6 className='mb-2 mt-3'>Select Blood Group</h6>
          <ToggleButtonGroup
            type='radio'
            name='options'
            value={selectedBloodGroup}
            onChange={handleBloodGroup}
            className='mb-3'
          >
            <ToggleButton
              className='bg_radio'
              id='A_p'
              variant='outline-danger'
              value={'A+'}
            >
              A+
            </ToggleButton>
            <ToggleButton
              className='bg_radio'
              id='A_n'
              variant='outline-danger'
              value={'A-'}
            >
              A-
            </ToggleButton>
            <ToggleButton
              className='bg_radio'
              id='B_p'
              variant='outline-danger'
              value={'B+'}
            >
              B+
            </ToggleButton>
            <ToggleButton
              className='bg_radio'
              id='B_n'
              variant='outline-danger'
              value={'B-'}
            >
              B-
            </ToggleButton>
            <ToggleButton
              className='bg_radio'
              id='AB_p'
              variant='outline-danger'
              value={'AB+'}
            >
              AB+
            </ToggleButton>
            <ToggleButton
              className='bg_radio'
              id='AB_n'
              variant='outline-danger'
              value={'AB-'}
            >
              AB-
            </ToggleButton>
            <ToggleButton
              className='bg_radio'
              id='O_p'
              variant='outline-danger'
              value={'O+'}
            >
              O+
            </ToggleButton>
            <ToggleButton
              className='bg_radio'
              id='O_n'
              variant='outline-danger'
              value={'O-'}
            >
              O-
            </ToggleButton>
          </ToggleButtonGroup>

          <Button className='ms-auto me-3' variant='primary' type='submit'>
            Register
          </Button>
          {error && <p className='text-danger'>{error}</p>}
        </Form>
      </Modal.Dialog>
    </div>
  );
}

export default Register;
