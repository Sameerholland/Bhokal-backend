const express = require('express');
const { addclass, getClassesByCourseId, DeleteClassQuery } = require('../controllers/videos');
const multer = require('multer')

const router = express.Router();


// Storage Configuration for Multer
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
     cb(null, "uploads/videos"); // Save to 'videos' folder
   },
   filename: (req, file, cb) => {
     cb(null, Date.now() + "-" + file.originalname); // Unique filename
   },
 });

 
 // File upload validation middleware
const fileFilter = (req, file, cb) => {
   const allowedTypes = ["video/mp4", "video/mkv", "video/avi"]; // Allowed video formats
   if (allowedTypes.includes(file.mimetype)) {
     cb(null, true); // Accept file
   } else {
     cb(new Error("Invalid file type. Only MP4, MKV, and AVI are allowed."), false); // Reject file
   }
 };

 const upload = multer({
   storage,
   fileFilter,
 });

router.post('/add-class',upload.single("file"), addclass )
 .post('/videos', getClassesByCourseId)
 .delete('/delete', DeleteClassQuery)
 

exports.router = router;