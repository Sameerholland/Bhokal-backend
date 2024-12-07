const mongoose = require("mongoose");
const { User } = require("../models/user");
const { Course } = require("../models/Course");
const { video } = require("../models/Vidoes");

exports.getDashboardDetails = async (req, res) => {
  console.log("Get Dashboard Details API invoke");

  try {
    const user = await User.find({ role: "user" }).exec();
    const course = await Course.find({}).exec();
    const videos = await video.find({}).exec();
    res.json({ user: user, course: course, video: videos });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Server Error" });
  }
};
