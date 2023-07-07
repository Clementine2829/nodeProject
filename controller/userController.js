const asyncHandler = require("express-async-handler"); 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { json } = require("express");

//@desc Register a new user
//@route POST api/users/register
//@access public 
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if(!username || !email || !password){
        res.status(400);
        throw new Error("All fields are required");
    }

    const userAvailable = await User.findOne({ email });
    if(userAvailable){
        res.status(400);
        throw new Error("User already registered");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        username, 
        email, 
        password: hashedPassword
    });
    console.log("hashedPassword ", hashedPassword);
    console.log("user ", user);

    if(user){
        res.status(200).json({_id: user.id, email: email});
    }else{
        res.status(400);
        throw new Error("User data is not valid");
    }
});

//@desc Login user
//@route POST api/users/login
//@access public 
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password){
        res.status(400);
        throw new Error("All fields are required");
    }

    const user = await User.findOne({ email });
    // compare user password with the hashed password in db
    if(user && (await bcrypt.compare(password, user.password))){
        // when signing the access token, decide what you want to put inside
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user.id,
            },
        }, 
        process.env.ACCESS_TOKEN_SECRET, 
        { expiresIn: "10m"}
        );
        res.status(200).json({ accessToken });
    }else{
        res.status(401);
        throw new Error("Invalid user credentials")
    }
});

//@desc Current \ user
//@route GET api/users/current
//@access private 
const currentUser = asyncHandler(async (req, res) => {
    res.json(req.user);
});

module.exports = { 
    registerUser, 
    loginUser, 
    currentUser 
}