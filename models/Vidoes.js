const mongoose = require('mongoose');
const {Schema} = mongoose;


const VideoSchema = new Schema({
   Url:{type:String,required:true},
   Video_No:{type:Number,required:true},
   Video_Title:{type:String,required:true},
   duration:{type:Number,required:true},
   Course_No:{ type: Schema.Types.ObjectId, ref: 'Course', required: true}
},{timestamps:true});


exports.video = mongoose.model('video', VideoSchema)