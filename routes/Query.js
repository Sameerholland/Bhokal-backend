const express = require('express');
const { ContactQuery, addnewsletter, GetQueryData, getAllNewsLetter, DeleteQueryByID, deleteNewsLetter } = require('../controllers/Query');

const router = express.Router();


router.post('/', ContactQuery)
.post('/newsletter', addnewsletter)
.get('/query', GetQueryData)
.get('/newsletter', getAllNewsLetter)
.delete('/query', DeleteQueryByID)
.delete('/newsletter',deleteNewsLetter)
exports.router = router;