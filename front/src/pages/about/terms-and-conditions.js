import axios from "axios";

function Terms({ html }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export async function getServerSideProps() {
  // Obtiene el HTML desde el back-end
  const response = await axios.get("http://ec2-3-89-21-249.compute-1.amazonaws.com:4000/api/convertDocxToHtml");
  const html = response.data;

  return {
    props: {
      html,
    },
  };
}

export default Terms;
