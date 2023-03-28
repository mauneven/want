const fs = require("fs");
const path = require("path");
const mammoth = require("mammoth");

exports.convertDocxToHtml = async function (req, res) {
  // Ruta del archivo .docx
  const filePath = path.join(process.cwd(), "public", "legal", "terms.docx");

  // Lee el archivo .docx y conviértelo a HTML
  const buffer = fs.readFileSync(filePath);
  const result = await mammoth.convertToHtml({ buffer });

  // Envía el HTML como respuesta
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(result.value);
};
