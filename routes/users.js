const express = require('express');
var router = express.Router();
const Joi = require('joi');
const passport = require('passport');
const randomstring = require('randomstring');
const mailer = require('../misc/mailer');
const {OAuth2Client} = require('google-auth-library')
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID)

const User = require('../models/user');
const Contact = require('../models/contacts')

// Validation of User Schema
const userSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  password: Joi.string().regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/).required(),
  confirmationPassword: Joi.any().valid(Joi.ref('password')).required()
});

// Authorization 
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.json({error:'Sorry, but you must be registered first!'});
  }
};

const isNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.json({error:'Sorry, but you are already logged in!'});
  } else {
    return next();
  }
};

//Validation of Contact Schema
const contactSchema = Joi.object().keys({
  email: Joi.string().email().required(),
});

router.get('/',async function(req, res) {
  try{
  const result = await User.find()
  res.send(result)
  }catch(err){
  console.log(err)
  }
  
  });

router.route('/register')
  .get(isNotAuthenticated, (req, res) => {
    res.json({error:'Not authenticated'});
  })
  .post(async (req, res, next) => {
    try {
      const result = userSchema.validate(req.body);
      if (result.error) {
        console.log(result.error)
        res.json({error:'Data is not valid. Please try again.'});
        return;
      }

      // Checking if email is already taken
      const user = await User.findOne({ 'email': result.value.email });
      if (user) {
        res.json({erroremail:'Email is already in use.'});
        // res.redirect('/users/register');
        return;
      }

      //Checking if username is already taken
      const usererr = await User.findOne({'username': result.value.username});
      if(usererr) {
        res.json({erroruser:'Username is already in use'});
        return;
      }

      // Hash the password
      const hash = await User.hashPassword(result.value.password);

      // Generate secret token
      const secretToken = randomstring.generate();
      console.log('secretToken', secretToken);

      // Save secret token to the DB
      result.value.secretToken = secretToken;

      // Flag account as inactive
      result.value.active = false;

      // Save user to DB
      delete result.value.confirmationPassword;
      result.value.password = hash;

      const newUser = await new User(result.value); 
      // console.log('newUser', newUser);
      await newUser.save();

      // Compose email
      const html = `Hi there,
      <br/>
      
      <br/><br/>
      Please verify your email by typing the following token:
      <br/>
      Token: <b>${secretToken}</b>
      <br/>
      On the following page:
      <a href="https://address-book2022-client.herokuapp.com/#/verify">https://address-book2022-client.herokuapp.com/#/verify</a>
      <br/><br/>
      Have a pleasant day.` 

      // Send email
      await mailer.sendEmail('myaddressbook2022@gmail.com', result.value.email, 'Please verify your email!', html);

      res.json({success:'Please Check your email'})
     
    } catch(error) {
      next(error);
    }
  })
  .delete(async (req,res,next)=>{
    try{
      // const result = req;
      const email = req.query.email;
      console.log(email)
      const user = await User.findOne({ 'email': email });
      const data = await User.deleteOne({ 'email': email })
      res.json({success:'Data Deleted',user,data})
  
    }
    catch(error){
      next(error)
    }
  })

router.route('/login')
  .get(isNotAuthenticated, (req, res) => {
    res.json({error:'Not authenticated'});
  })
  .post((req,res,next)=>{
    passport.authenticate('local', (error, user, info)=>{
    // successRedirect: '/users/dashboard',
    // failureRedirect: '/users/login'
    console.log(user,info)
    return res.json({user,info});
  })(req,res,next);
}
  )

router.route('/dashboard')
  .get(isAuthenticated, (req, res) => {
    res.json({succes: 'Dashboard', 
      username: req.user.username
    });
  });

router.route('/verify')
  .get(isNotAuthenticated, (req, res) => {
    res.json({error:'Not authenticated'});
  })
  .post(async (req, res, next) => {
    try {
      const { secretToken } = req.body;

      // Find account with matching secret token
      const user = await User.findOne({ 'secretToken': secretToken });
      if (!user) {
        res.json({error:'No user found.'});
        return;
      }

      user.active = true;
      user.secretToken = '';
      await user.save();

    res.json({email:user.email,success: 'Thank you! Now you may login.'});
    } catch(error) {
      next(error);
    }
  })

router.route('/logout')
  .get(isAuthenticated, (req, res) => {
    res.json({success:'Successfully logged out. Hope to see you soon!'});

  });

router.route('/contacts')
.get(async (req,res,next) =>{
  try{
  
  const email = req.query.email;
  // console.log(req.body.email)
  // const result = await Contact.find({'email':email})
  // console.log(result)
const user = await Contact.findOne({'email':email});
// console.log(user,email)
// console.log(user)
if(!user){
  res.json({error:'No contacts found'});
  return
}
res.json({user,success: 'Contacts found'});
  }
  catch(error)
  {
    next(error)
  }

})
.post(async (req,res,next)=>{
  try{
    const result = req.body;
   // Checking if email is already taken
      const user = await Contact.findOne({ 'email': result.email });
      
      if (user) {
        res.json({error:'Email is already in use. You have already verified your email.'});
        // res.redirect('/users/register');
        return;
      }
     const newContact = await new Contact(result); 
      // console.log('newUser', newUser);
      await newContact.save();
      res.json({
        success:'Default Contacts created'
      })
  }
  catch(error)
  {
    next(error)
  }
})
.put(async (req,res,next)=>{
  try{
    const result = req.body;
    const user=await Contact.updateOne({email:result.email},result)
    res.json({success:'Data Updated',user})

  }
  catch(error){
    next(error)
  }
})

router.put('/contacts-edit', async (req,res,next)=>{
  try{
    const result = req.body;
    
    
    const user = await Contact.updateOne({email:result.email},{$set:{'allcontacts.$[elemX]':result.allcontacts}},{arrayFilters:[{
      'elemX.name':result.name
    }]})
    
    res.json({success:'Data Updated',user})
  }
  catch(error){
    console.log(error)
    next(error)
  }
})

router.post('/google-login', async (req,res)=>{
  
  const {token} = req.body;
  const ticket = await client.verifyIdToken({
    idToken:token,
    audience: process.env.CLIENT_ID
  });
  const {name, email, picture} = ticket.getPayload();
  res.json({name, email, picture})
})

module.exports = router;