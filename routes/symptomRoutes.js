const express = require("express");
const { assessSymptoms } = require("../controllers/symptomController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();
router.post("/assess", authMiddleware, assessSymptoms);

module.exports = router;
