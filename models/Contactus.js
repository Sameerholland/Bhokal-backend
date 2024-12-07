const mongoose = require('mongoose');
const {Schema} = mongoose;

const contactSchema = new Schema({
   Name:{type:String,required:true},
   email:{type:String, required:true},
   message:{type:String}
})


exports.contact = mongoose.model("contact", contactSchema)