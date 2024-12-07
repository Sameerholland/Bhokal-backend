const mongoose = require('mongoose')
const { Schema } = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);


const CourseSchema = new Schema(
   {
      thumbnail:{type:String,required:true},
      Course_No:{type:Number,unique:true, default:1},
      Course_Name:{type:String,required:true},
      Course_Duration:{type:String,required:true},
      Recorded_Video:{type:Boolean, default:false},
      Live_Classes:{type:Boolean,default:false},
      Demo_Classes:{type:Boolean,default:false},
      thumbnail:{type:String},
      price:{type:Number,required:true}
   },{timestamps:true}
)

CourseSchema   .plugin(AutoIncrement, { inc_field: 'userId' });


exports.Course = mongoose.model("Course",CourseSchema )