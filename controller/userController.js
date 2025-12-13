const User = require('../model/userModel');
const bcrypt = require('bcryptjs');
const saltround = 10;


// ======================= REGISTER USER =======================
const registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // simple empty validation
        if (!email || !password) {
            return res.render('user/register', { message: 'All fields are required' });
        }

        // check duplicate email
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.render('user/register', { message: 'User already exists' });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, saltround);

        // save user
        await User.create({
            email,
            password: hashedPassword
        });

        return res.render('user/login', { message: 'User created successfully' });

    } catch (error) {
        console.log(error);
        res.render('user/register', { message: 'Something went wrong' });
    }
};


// ========================== LOGIN ============================
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.render('user/login', { message: 'All fields are required' });
        }

        // find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('user/login', { message: 'User does not exist' });
        }

        // compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('user/login', { message: 'Incorrect password' });
        }

        // save session
        req.session.user = user._id;

        return res.redirect(303,'/user/home');

    } catch (error) {
        console.log(error);
        return res.render('user/login', { message: 'Something went wrong' });
    }
};


// ========================== HOME PAGE ============================
const loadHome = (req, res) => {
    if (!req.session.user) {
        return res.redirect('/user/login');
    }

    // prevent back button
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    res.render('user/userhome');
};



// ========================== LOGOUT ==============================
const logout = (req, res) => {
    req.session.user = null;

    // prevent back button access after logout
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    return res.redirect(303,'/user/login');
};


// ========================== LOAD PAGES ==========================
const loadRegister = (req, res) => {
    res.render('user/register');
};

const loadLogin = (req, res) => {
    res.render('user/login');
};


// ========================== EXPORTS =============================
module.exports = {
    registerUser,
    loadRegister,
    loadLogin,
    login,
    loadHome,
    logout
};
