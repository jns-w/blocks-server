const router = require('express').Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const User = require('../models/blocksuser.model')
const {verifyUser, AESdecrypt} = require("../lib/utils");
const {GenericHttpError, UnauthorizedError, ForbiddenError, NotFoundError, HttpError, BadRequestError} = require("../lib/errors");


const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ["GET", "POST", "PUT", "DELETE"],
    optionsSuccessStatus: 200
}

/**
 * @METHOD GET
 * @USE PING
 * @URL /api/blocks/projects/ping
 */

router.get('/ping', cors(corsOptions), async (req, res, next) => {
        try {
            const user = await verifyUser(req.headers.token)
            if (!user) throw new UnauthorizedError("Invalid credentials");
            return res.status(200).json({success: true})
        } catch (err) {
            next(err)
        }
    }
)


/**
 * @METHOD GET
 * @USE GET PROJECTS
 * @URL /api/blocks/projects
 */

router.get('/', cors(corsOptions), async (req, res, next) => {
    try {
        const user = await verifyUser(req.headers.token)
        if (!user) throw new UnauthorizedError("Invalid credentials");
        const {projects} = user
        if (!projects) throw new NotFoundError("No projects found")
        return res.status(200).json({success: true, data: {projects}})
    } catch (err) {
        next(err)
    }
})


/**
 * @METHOD POST
 * @USE NEW PROJECT
 * @URL /api/blocks/projects/new
 */

router.post('/new', cors(corsOptions), async (req, res, next) => {
    try {
        const user = await verifyUser(req.headers.token)
        if (!user) throw new UnauthorizedError("Invalid credentials");
        const {payload} = req.body
        const {project} = AESdecrypt(payload)
        if (!project) throw new BadRequestError("Invalid data")
        const {id, name} = project
        if (!id || !name) throw new BadRequestError("Invalid data")

        const update = await User.findByIdAndUpdate(user._id, {
            $addToSet: {
                projects: project
            }
        })

        if (update) {
            const updatedUser = await User.findById(user._id)
            const {projects} = updatedUser
            return res.status(200).json({success: true, data: {projects, projectAdded: project}})
        }

        throw new HttpError("Something went wrong", 400);

    } catch (err) {
        next(err)
    }
})

router.delete('/', cors(corsOptions), async (req, res, next) => {
    try {
        const user = await verifyUser(req.headers.token)
        if (!user) throw new UnauthorizedError("Invalid credentials");
        const {payload} = req.body
        const {project} = AESdecrypt(payload)
        const {id} = project
        if (!id) throw new BadRequestError("Invalid data")

        const update = await User.findByIdAndUpdate(user._id, {
            $pull: {
                projects: {id}
            }
        })

        if (update) {
            const updatedUser = await User.findById(user._id)
            const {projects} = updatedUser
            return res.status(200).json({success: true, data: {projects, projectRemoved: project}})
        }

        throw new GenericHttpError("Something went wrong")

    } catch (err) {
        next(err)
    }
})

module.exports = router