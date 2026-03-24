const express = require("express");
const router = express.Router();
const { askStoreAssistant } = require("../controllers/aiController");

router.route("/ai/chat").post(askStoreAssistant);

module.exports = router;