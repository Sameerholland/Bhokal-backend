const express = require('express');
const { getDashboardDetails } = require('../controllers/Dashboard');

const router = express.Router();


router.get('/', getDashboardDetails);



exports.router = router;