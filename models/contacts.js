const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const phoneSchema = new Schema({
    phonetype: {type:String},
    phonenumber: {type:Number}
})

const emailSchema = new Schema({
    emailtype: {type:String},
    emailid:{type:String}
})

const socialSchema = new Schema({
    socialtype: {type:String},
    socialid: {type:String}
})

const specificContactSchema = new Schema({
    name: {type:String},
    phone: {type:[phoneSchema]},
    contactemail:{type:[emailSchema]},
    line1: {type:String},
    line2: {type:String},
    line3: {type:String},
    note: {type:String},
    tags: {type:Array},
    dob: {type:Date},
    description: {type:String},
    social: {type:[socialSchema]},
    star: {type:Boolean,
    default: false},
    profilephoto: String
  

})

const contactSchema = new Schema({
    email: {type:String, required:true, unique:true},
    allcontacts: {type:[specificContactSchema]}
        
}
);

const Contact = mongoose.model('contact', contactSchema);
module.exports = Contact;
