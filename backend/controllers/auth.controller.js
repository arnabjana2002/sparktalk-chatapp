import { User } from "../models/user.model.js";
import { generateToken } from "../lib/generateToken.js";
import cloudinary from "../lib/cloudinary.js";

//  @desc    Signup a new user
//  @route   POST /api/auth/signup
//  @access  Public
const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    // If any of the field is empty
    if ([fullName, email, password].some((item) => item?.trim() === "")) {
      return res.status(400).json({ message: "All field must be filled" });
    }

    // Password should be atleast 6 characters long
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 6 characters" });
    }

    // If there is an existing user
    const existedUser = await User.findOne({ email });
    if (existedUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Creating a New User
    //* Password is already encrypted using Pre Hook
    const newUser = await User.create({
      email,
      fullName: fullName.trim().toLowerCase(),
      password,
    });
    if (newUser) {
      generateToken(newUser._id, res);

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid User Credentials" });
    }
  } catch (error) {
    console.log("Error in Signup Controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//  @desc    Login a user
//  @route   POST /api/auth/login
//  @access  Public
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // If any of the field is empty
    if ([email, password].some((item) => item.trim() === "")) {
      return res.status(400).json({ message: "All field must be filled" });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Invalid Credentials" });
    }

    // Check if the password is correct
    //* isPasswordCorrect is a method defined in the User model
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(404).json({ message: "Invalid Credentials" });
    }
    // Generate JWT token and send it in the response
    generateToken(user._id, res);

    // Send user details in the response
    // Note: profilePic is optional, so it may not be present
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in Login Controller:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//  @desc    Logout a user
//  @route   POST /api/auth/logout
//  @access  Private
const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged Out Successfully" });
  } catch (error) {
    console.log("Error in Logout Controller:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// @desc    Update Profile Picture
// @route   PUT /api/auth/update-profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req?.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile Pic is required" });
    }

    // Deleting the current profile picture from Cloudinary
    const user = await User.findById(userId);
    if (user.profilePic) {
      await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
    }
    
    // Upload in Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in Update Profile Controller:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//  @desc    Check if the user is authenticated
//  @route   GET /api/auth/check
//  @access  Private
const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth Controller:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export { signup, login, logout, updateProfile, checkAuth };
