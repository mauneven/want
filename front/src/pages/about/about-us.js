import Head from 'next/head';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const vision = "Nuestra visión es crear una plataforma que permita a los usuarios publicar sus necesidades y encontrar ofertas de otros usuarios en un entorno seguro y confiable. Queremos facilitar las negociaciones entre los usuarios y crear una comunidad de confianza en la que todos puedan beneficiarse del intercambio de bienes y servicios."
const mission = "Nuestra misión es construir una plataforma fácil de usar que conecte a personas que necesitan algo con personas que pueden ofrecer algo. Queremos hacer que sea fácil para los usuarios publicar sus necesidades y encontrar ofertas de otros, al mismo tiempo que proporcionamos un entorno seguro y confiable para las negociaciones. Buscamos crear una plataforma que beneficie a todos los involucrados y fomente la colaboración y el apoyo mutuo."
const values = [
    "Colaboración: Creemos que trabajando juntos podemos lograr grandes cosas.",
    "Confianza: Valoramos la confianza y nos esforzamos por crear un entorno seguro y confiable para todos los usuarios.",
    "Comunidad: Nuestro objetivo es construir una comunidad de individuos con ideas afines que se apoyen y ayuden mutuamente.",
    "Innovación: Abrazamos la innovación y buscamos constantemente nuevas formas de mejorar nuestra plataforma.",
    "Accesibilidad: Creemos que todos deberían tener acceso a nuestra plataforma y sus beneficios."
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