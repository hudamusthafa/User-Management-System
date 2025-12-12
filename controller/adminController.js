const adminModel = require('../model/adminModel');
const userModel = require('../model/userModel');
const bcrypt = require('bcrypt');


// ====================== LOAD LOGIN PAGE ======================
const loadLogin = (req, res) => {
    res.render('admin/login');
};



// ====================== ADMIN LOGIN ======================
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.render("admin/login", { message: "All fields are required" });
        }

        const admin = await adminModel.findOne({ email });

        if (!admin) {
            return res.render("admin/login", { message: "Invalid Credentials" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.render("admin/login", { message: "Invalid Credentials" });
        }

        // store admin id in session
        req.session.admin = admin._id;

        return res.redirect("/admin/dashboard");

    } catch (error) {
        console.log(error);
        res.render("admin/login", { message: "Something went wrong" });
    }
};



// ====================== LOAD DASHBOARD ======================
const loadDashboard = async (req, res) => {
    try {
        if (!req.session.admin) {
            return res.redirect("/admin/login");
        }

        // Prevent back button after logout
        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");

        const users = await userModel.find({});

        res.render("admin/dashboard", { users });

    } catch (error) {
        console.log(error);
        res.redirect("/admin/login");
    }
};



// ====================== LOAD ADD USER PAGE ======================
// const loadAddUserPage = (req, res) => {
//     if (!req.session.admin) return res.redirect("/admin/login");

//     // 🔥 VERY IMPORTANT — Prevent caching of Add User page
//     res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
//     res.setHeader("Pragma", "no-cache");
//     res.setHeader("Expires", "0");

//     res.render("admin/addUser", { message: "" });
// };
const loadAddUserPage = (req, res) => {

    const referer = req.get("referer") || "";

    // 🔥 Only block when BACK button triggered (no referer sent)
    if (referer === "") {
        return res.redirect("/admin/dashboard");
    }

    if (!req.session.admin) return res.redirect("/admin/login");

    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    res.render("admin/addUser", { message: "" });
};





// ====================== ADD USER ======================
const addUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.render("admin/addUser", { message: "All fields are required" });
        }

        // check duplicate
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.render("admin/addUser", { message: "Email already exists" });
        }

        // hash password
        const hashed = await bcrypt.hash(password, 10);

        await userModel.create({
            email,
            password: hashed
        });

        res.redirect(303,"/admin/dashboard");

    } catch (error) {
        console.log(error);
        res.render("admin/addUser", { message: "Error while adding user" });
    }
};



// ====================== DELETE USER ======================
const deleteUser = async (req, res) => {
    try {
        await userModel.findByIdAndDelete(req.params.id);
        res.redirect("/admin/dashboard");
    } catch (error) {
        console.log(error);
        res.redirect("/admin/dashboard");
    }
};



// ====================== SEARCH USER ======================
const searchUser = async (req, res) => {
    try {
        const q = req.query.query || "";

        const users = await userModel.find({
            email: { $regex: q, $options: "i" }
        });

       res.render("admin/dashboard", { users, query: q });


    } catch (error) {
        console.log(error);
        res.redirect("/admin/dashboard");
    }
};



// ====================== EDIT USER (LOAD EDIT PAGE) ======================
const loadEditPage = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);
        res.render("admin/editUser", { user, message: "" });
    } catch (err) {
        console.log(err);
        res.redirect(303,"/admin/dashboard");
    }
};



// ====================== UPDATE USER ======================
const updateUser = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.render("admin/editUser", { message: "Email is required" });
        }

        // check duplicate email except current user
        const existing = await userModel.findOne({
            email,
            _id: { $ne: req.params.id }
        });

        if (existing) {
            const user = await userModel.findById(req.params.id);
            return res.render("admin/editUser", { user, message: "Email already exists" });
        }

        await userModel.findByIdAndUpdate(req.params.id, { email });

        res.redirect(303,"/admin/dashboard");

    } catch (err) {
        console.log(err);
        res.redirect("/admin/dashboard");
    }
};



// ====================== LOGOUT ======================
const logout = (req, res) => {
    req.session.admin = null;

    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    res.redirect("/admin/login");
};



// ====================== EXPORT ======================
module.exports = {
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
};
