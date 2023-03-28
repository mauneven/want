const express = require("express");
const docxController = require("../controllers/docxController");

const router = express.Router();

router.get("/convertDocxToHtml", docxController.convertDocxToHtml);

module.exports = router;
