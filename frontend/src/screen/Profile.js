import Table from 'react-bootstrap/Table';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './../../src/App.css';

function Profile() {
  let { id } = useParams();

  // fetch data to display in td for Request Blood
  const [Request, setRequest] = useState([]);
  useEffect(() => {
    readRequest();
  }, []);

  const readRequest = () => {
    axios
      .get(`http://localhost:5000/user/requested/bloodstatus/${id}`)
      .then((response) => {
        setRequest(response.data);
        // console.error(response.data);
      })
      .catch((error) => {
        console.error('Error fetching Request:', error);
      });
  };

  const reqs =
    Request.requestedBloodStatus === undefined
      ? Object.values(0)
      : Request.requestedBloodStatus;

  // fetch data to display in td for Request Blood
  const [Donate, setDonate] = useState([]);
  useEffect(() => {
    readDonate();
  }, []);

  const readDonate = () => {
    axios
      .get(`http://localhost:5000/user/donor/${id}`)
      .then((response) => {
        setDonate(response.data);
      })
      .catch((error) => {
        console.error('Error fetching DonateHistory:', error);
      });
  };

  const reqs1 =
    Donate.user_donor === undefined ? Object.values(0) : Donate.user_donor;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    if (dateString !== null) return `${day}-${month}-${year}`;
  };

  return (
    <>
      <h2 className='m-3' style={{ textAlign: 'center' }}>
        Profile
      </h2>

      {/* User Requested for Blood */}
      <h4 className='mt-5 p-2 th_bg'>Requested Blood History</h4>
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
              <td>{req.comment}</td>
              <td>
                {req.approval === true
                  ? 'Approved'
                  : req.approval === false
                  ? 'Pending'
                  : 'Rejected'}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* User Blood Donate approval history*/}
      <h4 className='mt-5 p-2 th_bg'>Doanted Blood History</h4>
      <Table striped responsive='xl'>
        <thead>
          <tr>
            <th>Donar Name</th>
            <th>Blood Group</th>
            <th>Mobile Number</th>
            <th>Camp Name</th>
            <th>Camp Location</th>
            <th>Camp Date and Time</th>
            <th>Blood Doanted Status</th>
          </tr>
        </thead>
        <tbody>
          {reqs1.map((req) => (
            <tr key={req.id}>
              <td>{req.donor_name}</td>
              <td>{req.blood_group}</td>
              <td>{req.mobile_no}</td>
              <td>{req.camp_name}</td>
              <td>
                {req.address}
                <br></br>
                {req.state}
                <br></br>
                {req.pin}
              </td>
              <td>{formatDate(req.date)}<br></br>{req.time}</td>
              <td>
                {req.approval === true
                  ? 'Suceessfully Donate'
                  : req.approval === false
                  ? 'Upcoming'
                  : 'Missed'}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default Profile;
