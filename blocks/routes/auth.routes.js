const router = require('express').Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const User = require('../models/blocksuser.model')
const {AESdecrypt, verifyUser} = require("../../lib/utils");
const {UnauthorizedError, BadRequestError} = require("../../lib/errors");


/**
 * @METHOD GET
 * @USE TEST
 * @URL /api/blocks/auth
 */

router.get('/', cors(), async (req, res, next) => {
    try {
        console.log('here')
        return res.status(200).json({success: true, msg: "This is blocks auth"})
    } catch (err) {
        return res.status(400).json("error")
    }
})

/**
 * @METHOD GET
 * @USE CHECK USER INFO
 * @URL /api/blocks/auth/checkuser
 */

router.get('/checkuser', cors(), async (req, res, next) => {
    try {
        let {token} = req.headers
        const decoded = await jwt.verify(token, process.env.SECRET)
        const user = await User.findById(decoded.userId).select('_id username')
        if (!user) throw new UnauthorizedError("Invalid credentials");
        const data = {
            _id: user._id,
            username: user.username
        }
        return res.status(200).json({success: true, data})
    } catch (err) {
        next(err)
    }
})


/**
 * @METHOD GET
 * @USE CHECK USERNAME AVAILABILITY
 * @URL /api/blocks/auth/nameavail
 */

router.get('/nameavail', cors(), async (req, res, next) => {
    try {
        const {username} = req.headers
        const check = await User.exists({username: username})
        if (check) return res.status(200).json({success: true, avail: false});
        else return res.status(200).json({success: true, avail: true});
    } catch (err) {
        console.log(err)
        return res.status(400)
    }
})

/**
 * @METHOD PUT
 * @USE SIGN UP
 * @URL /api/blocks/auth/signup
 */

router.put('/signup', async (req, res, next) => {
    try {
        const {payload} = req.body
        const {username, email, password} = AESdecrypt(payload)
        console.log({username, email, password})
        let newUser = new User({
            username, email, password
        })
        const user = await newUser.save()
        const token = await jwt.sign({userId: user._id}, process.env.SECRET)
        return res.status(200).json({success: true, data: {token}})
    } catch (err) {
        // catch duplicate key error
        if (err.code === 11000) {
            console.log(err)
            if (err.keyPattern.email) return res.status(403).json({msg: 'email taken'});
            if (err.keyPattern.username) return res.status(403).json({msg: 'username taken'});
        }
        next(err)
    }
})

/**
 * @METHOD POST
 * @USE SIGN IN
 * @URL /api/blocks/auth/signin
 */

router.post('/signin', cors(), async (req, res, next) => {
    try {
        const {ciphertext} = req.body
        const {email, password} = AESdecrypt(ciphertext)
        if (!email || !password) throw new BadRequestError("Invalid data")
        const user = await User.findOne({email: email.toLowerCase()}).select('_id password')
        if (!user) throw new UnauthorizedError("No access")
        const verified = user.verifyPassword(password)
        if (!verified) throw new UnauthorizedError("Invalid credentials")
        const token = await jwt.sign({userId: user._id}, process.env.SECRET)
        return res.status(200).json({success: true, data: {token}})
    } catch (err) {
        next(err)
    }
})

module.exports = router
