import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import InputGroup from 'react-bootstrap/InputGroup';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import { useSelector } from 'react-redux';

function Donate() {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const admin = useSelector((state) => (state.user ? state.user.is_admin : ''));
  const userID = useSelector((state) => (state.user ? state.user.id : ''));

  // __________ register camp modal ____________
  // Register Form Start
  const [showRegister, setShowRegister] = useState(false);
  const handleCloseRegister = () => {
    setShowRegister(false);

    // Reset the state to initial values
    setRegisterInputs({
      donor_name: '',
      mobile_no: '',
      date: '',
    });

    setSelectedBloodGroup(null);
    setValidationErrors({});
  };

  const handleShowRegister = () => setShowRegister(true);

  // error message
  const [errorMessage, setErrorMessage] = useState('');

  // __________ add camp modal ____________
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // __________ EDIT camp modal ____________
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

  // ____________ API ______________
  const [inputs, setInputs] = useState({
    camp_name: '',
    date: '',
    time: '',
    address: '',
    state: '', // Updated column name
    pin: '', // Updated column name
  });
  const [camps, setCamps] = useState([]);
  useEffect(() => {
    readCamps();
  }, []);

  const createCamp = (campData) => {
    Axios.post('http://localhost:5000/camp', campData)
      .then((response) => {
        console.log('Camp created:', response.data);
        readCamps();
        handleClose();
      })
      .catch((error) => {
        console.error('Error creating camp:', error);
      });
  };

  const readCamps = () => {
    Axios.get('http://localhost:5000/camp')
      .then((response) => {
        setCamps(response.data);
      })
      .catch((error) => {
        console.error('Error fetching camps:', error);
      });
  };

  const updateCamp = (id, campData) => {
    Axios.put(`http://localhost:5000/camp/${id}`, campData)
      .then((response) => {
        console.log('Camp updated:', response.data);
        // Update the UI or refetch the list of camps
        readCamps();
        handleClose2();
      })
      .catch((error) => {
        console.error('Error updating camp:', error);
      });
  };

  // _________________Delete Camp_____________________
  const deleteCamp = (id) => {
    Axios.delete(`http://localhost:5000/camp/${id}`)
      .then((response) => {
        console.log('Camp deleted:', response.data);
        // Update the UI or refetch the list of camps
        readCamps();
      })
      .catch((error) => {
        console.error('Error deleting camp:', error);
      });
  };

  // _________________ ADD Camp _____________________
  const handleAddCamp = () => {
    const campData = {
      camp_name: inputs.camp_name,
      date: inputs.date,
      time: inputs.time,
      address: inputs.address,
      state: inputs.state,
      pin: inputs.pin,
    };

    createCamp(campData);

    handleClose();
    setInputs({
      camp_name: '',
      date: '',
      time: '',
      address: '',
      state: '',
      pin: '',
    });
  };

  // _________________Edit Camp_____________________

  const [editCamp, setEditCamp] = useState(null);

  const handleEditCamp = (camp) => {
    setEditCamp(camp);
    setInputs({
      camp_name: camp.camp_name,
      date: camp.date,
      time: camp.time,
      address: camp.address,
      state: camp.state,
      pin: camp.pin,
    });

    handleShow2();
  };

  const handleEditChanges = () => {
    const campData = {
      camp_name: inputs.camp_name,
      date: inputs.date,
      time: inputs.time,
      address: inputs.address,
      state: inputs.state, // Updated column name
      pin: inputs.pin, // Updated column name
    };
    updateCamp(editCamp.id, campData); // Pass the ID of the camp
  };

  // _________________ user register to Camp _____________________
  const [registerInputs, setRegisterInputs] = useState({
    donor_name: '',
    mobile_no: '',
    date: '',
    gender: '',
  });
  const [campID, setCampID] = useState(null);
  const handleRegister = (campID) => {
    setCampID(campID);
    handleShowRegister();
  };
  const [validationErrors, setValidationErrors] = useState({});
  const [selectedBloodGroup, setSelectedBloodGroup] = useState(null);

  const handleBloodGroup = (val) => {
    setSelectedBloodGroup(val);
    setValidationErrors({
      ...validationErrors,
      bloodGroup: null,
    });
  };

  const handleRegisterChange = (e) => {
    e.preventDefault();
    const errors = {};
    if (!registerInputs.donor_name) {
      errors.donor_name = 'Donor name is required.';
    }
    if (!registerInputs.mobile_no || registerInputs.mobile_no.length < 10) {
      errors.mobile_no = 'Invalid Mobile number';
    }
    if (!registerInputs.date) {
      errors.date = 'Date of birth is required.';
    }
    if (!selectedBloodGroup) {
      errors.bloodGroup = 'Blood group is required.';
    }
    if (!registerInputs.gender) {
      errors.gender = 'Gender is required.';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
    } else {
      handleCloseRegister();
      console.log('Form submitted successfully');
    }
    const donorData = {
      donor_name: registerInputs.donor_name,
      mobile_no: registerInputs.mobile_no,
      previous_donation_date: registerInputs.date,
      blood_group: selectedBloodGroup,
      camp_id: campID,
      user_id: userID,
      gender: registerInputs.gender,
    };

    Axios.post('http://localhost:5000/donor', donorData)
      .then((response) => {
        console.log('Donor registered:', response.data);
        //handleCloseRegister(); // Close the registration modal
      })
      .catch((error) => {
        console.error('Error registering donor:', error);
        // Add logic here to handle errors, e.g., showing an error message
      });
  };

  return (
    <>
      <h2 className='m-3' style={{ textAlign: 'center' }}>
        Donate Blood
      </h2>
      {admin ? (
        <div className='add_camp'>
          <Button variant='primary' onClick={handleShow}>
            Add Camp
          </Button>
        </div>
      ) : (
        ''
      )}
      <div
        className='modal show p-4'
        style={{ display: 'block', position: 'initial' }}
      ></div>
      <Row xs={1} md={2} className='g-4'>
        {camps.map((camp) => (
          <Col key={camp.id}>
            <Card>
              <Card.Body>
                <Card.Title className='mb-4' style={{ textAlign: 'center' }}>
                  Camp Name: {camp.camp_name}
                </Card.Title>
                <Card.Text>
                  <Row className='mb-3'>
                    <Col md={8}>
                      <h6>
                        <b>Location: </b>
                        {camp.address}
                      </h6>
                    </Col>
                    <Col md={6}>
                      <h6>
                        <b>State: </b>
                        {camp.state}
                      </h6>
                      <h6>
                        <b>Zip Code: </b>
                        {camp.pin}
                      </h6>
                    </Col>
                    <Col md={6}>
                      <h6>
                        <b>Date: </b>
                        {formatDate(camp.date)}
                      </h6>
                      <h6>
                        <b>Time: </b>
                        {camp.time}
                      </h6>
                    </Col>
                  </Row>
                  {admin ? (
                    <div className='ms-auto d-flex'>
                      <Button
                        className='ms-1'
                        variant='primary'
                        onClick={() => handleEditCamp(camp)}
                      >
                        Edit
                      </Button>
                      <Button
                        className='ms-1'
                        variant='danger'
                        onClick={() => deleteCamp(camp.id)}
                      >
                        Delete
                      </Button>
                      <Button className='ms-auto' variant='primary'>
                        <Link className='tdn_details' to={`Camp/${camp.id}`}>
                          Details
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className='ms-auto '>
                      <Button
                        className='ms-1'
                        variant='primary'
                        onClick={() => handleRegister(camp.id)}
                      >
                        Register
                      </Button>
                    </div>
                  )}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {/* Add modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className='ms-4 mb-4 mt-3 me-4'>
            <Row className='mb-3'>
              <Form.Group as={Col} md='6' controlId='validationCustom01'>
                <Form.Label>Camp Name</Form.Label>
                <Form.Control
                  required
                  type='text'
                  placeholder='Camp Name'
                  value={inputs.camp_name}
                  onChange={(e) =>
                    setInputs({ ...inputs, camp_name: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group as={Col} md='6' controlId='validationCustom02'>
                <Form.Label>Date of Camp:</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    type='date'
                    required
                    value={inputs.date}
                    onChange={(e) =>
                      setInputs({ ...inputs, date: e.target.value })
                    }
                  />
                  <Form.Control.Feedback type='invalid'>
                    Date of Camp.
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Row>
            <Row className='mb-3'>
              <Form.Group as={Col} md='6' controlId='validationCustom03'>
                <Form.Label>Time</Form.Label>
                <Form.Control
                  required
                  type='time'
                  placeholder='Time'
                  value={inputs.time}
                  onChange={(e) =>
                    setInputs({ ...inputs, time: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group as={Col} md='6' controlId='validationCustom04'>
                <Form.Label>Location</Form.Label>
                <Form.Control
                  required
                  type='text'
                  placeholder='Location'
                  value={inputs.address}
                  onChange={(e) =>
                    setInputs({ ...inputs, address: e.target.value })
                  }
                />
              </Form.Group>
            </Row>
            <Row className='mb-3'>
              <Form.Group as={Col} md='6' controlId='validationCustom05'>
                <Form.Label>State</Form.Label>
                <Form.Control
                  required
                  type='text'
                  placeholder='State'
                  value={inputs.state}
                  onChange={(e) =>
                    setInputs({ ...inputs, state: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group as={Col} md='6' controlId='validationCustom06'>
                <Form.Label>Zip Code</Form.Label>
                <Form.Control
                  required
                  type='text'
                  placeholder='Zip Code'
                  value={inputs.pin}
                  onChange={(e) =>
                    setInputs({ ...inputs, pin: e.target.value })
                  }
                />
              </Form.Group>
            </Row>
          </Form>
          <div className='add_camp'>
            <Button variant='primary' onClick={handleAddCamp}>
              Add
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      {/* Edit modal*/}
      <Modal show={show2} onHide={handleClose2}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Camp</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className='ms-4 mb-4 mt-3 me-4'>
            <Form.Group controlId='editCampName'>
              <Form.Label>Camp Name</Form.Label>
              <Form.Control
                required
                type='text'
                placeholder='Camp Name'
                value={inputs.camp_name}
                onChange={(e) =>
                  setInputs({ ...inputs, camp_name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId='editCampDate'>
              <Form.Label>Date of Camp</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type='date'
                  required
                  value={inputs.date}
                  onChange={(e) =>
                    setInputs({ ...inputs, date: e.target.value })
                  }
                />
              </InputGroup>
            </Form.Group>
            <Form.Group controlId='editCampTime'>
              <Form.Label>Time</Form.Label>
              <Form.Control
                required
                type='time'
                value={inputs.time}
                onChange={(e) => setInputs({ ...inputs, time: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId='editCampLocation'>
              <Form.Label>Location</Form.Label>
              <Form.Control
                required
                type='text'
                placeholder='Location'
                value={inputs.address}
                onChange={(e) =>
                  setInputs({ ...inputs, address: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId='editCampState'>
              <Form.Label>State</Form.Label>
              <Form.Control
                required
                type='text'
                placeholder='State'
                value={inputs.state}
                onChange={(e) =>
                  setInputs({ ...inputs, state: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId='editCampZipCode'>
              <Form.Label>Zip Code</Form.Label>
              <Form.Control
                required
                type='text'
                placeholder='Zip Code'
                value={inputs.pin}
                onChange={(e) => setInputs({ ...inputs, pin: e.target.value })}
              />
            </Form.Group>
          </Form>
          <div className='add_camp'>
            <Button variant='primary' onClick={handleEditChanges}>
              Edit Camp
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Registration modal*/}
      <Modal show={showRegister} onHide={handleCloseRegister}>
        <Modal.Header closeButton>
          <Modal.Title>Register as Donor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className='m-4'>
            <Form.Group controlId='registerDonorName' className='mb-4'>
              <Form.Label>Donor Name</Form.Label>
              <Form.Control
                required
                type='text'
                placeholder='Donor Name'
                value={registerInputs.donor_name}
                onChange={(e) => {
                  setRegisterInputs({
                    ...registerInputs,
                    donor_name: e.target.value,
                  });
                  setValidationErrors({
                    ...validationErrors,
                    donor_name: null,
                  });
                }}
              />
              <div className='text-danger'>{validationErrors.donor_name}</div>
            </Form.Group>
            <Form.Group controlId='registerMobileNo' className='mb-4'>
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control
                required
                type='tel'
                placeholder='Mobile Number'
                value={registerInputs.mobile_no}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  const numericValue = inputValue.replace(/\D/g, '');
                  const limitedValue = numericValue.slice(0, 10);
                  setRegisterInputs({
                    ...registerInputs,
                    mobile_no: limitedValue,
                  });
                  setValidationErrors({
                    ...validationErrors,
                    mobile_no: null,
                  });
                }}
                minLength={10}
                maxLength={10}
              />
              <div className='text-danger'>{validationErrors.mobile_no}</div>
            </Form.Group>

            <Form.Group controlId='registerdate' className='mb-4'>
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type='date'
                required
                value={registerInputs.date}
                onChange={(e) => {
                  setRegisterInputs({
                    ...registerInputs,
                    date: e.target.value,
                  });
                  setValidationErrors({
                    ...validationErrors,
                    date: null,
                  });
                }}
              />
              <div className='text-danger'>{validationErrors.date}</div>
            </Form.Group>
            <Form.Group controlId='registerGender' className='mb-4'>
              <Form.Label>Gender</Form.Label>
              <Form.Control
                as='select'
                required
                value={registerInputs.gender}
                onChange={(e) => {
                  setRegisterInputs({
                    ...registerInputs,
                    gender: e.target.value,
                  });
                  setValidationErrors({
                    ...validationErrors,
                    gender: null,
                  });
                }}
              >
                <option value=''>Select Gender</option>
                <option value='Male'>Male</option>
                <option value='Female'>Female</option>
                <option value='Other'>Other</option>
              </Form.Control>
              <div className='text-danger'>{validationErrors.gender}</div>
            </Form.Group>

            <Form.Group controlId='registerBloodGroup' className='mb-4'>
              <Form.Label>Select Blood Group</Form.Label>
              <ToggleButtonGroup
                type='radio'
                required
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
              <div className='text-danger'>{validationErrors.bloodGroup}</div>
            </Form.Group>
          </Form>
          <div className='add_camp'>
            <Button
              variant='primary'
              type='submit'
              onClick={handleRegisterChange}
            >
              Register
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Donate;
