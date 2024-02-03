import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Table from 'react-bootstrap/Table';
import { useParams } from 'react-router-dom';
import Axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'; // Import Form from react-bootstrap
import './../../src/App.css';

function Camp() {
  const admin = useSelector((state) => (state.user ? state.user.is_admin : ''));
  let { id } = useParams();

  const [donors, setDonors] = useState([]);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState(''); // Add selected blood group state

  useEffect(() => {
    // Define an async function to fetch donor data
    const fetchDonorData = async () => {
      try {
        const response = await Axios.get(`http://localhost:5000/donor`);
        setDonors(response.data);
      } catch (error) {
        console.error('Error fetching donor data:', error);
      }
    };

    if (admin) {
      fetchDonorData(); // Fetch data if admin is true and id is available
    }
  }, [admin]);

  const camp_donors =
    donors.donor === undefined ? Object.values(0) : donors.donor;

  const Approved_Donors = camp_donors.filter(
    (donor) => donor.camp_id == id && donor.approval === true
  );

  const Rejected_Donors = camp_donors.filter(
    (donor) => donor.camp_id == id && donor.approval === null
  );

  // ____________ Filter Donors by Blood Group Function ______________

  const filterDonorsByBloodGroup = () => {
    if (selectedBloodGroup === '') {
      return Approved_Donors;
    } else {
      return Approved_Donors.filter(
        (donor) => donor.blood_group === selectedBloodGroup
      );
    }
  };

  const Camp_id_Donors = camp_donors.filter(
    (donor) => donor.camp_id == id && donor.approval === false
  );
  // ____________ Approve Function ______________

  const approveDonor = async (donorId) => {
    try {
      await Axios.patch(`http://localhost:5000/donor/${donorId}`, {
        donor: { approval: true },
      });
      window.location.reload();
      // You may want to update the state here to reflect the change in approval status.
    } catch (error) {
      console.error('Error approving donor:', error);
    }
  };

  // ____________ Reject Function ______________

  const rejectDonor = async (donorId) => {
    try {
      await Axios.patch(`http://localhost:5000/donor/${donorId}`, {
        donor: { approval: null },
      });
      window.location.reload();
      // You may want to update the state here to reflect the change in approval status.
    } catch (error) {
      console.error('Error rejecting donor:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    if (dateString !== null) return `${day}-${month}-${year}`;
  };

  if (admin === true) {
    return (
      <>
        <h5 className='mt-5 p-2 th_bg_s'>Active List</h5>
        <Table striped hover responsive='xl'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Blood Group</th>
              <th>DOB</th>
              <th>Phone Number</th>
              <th>Successfully Donated</th>
              <th>Reject</th>
            </tr>
          </thead>
          <tbody>
            {Camp_id_Donors.map((donor) => (
              <tr key={donor.id}>
                <td>{donor.donor_name}</td>
                <td>{donor.blood_group}</td>
                <td>{formatDate(donor.previous_donation_date)}</td>
                <td>{donor.mobile_no}</td>
                <td>
                  <Button
                    variant='primary'
                    onClick={() => approveDonor(donor.id)}
                  >
                    Approve
                  </Button>
                </td>
                <td>
                  <Button
                    variant='danger'
                    onClick={() => rejectDonor(donor.id)}
                  >
                    Reject
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <h5 className='mt-5 p-2 th_bg'>Completed Donors</h5>
        <Table striped responsive='xl'>
          <thead>
            <tr className='th_bg'>
              <th>Name</th>
              <th>
                <Form.Group controlId='filterBloodGroup'>
                  <Form.Label>Blood Group</Form.Label>
                  <Form.Control
                    as='select'
                    value={selectedBloodGroup}
                    onChange={(e) => setSelectedBloodGroup(e.target.value)}
                  >
                    <option value=''>All</option>
                    <option value='A+'>A+</option>
                    <option value='A-'>A-</option>
                    <option value='B+'>B+</option>
                    <option value='B-'>B-</option>
                    <option value='AB+'>AB+</option>
                    <option value='AB-'>AB-</option>
                    <option value='O+'>O+</option>
                    <option value='O-'>O-</option>
                  </Form.Control>
                </Form.Group>
              </th>
              <th>DOB</th>
              <th>Phone Number</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filterDonorsByBloodGroup().map((donor) => (
              <tr key={donor.id}>
                <td>{donor.donor_name}</td>
                <td>{donor.blood_group}</td>
                <td>{formatDate(donor.previous_donation_date)}</td>
                <td>{donor.mobile_no}</td>
                <td>Completed</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <h5 className='mt-5 p-2 th_bg'>Rejected Donors</h5>
        <Table>
          <thead>
            <tr className='th_bg'>
              <th>Name</th>
              <th>Blood Group</th>
              <th>DOB</th>
              <th>Phone Number</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {Rejected_Donors.map((donor) => (
              <tr key={donor.id}>
                <td>{donor.donor_name}</td>
                <td>{donor.blood_group}</td>
                <td>{formatDate(donor.previous_donation_date)}</td>
                <td>{donor.mobile_no}</td>
                <td>Rejected</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </>
    );
  } else {
    return null;
  }
}

export default Camp;
