const { Course } = require("../models/Course");
const path = require('path')

exports.addCourse = async (req, res) => {
  console.log("ADD Course API Invoke");
  const url = req.file.filename;
  console.log(req.body);
  
  const {
    Name,
    duration,
    recorded,
    live,
    demo,
    price,
    No
  } = req.body;
  try {
    const newbatch = new Course({
      thumbnail:url,
      Course_No: No,
      Course_Name: Name,
      Course_Duration: duration,
      Recorded_Video: recorded,
      Live_Classes: live,
      Demo_Classes: demo,
      price:price
    });

    const savedBatch = await newbatch.save();


    const data = {
      thumbnail:url,
      Course_No: savedBatch.Course_No,
      Course_Name: savedBatch.Course_Name,
      Course_Duration: savedBatch.Course_Duration,
      Recorded_Video: savedBatch.Recorded_Video,
      Live_Classes: savedBatch.Live_Classes,
      Demo_Classes: savedBatch.Demo_Classes,
     
    }
    res.status(201).json({data:data,message:"Course Is added Succesfully"});
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      res.status(400).json({ message: `Duplicate Course Number Found ` });
    } else {
      res.status(500).json({ message: "server error" });
    }
  }
};

exports.GetAllCourse = async (req, res) => {
  console.log("get Course API Invoke");
 
  try {
    const cousres = await Course.find(
      {},
      "Course_No Course_Duration Course_Name thumbnail Recorded_Video Demo_Classes Live_Classes price"
    );

    if (!cousres || cousres.length === 0) {
      res.status(400).json({ message: "no courses exist" });
    }

   else{ res.status(200).json({ cousres })};
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCoursebyID = async (req, res) => {
  console.log("Get Course by ID API invoke");
  const { _id } = req.body;
  try {
    const course = await Course.findById(_id);

    if (!course || course.length === 0) {
      res.status(400).json({ message: "Course Not Found" });
    }
    res
      .status(200)
      .json({
        Course_No: course.Course_No,
        Course_Duration: course.Course_Duration,
        Course_Name: course.Course_Name,
        Recorded_Video: course.Recorded_Video,
        Live_Classes: course.Live_Classes,
        Demo_Classes: course.Demo_Classes,
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.DeleteCourse = async (req, res) => {
  console.log("Delete Course API Invoke");
  const { Course_No } = req.body;
  try {
    const course = await Course.findOneAndDelete(Course_No);

    if (!course) {
      res.status(400).json({ message: "Course Not Exist" });
    }
    res.status(200).json({ message: "Course Is deleted succesfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ messgae: "Server Error" });
  }
};
