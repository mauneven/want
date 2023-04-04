import axios from "axios";

function Terms({ html }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export async function getServerSideProps() {
  // Obtiene el HTML desde el back-end
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/convertDocxToHtml`);
  const html = response.data;

  return {
    props: {
      html,
    },
  };
}

export default Terms;
