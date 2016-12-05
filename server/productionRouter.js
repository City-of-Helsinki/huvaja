const path = require('path');

const express = require('express');

const router = express.Router();  // eslint-disable-line new-cap

// Serve index.html from every route
router.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../dist/index.html'));
});

module.exports = router;
