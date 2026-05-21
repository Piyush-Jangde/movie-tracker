const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req,res, next) => {
  try {
    const {email, password}=req.body;

    //Find user
    const user = await User.findOne({email});

    if(!user) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    //Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    //Generate Token
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"});

    res.send({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
      
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };