const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const User = require('../models/User');
const {jwt} = require("../config/keys");
const errorHandler = require("../utils/errorHandler");



module.exports.login = async function (req, res) {

    const EXP_TIME = 60 * 60 * 24 * 10;

    const candidate = await User.findOne({email: req.body.email});

    if(candidate){
        // check pass
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.password)

        const candidateUser = {
            userId: candidate._id,
            email: candidate.email,
            nickname: candidate.nickname,
            roles: candidate.roles,
        }

        if(passwordResult){
            //return token
            const token = JWT.sign({...candidateUser}, jwt, {expiresIn: EXP_TIME});
            res.status(200).json({
                token: `${token}`,
                user: candidateUser
            })
        }
        else{
            //return erorr
            res.status(401).json({
                message: "Bad password"
            })
        }


    }else{
        // return no users with this email
        res.status(404).json({
            message: "Bad email"
        })
    }

}

//8.2
module.exports.register = async function (req, res) {
    // email(unique or error)
    // password

    const EXP_TIME = 60 * 60 * 24 * 10;

    const candidate = await User.findOne({email: req.body.email});

    if(candidate){
        //user already has created return error
        res.status(409).json({
            message: 'This email already exists'
        });
    }else{
        //create new user
        //8.3
        const salt = bcrypt.genSaltSync(9);
        const password = req.body.password;
        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(password, salt),
            nickname: req.body.email,
            roles: ['user']
        });
        try{
            await user.save()

   		    res.status(201).json({
                message: 'User created'
            })
        }catch (e) {
            errorHandler(res, e)
        }
    }
}