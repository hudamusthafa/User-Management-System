const userSchema = require('../model/userModel')
const bcrypt = require('bcryptjs')
const saltround = 10;

const registerUser = async (req,res)=>{

try{

  const {email,password} =req.body
  
  const user =await userSchema.findOne({email})
  if(user){
    return res.render('user/register',{message :'User already exists'})
  }

  const hashedPassword = await bcrypt.hash(password,saltround);

  const newUser = new userSchema({
    email,
    password:hashedPassword
  })
  await newUser.save();

  res.render('user/login',{message :'User created successfully'})

}catch(error){
   res.render('user/register',{message:'something went wrong'})
}
};

const logout = (req,res)=>{
  req.session.user = null; //remove session
 res.setHeader("Cache-Control", "no-store");  // prevent back button

  return res.redirect('/user/login');  // correct redirect
}



const login = async (req,res)=>{
  try {
    const {email,password} =req.body

    //check user exists
    const user = await userSchema.findOne({email})
    if(!user)
      return res.render ('user/login',{message:'User does not exist'})
    
    //compare password
     const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch)
      return res.render ('user/login',{message:'Incorrect password'})
    
    req.session.user = true 
    //success
    //res.render('user/login',{message:'Login Successful'})
    res.redirect('/user/home')

  } catch (error) {
    res.render('user/login', {message : 'Something went wrong'});
  }
}



const loadRegister = (req,res) =>{
  res.render('user/register')
}

const loadLogin = (req,res) =>{
  res.render('user/login')
}

const loadHome = (req,res) =>{
  res.render('user/userhome')
}


module.exports = {
  registerUser,
  loadRegister,
  loadLogin,
  login,
  loadHome,
  logout
}






