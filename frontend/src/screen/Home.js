import React from 'react';
import Carousel from 'react-bootstrap/Carousel';

const Home = () => {
  return (
    <div>
      <Carousel data-bs-theme='dark'>
        <Carousel.Item>
          <img className='d-block w-100' src='slider1.jpg' />
        </Carousel.Item>
        <Carousel.Item>
          <img className='d-block w-100' src='slider2.jpg' />
        </Carousel.Item>
        <Carousel.Item>
          <img className='d-block w-50' src='slider3.jpg' />
        </Carousel.Item>
      </Carousel>
      <div id='About'>
        <h1 className='mt-5 mb-3'>About</h1>
        <h4>
          SWAMI RAMANAND TEERTH RURAL GOVERNMENT MEDICAL COLLEGE BLOOD CENTRE
          ,AMBAJOGAI, is Asia's first rural medical college. with a capacity of
          500 beds overall, 2000 OPD patients per day, and 200 IPD patients. The
          hospital offers patients in a range of medical and surgical
          specialties a variety of diagnostic and therapeutic facilities. The
          hospital is equipped with an FDA-approved blood bank, an ART centre,
          an ICTC unit, a physiotherapy unit, and other facilities. We have
          designed the app and website to appeal to blood donors who can make
          voluntary Blood Donation because the average monthly collection of
          blood units in the blood bank is 550 and the average monthly
          requirement (demand) of blood units is 35% less than the demand.
        </h4>
        <br></br>
        <h4>
          स्वामी रामानंद टीअरथ गव्हर्नमेंट मेडिकल कॉलेज ब्लड सेंटर, अंबाजोगाई हे
          आशियातील पहिले ग्रामीण वैद्यकीय महाविद्यालय आहे, ज्याची क्षमता एकूण
          500 खाटांची आहे, दररोज 2000 ओ. पी. डी. रुग्ण आणि 200 आय. पी. डी. रुग्ण
          आहेत. हे रुग्णालय रुग्णांना विविध प्रकारच्या वैद्यकीय आणि
          शस्त्रक्रियेच्या वैशिष्ट्यांसह विविध निदान आणि उपचारात्मक सुविधा
          प्रदान करते. हे रुग्णालय एफ. डी. ए.-मान्यताप्राप्त रक्तपेढी, ए. आर.
          टी. केंद्र, आय. सी. टी. सी. युनिट, फिजिओथेरपी युनिट आणि इतर सुविधांनी
          सुसज्ज आहे. आम्ही एप आणि संकेतस्थळ तयार केले आहे.
        </h4>
        <div className='center mt-4'>
          <img className='d-block w-50' src='about.jpg' />
        </div>
      </div>
      <div id='Contact'>
        <h1 className='mt-5 mb-3'>Contact Us</h1>
        <h6>
          SWAMI RAMANAND TEERTH RURAL GOVERNMENT MEDICAL COLLEGE BLOOD CENTRE
          ,AMBAJOGAI
        </h6>
        <table>
          <tr>
            <td>
              <h6>LANDLINE:</h6>
            </td>
            <td>
              <h6>02446 244472</h6>
            </td>
          </tr>
          <tr>
            <td>
              <h6>EMAIL ID:</h6>
            </td>
            <td>
              <h6>srtrgmcbb@gmail.com</h6>
            </td>
          </tr>
          <tr>
            <td>
              <h6>MOBILE No.:</h6>
            </td>
            <td>
              <h6>8551813855, 9370001073</h6>
            </td>
          </tr>
        </table>
      </div>
    </div>
  );
};

export default Home;
