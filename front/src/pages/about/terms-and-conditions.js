import axios from "axios";

function Terms({ html }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export async function getServerSideProps() {
  // Obtiene el HTML desde el back-end
  const response = await axios.get("want.com.co/api/convertDocxToHtml");
  const html = response.data;

  return {
    props: {
      html,
    },
  };
}

export default Terms;
