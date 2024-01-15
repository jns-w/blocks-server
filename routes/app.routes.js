const router = require('express').Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const User = require('../models/blocksuser.model')
const {verifyUser, AESdecrypt} = require("../lib/utils");
const {UnauthorizedError, BadRequestError} = require("../lib/errors");

const app = process.env.BLOCKSPREFIX

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}


/**
 * @METHOD GET
 * @USE PING
 * @URL /api/blocks/app/ping
 */

router.get('/ping', cors(corsOptions), async (req, res, next) => {
    try {
        return res.status(200).json({success: true})
    } catch (err) {
        next(err)
    }
})


/**
 * @METHOD GET
 * @USE RETRIEVE USER APP STATE
 * @URL /api/blocks/app
 */

router.get('/', cors(corsOptions), async (req, res, next) => {
    try {
        console.log("here")
        const user = await verifyUser(req.headers.token)
        if (!user) throw new UnauthorizedError("Invalid credentials");
        const data = user.appState
        return res.status(200).json({success: true, data})
    } catch (err) {
        next(err)
    }
})

/**
 * @METHOD PUT
 * @USE UPDATE USER APP STATE
 * @URL /api/blocks/app
 */

router.put('/', cors(corsOptions), async (req, res, next) => {
    try {
        console.log('here')
        const {payload} = req.body
        const {state} = AESdecrypt(payload)
        console.log(state)
        let user = await verifyUser(req.headers.token)
        if (!user) throw new UnauthorizedError("Invalid credentials");
        // No update when incoming state is earlier
        if (user.appState.userActionTimestamp > state.userActionTimestamp) {
            console.log("state is outdated")
            return res.status(200).json({success: false, message: "state is outdated"})
        }
        const update = await User.findByIdAndUpdate(user._id, {
            $set: {
                'appState': {
                    'isOn': state.isOn,
                    'duration': state.duration,
                    'targetDuration': state.targetDuration,
                    'userActionTimestamp': state.userActionTimestamp,
                    'currentBlock': state.currentBlock,
                    'currentProject': state.currentProject,
                    'timeCheck': {
                        'startDuration': state.timeCheck.startDuration,
                        'startEpoch': state.timeCheck.startEpoch
                    },
                    // 'projects': state.projects,
                    // 'blockHistory': state.blockHistory
                },
            }
        })
        if (!update) throw new BadRequestError("Update failed");
        return res.status(200).json({success: true, update})
    } catch (err) {
        next(err)
    }
})




module.exports = router