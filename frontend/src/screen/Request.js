import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './../../src/App.css';
import { useSelector } from 'react-redux';

function Request() {
  const admin = useSelector((state) => (state.user ? state.user.is_admin : ''));
  const navigate = useNavigate();
  // ______________________ user Post _____________________
  const [inputs, setInputs] = useState({
    id: '',
    first_name: '',
    last_name: '',
    dob: '',
    blood_group: '',
    mobile_no: '',
    address: '',
    state: '',
    pin: '',
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const [error, setError] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState(null);

  const handleBloodGroup = (val) => {
    setSelectedBloodGroup(val);
  };
  const handleSubmit = async (e) => {
    console.log('submit button clicked');
    e.preventDefault();
    if (
      !inputs.first_name ||
      !inputs.last_name ||
      !inputs.dob ||
      !selectedBloodGroup ||
      !inputs.mobile_no ||
      !inputs.address ||
      !inputs.state ||
      !inputs.pin
    ) {
      setError('Please fill out all the required fields.');
      return;
    }
    try {
      const requestData = {
        ...inputs,
        blood_group: selectedBloodGroup,
        user_id: localStorage.getItem('user_id'),
      };

      const response = await axios.post(
        'http://localhost:5000/request',
        requestData
      );
      if (response.data.success) {
        console.log('Request submitted successfully:', response);
        navigate('/');
      } else {
        console.log('Request submission failed:', response);
        setError('Request submission failed. Please try again.');
      }
    } catch (error) {
      console.error('Request submission failed:', error);
      setError('Request submission failed. Please try again.');
    }
  };

  // _______________Admin get read Request ________________ //
  // fetch data to display in td
  const [Request, setRequest] = useState([]);
  useEffect(() => {
    readRequest();
  }, []);

  const readRequest = () => {
    axios
      .get('http://localhost:5000/admin/pending-requests')
      .then((response) => {
        setRequest(response.data);
      })
      .catch((error) => {
        console.error('Error fetching Request:', error);
      });
  };
  const reqs_main =
    Request.pendingRequests === undefined
      ? Object.values(0)
      : Request.pendingRequests;
  // _________________ comment text box __________
  // Initialize the comments state with initial values
  const initialComments = reqs_main.reduce((acc, req) => {
    acc[req.id] = ''; // Initialize each comment as an empty string
    return acc;
  }, {});

  const [comments, setComments] = useState(initialComments);

  // Function to handle comment input for a specific request
  const handleCommentChange = (e, requestId) => {
    const newComments = { ...comments };
    newComments[requestId] = e.target.value;
    setComments(newComments);
  };

  // Function to handle request approval
  // ____________ Approve ______________

  const approve_btn = async (reqId) => {
    try {
      // Send an API request to approve the request with the comment
      const response = await axios.patch(
        `http://localhost:5000/admin/approval/request/${reqId}`,
        {
          comment: comments[reqId],
          approval: true,
        }
      );
      window.location.reload();
    } catch (error) {
      console.error('Approval failed:', error);
    }
  };

  // Function to handle request rejection
  const reject_btn = async (reqId) => {
    try {
      // Send an API request to approve the request with the comment
      const response = await axios.patch(
        `http://localhost:5000/admin/approval/request/${reqId}`,
        {
          comment: comments[reqId],
          approval: null,
        }
      );
      window.location.reload();
    } catch (error) {
      console.error('Approval failed:', error);
    }
  };

  // ... date format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    if (dateString !== null) return `${day}-${month}-${year}`;
  };

  //  filter

  const reqs = reqs_main.filter((filter) => filter.approval === false);
  const Approved_req = reqs_main.filter((filter) => filter.approval === true);
  const Rejected_req = reqs_main.filter((filter) => filter.approval === null);

  if (admin === true) {
    return (
      <>
        <h2 className='m-3' style={{ textAlign: 'center' }}>
          Request Blood
        </h2>
        <h5 className='mt-5 p-2 th_bg_s'>Active List</h5>
        <Table striped responsive='xl'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Blood Group</th>
              <th>DOB</th>
              <th>Address</th>
              <th>Phone Number</th>
              <th>Approve/ Reject</th>
            </tr>
          </thead>
          <tbody>
            {reqs.map((req) => (
              <tr key={req.id}>
                <td>
                  {req.first_name} {req.last_name}
                </td>
                <td>{req.blood_group}</td>
                <td>{formatDate(req.dob)}</td>
                <td>
                  {req.address}
                  <br></br>
                  {req.state}
                  <br></br>
                  {req.pin}
                </td>
                <td>{req.mobile_no}</td>
                <td>
                  <form>
                    <input
                      type='text'
                      className='form-control'
                      placeholder='Add Comment'
                      value={comments[req.id]}
                      onChange={(e) => handleCommentChange(e, req.id)}
                    />
                    <div className='mt-2 ms-auto add_camp'>
                      <Button onClick={() => approve_btn(req.id)}>
                        Approve
                      </Button>
                      <Button
                        className='ms-2 me-2'
                        variant='danger'
                        onClick={() => reject_btn(req.id)}
                      >
                        Reject
                      </Button>
                    </div>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <h5 className='mt-5 p-2 th_bg'>Watch List</h5>
        <Table striped responsive='xl'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Blood Group</th>
              <th>DOB</th>
              <th>Address</th>
              <th>Phone Number</th>
              <th>Comment</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {Approved_req.map((req) => (
              <tr key={req.id}>
                <td>
                  {req.first_name} {req.last_name}
                </td>
                <td>{req.blood_group}</td>
                <td>{formatDate(req.dob)}</td>
                <td>
                  {req.address}
                  <br></br>
                  {req.state}
                  <br></br>
                  {req.pin}
                </td>
                <td>{req.mobile_no}</td>
                <td>{req.comment}</td>
                <td>Approved</td>
              </tr>
            ))}
            {Rejected_req.map((req) => (
              <tr key={req.id}>
                <td>
                  {req.first_name} {req.last_name}
                </td>
                <td>{req.blood_group}</td>
                <td>{formatDate(req.dob)}</td>
                <td>
                  {req.address}
                  <br></br>
                  {req.state}
                  <br></br>
                  {req.pin}
                </td>
                <td>{req.mobile_no}</td>
                <td>{req.comment}</td>
                <td>Rejected</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </>
    );
  } else {
    return (
      <>
        <h2 className='m-3' style={{ textAlign: 'center' }}>
          Request Blood
        </h2>
        <div
          className='modal show '
          style={{ display: 'block', position: 'initial' }}
        >
          <Modal.Dialog>
            <Form className='m-4' onSubmit={handleSubmit}>
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

              <Row className='mb-3'>
                <Form.Group as={Col} md='6'>
                  <Form.Label className='mt-2'>First name</Form.Label>
                  <Form.Control
                    type='text'
                    name='first_name'
                    placeholder='Enter your first name'
                    value={inputs.first_name}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group as={Col} md='6'>
                  <Form.Label className='mt-2'> Last name</Form.Label>
                  <Form.Control
                    type='text'
                    name='last_name'
                    placeholder='Enter your last name'
                    value={inputs.last_name}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group as={Col} md='6'>
                  <Form.Label className='mt-2'> Date of Birth:</Form.Label>
                  <Form.Control
                    type='date'
                    name='dob'
                    value={inputs.dob}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group as={Col} md='6'>
                  <Form.Label className='mt-2'> Phone Number</Form.Label>
                  <Form.Control
                    type='text'
                    name='mobile_no'
                    placeholder='Enter your phone number'
                    value={inputs.mobile_no}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group as={Col} md='6'>
                  <Form.Label className='mt-2'> Address</Form.Label>
                  <Form.Control
                    type='text'
                    name='address'
                    placeholder='Enter your address'
                    value={inputs.address}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group as={Col} md='3'>
                  <Form.Label className='mt-2'> State</Form.Label>
                  <Form.Control
                    type='text'
                    name='state'
                    placeholder='State'
                    value={inputs.state}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group as={Col} md='3'>
                  <Form.Label className='mt-2'> Pin Code</Form.Label>
                  <Form.Control
                    type='text'
                    name='pin'
                    placeholder='Pin Code'
                    value={inputs.pin}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Row>
              <Form.Group className='mb-3'>
                <Form.Check
                  label='Agree to terms and conditions'
                  feedback='You must agree before submitting.'
                  feedbackType='invalid'
                />
              </Form.Group>
              <Button className='ms-auto me-3' variant='primary' type='submit'>
                Submit Request
              </Button>
              {error && <p className='text-danger'>{error}</p>}
            </Form>
          </Modal.Dialog>
        </div>
      </>
    );
  }
}

export default Request;
