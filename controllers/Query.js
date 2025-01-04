const { contact } = require("../models/Contactus");
const { newsletter } = require("../models/newsletter");

exports.ContactQuery = async (req, res) => {
  console.log("Contact Query API invoke");
  try {
    const query = new contact({
      email: req.body.email,
      Name: req.body.Name,
      message: req.body.message,
    });
    const savedquery = await query.save();
    res
      .status(201)
      .json({ message: `Your Query Is added and Id is ${savedquery._id}` });
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: "Server Error" });
  }
};


exports.GetQueryData = async (req,res) =>{
  console.log('Get All Query Data API called');
  try{
  const data = await contact.find();
  res.status(200).json(data)
  }
  catch(err){
    console.log(err);
    res.status(500).json({message:'Server Error'})
  }
}

exports.DeleteQueryByID = async (req,res)=>{
  console.log('Delte Query By ID API Invoke');
  const {_id} = req.body;

  
  try{
    const data = await contact.findByIdAndDelete(_id)
    res.status(200).json(data)

  }
  catch(err){
    console.log(err);
    res.status(500).json({message:'Server Error'})
    
  }
  
}
  
exports.addnewsletter = async (req, res) => {
  console.log("Add NewsLEtter API invoke");
  const email = req.body.email_address
  
  try {
    const query = new newsletter({ email: email });

    const savedquery = await query.save();

    res
      .status(201)
      .json({
        message: `Your Newsletter Is added and Id is ${savedquery._id}`,
      });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Server Error" });
  }
};

exports.getAllNewsLetter = async (req,res)=>{
  console.log('Get All NewsLetter API Invoke');
  try{
    const data = await newsletter.find();
    res.status(200).json(data)
  }
  catch(err){
    console.log(err);
    res.status(500).json({message:'server error'})
    
  }
  
}

exports.deleteNewsLetter = async (req,res)=>{
  console.log('Delete NewsLetter API Invoke');
  const {_id} = req.body;
  try{
    const data = await newsletter.findByIdAndDelete(_id);
    res.status(200).json(data)
  }
  catch(err){
    console.log(err);
    res.status(500).json({message:'Server error'})
    
  }
  
}
