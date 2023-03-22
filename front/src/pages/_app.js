import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
