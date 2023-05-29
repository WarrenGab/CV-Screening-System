const express = require('express');
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../../models/User');

const router = express.Router();

// Login User
router.post('/', [
    check('email', 'Please provide a valid email').isEmail(),
    check('password', 'Password is required').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        let ar = errors.array();
        return res.status(400).json({msg: ar[0].msg});
    }

    const { email, password } = req.body;

    try {
        // See if user exist already
        let user = await User.findOne({
            email: { $regex: new RegExp(email, 'i') }
        });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentails!' });
        }

        // Match Password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ msg: 'Invalid Credentails!' });
        }

        // If valid, then return JWT
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
        )

    } catch (error) {
        console.log(error)
        res.status(500).json({msg: "Server Error"})
    }
})

module.exports = router;