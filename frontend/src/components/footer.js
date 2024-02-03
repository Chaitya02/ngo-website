import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
const Footer = () => {
  return (
    <footer>
      <Container>
        <Row>
          <Col className='text-center py-3'>
            Copyright &copy;
            <img
              src='logo.jpg'
              className='ms-3'
              style={{ maxHeight: '30px' }}
            />
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
