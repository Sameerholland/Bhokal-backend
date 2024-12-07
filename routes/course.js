const express = require('express');
const { addCourse, GetAllCourse, getCoursebyID, DeleteCourse } = require('../controllers/Course');
const multer = require("multer");


const storage = multer.diskStorage({
   destination: (req, file, cb) => {
     cb(null, "uploads/images"); // Save to 'uploads' folder
   },
   filename: (req, file, cb) => {
     cb(null, Date.now() + "-" + file.originalname); // Unique filename
   },
 });
 // File upload validation middleware
 const upload = multer({ storage });


const router = express.Router();

router.post('/',  upload.single("file"),  addCourse)
.get('/', GetAllCourse)
.post('/:id', getCoursebyID)
.delete('/:id', DeleteCourse)

exports.router = router;