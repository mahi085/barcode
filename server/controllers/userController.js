// import bcrypt from "bcryptjs";
// import User from "../models/userModel.js";
// import jwt from "jsonwebtoken";

// export const registerUser = async (req, res) => {
//   try {

//     const { name, email, password } = req.body;

//     if (!name || !email || !password) {
//       return res.status(400).json({
//         success:false,
//         message:"All fields required"
//       });
//     }

//     const existingUser = await User.findOne({ email });

//     if (existingUser) {
//       return res.status(400).json({
//         success:false,
//         message:"User already exists"
//       });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword
//     });

//     res.status(201).json({
//       success:true,
//       message:"User created successfully"
//     });

//   } catch (error) {
//     res.status(500).json({ message:error.message });
//   }
// };

// export const loginUser = async (req, res) => {
//   try {

//     const { email, password } = req.body;

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(400).json({
//         success:false,
//         message:"Invalid email or password"
//       });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(400).json({
//         success:false,
//         message:"Invalid email or password"
//       });
//     }

//     const token = jwt.sign(
//       { id: user._id },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.status(200).json({
//       success:true,
//       token,
//       user:{
//         id:user._id,
//         name:user.name,
//         email:user.email
//       }
//     });

//   } catch (error) {
//     res.status(500).json({ message:error.message });
//   }
// };


import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

// ✅ REGISTER USER
export const registerUser = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    // 🔹 Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // 🔹 Clean email
    email = email.trim().toLowerCase();

    // 🔹 Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    // 🔹 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔹 Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully"
    });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// ✅ LOGIN USER
export const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    // 🔹 Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // 🔹 Clean email
    email = email.trim().toLowerCase();

    // 🔹 Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // 🔹 Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // 🔹 Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};