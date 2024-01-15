const router = require('express').Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const User = require('../models/blocksuser.model')
const {verifyUser, AESdecrypt} = require("../../lib/utils");
const {NotFoundError, BadRequestError, GenericHttpError, UnauthorizedError} = require("../../lib/errors");

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
}

/**
 * @METHOD GET
 * @USE PING
 * @URL /api/blocks/history/ping
 */

router.get('/ping', cors(corsOptions), async (req, res, next) => {
        try {
            const user = await verifyUser(req.headers.token)
            if (!user) throw new UnauthorizedError("Invalid credentials")
            return res.status(200).json({success: true})
        } catch (err) {
            next(err)
        }
    }
)

/**
 * @METHOD GET
 * @USE GET ALL BLOCK HISTORY
 * @URL /api/blocks/history
 */

router.get('/', cors(corsOptions), async (req, res, next) => {
    try {
        const user = await verifyUser(req.headers.token)
        if (!user) throw new UnauthorizedError("Invalid credentials")
        const {blockHistory} = user
        if (!blockHistory) throw new NotFoundError("No block history found")
        return res.status(200).json({success: true, data: {blockHistory}})
    } catch (err) {
        next(err)
    }
})

/**
 * @METHOD POST
 * @USE ADD BLOCK
 * @URL /api/blocks/history/complete
 */

router.post('/complete', cors(corsOptions), async (req, res, next) => {
    try {
        const user = await verifyUser(req.headers.token)
        if (!user) throw new UnauthorizedError("Invalid credentials")
        const {payload} = req.body
        const {block} = AESdecrypt(payload)
        if (!block) throw new BadRequestError("Invalid data")

        const update = await User.findByIdAndUpdate(user._id, {
            $addToSet: {
                blockHistory: block
            }
        })

        if (!update) throw new BadRequestError("Something went wrong");

        const updatedUser = await User.findById(user._id)
        const {blockHistory} = updatedUser
        return res.status(200).json({success: true, data: {blockHistory}})

    } catch (err) {
        next(err)
    }
})


/**
 * @METHOD DELETE
 * @USE DELETE BLOCK
 * @URL /api/blocks/history/:id
 */

router.delete('/:id', cors(corsOptions), async (req, res, next) => {
    try {
        const user = await verifyUser(req.headers.token)
        if (!user) throw new UnauthorizedError("Invalid credentials")
        const {id} = req.params
        const update = await User.findByIdAndUpdate(user._id, {
            $pull: {
                blockHistory: {
                    id: id
                }
            }
        })
        if (!update) throw new BadRequestError("Something went wrong");
        const updatedUser = await User.findById(user._id)
        const {blockHistory} = updatedUser
        return res.status(200).json({success: true, data: {blockHistory}})
    } catch (err) {
        next(err)
    }
})

module.exports = router
