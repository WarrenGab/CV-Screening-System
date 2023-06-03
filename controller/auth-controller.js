const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json({ message: "All filled must be required" });
    }

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
            {expiresIn: 3600},
            (err, token) => {
                if(err) throw err;
                console.log(token);
                res.json({
                    token: token,
                    user: user._id,
                    company: user.company
                });
            }
        )

    } catch (error) {
        console.log(error)
        res.status(500).json({msg: "Server Error"})
    }
}