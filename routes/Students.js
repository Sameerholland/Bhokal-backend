const express = require('express');
const { fetchAllStudents, fetchStudentDetail, UpdateStudent, DeleteStudent } = require('../controllers/Student');
const router =express.Router();

router.get('/', fetchAllStudents)
.post('/:id', fetchStudentDetail)
.patch('/:id', UpdateStudent)
.delete('/delete',DeleteStudent)
exports.router = router;