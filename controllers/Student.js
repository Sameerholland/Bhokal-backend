const { User } = require("../models/user");
const { sanitizeUser, sendMail, ConfirmTemplate } = require("../service/common");

exports.fetchAllStudents = async (req, res) => {
  console.log("Fetch All Students API Invoke");
  try {
    const students = await User.find({ role: "user" }, "Name email Batch_No").populate({path:'Batch_No',select:'_id Course_No'});

  console.log(students);
  

    if (!students || students.length === 0) {
      return res.status(404).json({ message: "No students found" });
    }

    res.status(200).json({ students });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "server error" });
  }
};

exports.fetchStudentDetail = async (req, res) => {
  console.log("Fetch All Students API Invoke");
  try {
    const student = await User.findOne({ email: req.body.email });

    if (!student || student.length === 0) {
      return res.status(404).json({ message: "No students found" });
    }
    res.status(201).json(sanitizeUser(student))
  } catch (err) {
   console.log(err)
   res.status(500).json({message:'server error'})
  }
};
exports.UpdateStudent = async (req, res) => {
   console.log('Update API Invoke');
   const {email,key,value} = req.body;
  try {

   const updatedData = await User.findOneAndUpdate({email},{ $set: { key: value } },{new:true});

   if (!updatedData) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({
        message: `${key} updated successfully`,
        _id: updatedData._id,
        email: updatedData.email,
        role: updatedData.role,
        Batch_NO:updatedData.Batch_No,
      });
  } catch (err) {
   console.log(err)
   res.status(500).json({message:'server error'})
  }
};

exports.DeleteStudent = async (req, res) => {
   console.log('Delet Student API Invoke');
   console.log(req.body);
   
  try {
    const data = await User.findById(req.body.id);
   const newData = {
    _id:data._id,
    Name:data.Name,
    value1:'student'

   }

   const subject = 'Confirmation to Delete Student';
   const html = ConfirmTemplate(newData)

    await sendMail({subject,html})

   if(!data){
      res.status(400).json({message:'Student Not Exsit'})
   }
   res.status(200).json({message:'Conformation Mail Send to Your Email'})
  } catch (err) {
   console.log(err)
   res.status(500).json({message:'server error'})
  }
};
