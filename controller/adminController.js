const adminModel = require('../model/adminModel')
const bcrypt = require('bcrypt')
const userModel = require('../model/userModel')
 
//login page
const loadLogin = async (req,res) =>{
  res.render('admin/login')
}

const login = async(req,res)=>{

  try {

     const {email,password} = req.body
     const admin = await adminModel.findOne({email})

     if(!admin)
      return res.render ('admin/login',{message:'Invalid Credentials'})

      const isMatch = await bcrypt.compare(password,admin.password)
      if(!isMatch)
       return res.render ('admin/login',{message:'Invalid Credentials'})

     

      // Save session
       req.session.admin = true 
   
      // Redirect to dashboard
       return res.redirect('/admin/dashboard')

  } catch (error) {

    res.render('admin/login', {message : 'Something went wrong'});
  }
}



//dashboard
const loadDashboard = async(req,res)=>{

  try {

     const admin = req.session.admin

     if(!admin)
      return res.redirect ('/admin/login')

     const users = await userModel.find({})
    
      res.render('admin/dashboard',{users})

  } catch (error) {

    console.log(error);
    return res.redirect('/admin/login');
  }
}


//add user
const addUser = async (req,res)=>{
  try {
    const { email, password } = req.body;

    const exists = await userModel.findOne({ email });
    if (exists) return res.redirect('/admin/dashboard');

    const hashed = await bcrypt.hash(password, 10);

    await userModel.create({ email, password: hashed });

    res.redirect('/admin/dashboard');

  } catch (error) {
    console.log(error);
    res.redirect('/admin/dashboard');
  }
};
//delete user
const deleteUser = async (req,res)=>{
  try {
    await userModel.findByIdAndDelete(req.params.id);
    res.redirect('/admin/dashboard');
  } catch (error) {
    res.redirect('/admin/dashboard');
  }
};

//serach user
const searchUser = async (req,res)=>{
  try {
    const q = req.query.query;

    const users = await userModel.find({
      email: { $regex: q, $options: 'i' }
    });

    res.render('admin/dashboard', { users });

  } catch (error) {
    res.redirect('/admin/dashboard');
  }
};

// ------------------ EDIT USER (LOAD EDIT PAGE) ------------------
const loadEditPage = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    res.render("admin/editUser", { user });
  } catch (err) {
    console.log(err);
    res.redirect("/admin/dashboard");
  }
};

// ------------------ UPDATE USER ------------------
const updateUser = async (req, res) => {
  try {
    const { email } = req.body;
    await userModel.findByIdAndUpdate(req.params.id, { email });
    res.redirect("/admin/dashboard");
  } catch (err) {
    console.log(err);
    res.redirect("/admin/dashboard");
  }
};

//logout
const logout = (req,res)=>{
  req.session.admin = null;
  res.redirect('/admin/login');
};
// ------------------ LOAD ADD USER PAGE ------------------
const loadAddUserPage = (req, res) => {
  res.render("admin/addUser");
};


module.exports ={
  loadLogin,
  login,
  loadDashboard,
  addUser,
  deleteUser,
  searchUser,
  loadEditPage,
  updateUser,
  loadAddUserPage,
  logout
}