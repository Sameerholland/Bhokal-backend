const crypto = require("crypto");
const { User } = require("../models/user");
const bcrypt = require("bcryptjs");
const { sanitizeUser, CreateAdminConformationtemplate, sendMail } = require("../service/common");
const jwt = require("jsonwebtoken");


//This Is API TO Create User From Admin 
exports.createUser = async (req, res) => {
  console.log("Create API Called");
  const { email, password, role, Batch_No, Name } = req.body;
  const modifiedemail = email.toLowerCase();  
  const salt = await bcrypt.genSalt(10); // Salt which is used to hash password and store in database
  const hashedPassword = await bcrypt.hash(password, salt); // Hash Password to For Security 
  const user = new User({
    Name: Name,
    password: hashedPassword,
    email: modifiedemail,
    salt: salt,
    Batch_No: Batch_No, // Example batches
    role: role, // or 'admin'
  });
  try {
    const saveduser = await user.save();
    const token = jwt.sign(sanitizeUser(saveduser), process.env.JWT_SECRET_KEY);
    res
      .cookie("jwt", token, {
        expires: new Date(Date.now() + 3600000),
        httpOnly: true,
      })
      .status(201)
      .json(sanitizeUser(saveduser));
  } catch (err) {
    console.error("Error creating user:", err);
  }
};

exports.loginUser = async (req, res) => {
  // const { email, password } = req.body;
  console.log("Log in API called");
  const user = req.user;

  

  res
  .cookie('jwt', user.token, {
    expires: new Date(Date.now() + 3600000),
    httpOnly: true,
  })
  .status(200)
  .json({id:user.data.id,email:user.data.email,role:user.data.role,Batch_No:user.data.Batch_No});
};


exports.checkUser = async (req,res)=>{
  console.log('Check User API Invoke');
  
  if (req.user) {
    res.json(req.user);
  } else {
    res.sendStatus(401);
  }

}

exports.forgetpassword = async (req, res) => {
  console.log("Forget Password Invoke");
  const { email, password } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  try {
    const user = await User.findOneAndUpdate(
      { email }, // Find user by email
      { $set: { password: hashedPassword, salt: salt } }, // Update the password
      { new: true, runValidators: true } // Options to return the updated document and validate input
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({
        message: "Password updated successfully",
        _id: user._id,
        email: user.email,
        role: user.role,
        Batch_NO:updatedData.Batch_No,
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.createAdmin = async (req,res)=>{
  console.log('Create Admin API Invoke');
  console.log(req.body);
  
  try{

    const subject = `confirm to Create A Admin whose email Address is ${req.body.email} `;
    const html = CreateAdminConformationtemplate(req.body)
     
    await sendMail({subject,html})  



  }
  catch(err){
    console.log(err);
    res.status(500).json({message:'server errror'})
    
  }
  
}
