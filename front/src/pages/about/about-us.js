import Head from 'next/head';
import { Container, Row, Col } from 'react-bootstrap';

const vision = "Our vision is to create a platform that allows users to post their needs and find offers from other users in a safe and reliable environment. We want to facilitate negotiations between users and create a trusted community where everyone can benefit from the exchange of goods and services."
const mission = "Our mission is to build a user-friendly platform that connects people who need something with people who can offer something. We want to make it easy for users to post their needs and find offers from others while providing a secure and reliable environment for negotiations. We aim to create a platform that benefits all involved and fosters collaboration and mutual support."
const values = [
"Collaboration: We believe that by working together, we can achieve great things.",
"Trust: We value trust and strive to create a safe and reliable environment for all users.",
"Community: Our goal is to build a community of like-minded individuals who support and help each other.",
"Innovation: We embrace innovation and constantly seek new ways to improve our platform.",
"Accessibility: We believe that everyone should have access to our platform and its benefits."
];
  
const AboutPage = () => {
    return (
        <>
          <Head>
            <title>Sobre Nosotros</title>
          </Head>
          <Container className="my-5">
            <Row className="justify-content-center">
              <Col md={8}>
                <h1 className="text-center mb-4">Sobre Nosotros</h1>
                <div className="text-center mb-5">
                  <p className="lead">{vision}</p>
                </div>
                <div className="mb-5">
                  <h2 className="text-center mb-4">Nuestra Misión</h2>
                  <p>{mission}</p>
                </div>
                <div>
                  <h2 className="text-center mb-4">Nuestros Valores</h2>
                  <ul>
                    {values.map((value, index) => (
                      <li key={index}>{value}</li>
                    ))}
                  </ul>
                </div>
              </Col>
            </Row>
          </Container>
        </>
      );      
  };  
export default AboutPage;