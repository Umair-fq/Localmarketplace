const User = require('../Models/UserModel')
const Product = require('../Models/ProductModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');


const registerUser = async (req, res) => {
    const {username, email, password, phoneNo} = req.body;
    if(!username || !email || !password) {
        // 400 Bad Request is useful for signaling that the client should modify the request before retrying.
        return res.status(400).json({ message: "All fields are required"});
    }
    if(!validator.isEmail(email)) {
        return res.status(400).json({ message: "Email is not valid"});
    }

    // Check if the user already exists by username or email
    const isUserRegistered = await User.findOne({ $or: [{ username: username }, { email: email }] });
    if (isUserRegistered) {
        return res.status(400).json({ message: "User already exists with given username or email"});
    } else {
        if(!validator.isStrongPassword(password)) {
            return res.status(400).json({ message: "Password is weak"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            phoneNo: phoneNo
        })
        if(user) {
            // Generate a verification token
            res.status(200).send("User registered successfully. Please check your email to verify your account.")
        } else {
            // Handle the unlikely case where user creation failed silently
            return res.status(500).json({ message: "Failed to create user"});
        }
    }
}


const loginUser = async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password) {
        return res.status(400).json({ message: "All fields are required"});
    }
    const user = await User.findOne({email});
    if(user) {
        const comparePassword = await bcrypt.compare(password, user.password);
        if(comparePassword) {
            if (!user.isVerified) {
                return res.status(401).json({ message: "Check email! Please verify your email before logging in." });
            }
            const accessToken = jwt.sign({
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                }
            }, 
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: "3d"}
            );
            return res.status(200).json({
                accessToken,
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    bio: user.bio,
                    profilePicture: user.profilePicture,
                    isPublicProfile: user.isPublicProfile,
                }
            })
        } else {
            return res.status(401).json({message: "Invalid credentials"})
        }
    } else {
        return res.status(401).json({message: "Invalid credentials"})
    }
}




const addToFavorites = async (req, res) => {
    try {
        const { adId } = req.params;
        const userId = req.user.user._id;

        // Check if user exists
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if ad exists
        const ad = await Product.findById(adId);  // Use findById for fetching by _id
        if (!ad) {
            return res.status(404).json({ message: "Ad not found" });
        }

        // Update user's favorites
        await User.findByIdAndUpdate(userId, { $addToSet: { favorites: adId } });
        return res.status(200).json({ message: "Ad added to favorites." });
    } catch (err) {
        console.error("Failed to add to favorites:", err);
        return res.status(500).json({ message: "Internal server error", err: err.message });
    }
};

const removeFromFavorites = async (req, res) => {
    try {
        const { adId } = req.params;
        const userId = req.user.user._id;

        // Check if user exists
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if ad exists
        const ad = await Product.findById(adId);
        if (!ad) {
            return res.status(404).json({ message: "Ad not found" });
        }

        // Update user's favorites by removing the ad
        await User.findByIdAndUpdate(userId, { $pull: { favorites: adId } });
        return res.status(200).json({ message: "Ad removed from favorites." });
    } catch (err) {
        console.error("Failed to remove from favorites:", err);
        return res.status(500).json({ message: "Internal server error", err: err.message });
    }
};


const getUserFavoriteAds = async (req, res) => {
    try {
        const userId = req.user.user._id;
        
        // Fetch the user with populated favorites
        const userWithFavorites = await User.findById(userId).populate('favorites');
        
        if (!userWithFavorites) {
            return res.status(404).json({ message: "User not found" });
        }

        if (userWithFavorites.favorites.length > 0) {
            return res.status(200).json(userWithFavorites.favorites);
        } else {
            return res.status(404).json({ message: "No favorites found" });
        }
    } catch (error) {
        console.error("Failed to get user's favorite ads:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};



module.exports = {loginUser, registerUser, addToFavorites, getUserFavoriteAds, removeFromFavorites};