const { video } = require("../models/Vidoes");
const { sendMail, ConfirmTemplate } = require("../service/common");


exports.addclass = async (req,res)=>{
   console.log('Video Added API Invoke');
   const {number,name,duration,courseId} = req.body;
   
   try{
      const videoName = req.file.filename; // Assuming multer handles file uploads
      const newclass = new video({
         Video_Title:name,
         Url:videoName,
         Video_No:number,
         duration:duration,
         Course_No:courseId
      })
      const data = await newclass.save();
      res.status(201).json({message: "Class added successfully", _id:data._id})
   }
   catch(err){
      console.log(err);
      res.status(400).json({message:'Server error'})   
   }  
}


exports.getClassesByCourseId = async (req,res)=>{
   console.log('GET Classes By Course ID API Invoke');
   const {Id} = req.body;
   try{


      const videos = await video.find({ Course_No: Id })
      .select('-createdAt -updatedAt');  // Exclude timestamps

      if (!videos) {
         return res.status(404).json({ message: 'No videos found for this course.' });
       }

       res.status(200).json(videos)

   }
   catch(err){
      console.log(err);
      res.status(500).json({message:'server error'})
      
   }
   
}


exports.DeleteClassQuery = async (req,res)=>{
   console.log('Delete Query API called');

   
   try{

      const data = await video.findById(req.body.id)
         
      const newData = {
         _id:data._id,
         Name:data.Video_Title,
         value1:'video'
     
        }
        const subject = `Confirmation to Delete Video which has Course ID ${data.Course_No} `;
        const html = ConfirmTemplate(newData)
     
         await sendMail({subject,html})     
      

      // const response = await sendMail({data})
      // res.json(response)

   }
   catch(err){
      console.log(err);
      res.status(400).json({message:'Server error'})
      
   }
   
}