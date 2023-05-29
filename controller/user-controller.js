const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');
const Company = require('../models/Company');

exports.createUser = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        let ar = errors.array();
        return res.status(400).json({msg: ar[0].msg});
    };

    const { name, email, password, phone, companyId } = req.body;

    try {
        // See if User already exists
        let user = await User.findOne({
            email: { $regex: new RegExp(email, 'i') }
        });

        if(user){
            return res.status(400).json({msg: "User already exist"})
        }

        // See if Company exists
        let company = await Company.findById(companyId);

        if (!company) {
            res.status(404).json({ msg: 'Company not found' })
        }

        user = new User({
            name,
            email,
            password,
            phone,
            companyId
        });

        // Encrypt Password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save to Database
        await user.save();
        console.log(user);
        
        // Return JSON Web Token
        const payload = {
            user: {
                id: user._id
            }
        };
        jwt.sign(
            payload,
            config.get('jwtSecret'),
            {expiresIn: 360000},
            (err, token) => {
                if(err) throw err;
                res.json({token});
            }
        );
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Server Error"});
    }
}

exports.getUser = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        let ar = errors.array();
        return res.status(400).json({msg: ar[0].msg});
    };

    const { id } = req.body;

    try {
        let user = await User.findById(id);

        if (!user) {
            return res.status(404).json({msg: "User does not exist"});
        }
        
        res.status(200).json(user);

    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Server Error"});
    }
}

exports.editUser = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        let ar = errors.array();
        return res.status(400).json({msg: ar[0].msg});
    };

    const { id, name, email, phone } = req.body;
    const editValue = { name, email, phone };

    try {
        const user = await User.findById(id);

        if (!user) {
            res.status(404).json({ msg: 'User not found' })
        }

        let userEmail = await User.findOne({
            email: { $regex: new RegExp(email, 'i') }
        });

        if(user.email != email){
            if (userEmail) {
                return res.status(400).json({msg: "Email already exist"})
            }
        }

        await User.findByIdAndUpdate(id, editValue);
        
        res.status(200).json('User updated successfully');
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Server Error"});
    }
}

exports.changePassword = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        let ar = errors.array();
        return res.status(400).json({msg: ar[0].msg});
    };

    const { id, password } = req.body;

    try {
        const user = await User.findById(id);

        if (!user) {
            res.status(404).json({ msg: 'User not found' })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.findByIdAndUpdate(id, {
            $set: { password: hashedPassword }
        });

        res.status(200).json("Password updated successfully");

    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Server Error"});
    }
}

exports.deleteUser = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        let ar = errors.array();
        return res.status(400).json({msg: ar[0].msg});
    };

    const { id } = req.body;

    try {
        const user = await User.findById(id);

        if (!user) {
            res.status(404).json({ msg: 'User not found' })
        }

        await user.delete();

        res.status(200).json('User deleted successfully');
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Server Error"});
    }
}