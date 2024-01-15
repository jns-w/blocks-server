const bcrypt = require('bcrypt');
const mongoose = require('mongoose')
const connection = require('../connection/blocks')

const {Schema} = mongoose

const userSchema = new Schema(
    {
        email: {type: String, unique: true, required: true, select: false},
        username: {type: String, unique: true, required: true},
        password: {type: String, required: true, select: false},
        isVerified: {type: Boolean, default: false, select: false},
        blockHistory: [{
            id: String,
            name: String,
            duration: Number,
            endTimestamp: Number,
            projectId: String,
            projectName: String,
            _id: false,
        }],
        projects: [{
            id: String,
            name: String,
            _id: false,
        }],
        appState: {
            isOn: {type: Boolean, default: false},
            currentBlock: String,
            currentProject: {
                id: String,
                name: String
            },
            duration: {type: Number, default: 0},
            targetDuration: {type: Number, default: 0},
            timeCheck: {
                startDuration: {type: Number, default: 0},
                startEpoch: {type: Number, default: 0},
            },
            // projects: [
            //     {id: String, name: String}
            // ],
            blockHistory: [
                {
                    id: String,
                    name: String,
                    duration: Number,
                    endTimestamp: Number,
                    projectId: String,
                    projectName: String,
                }
            ],
            userActionTimestamp: {type: Number, default: 0},
        },
    }
)

userSchema.pre('save', async function (next) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next()
})

userSchema.methods.verifyPassword = function (password) {
    try {
        return bcrypt.compareSync(password, this.password)
    } catch (err) {
        console.log(err)
        return false
    }
}

const BlocksUser = connection.model('User', userSchema)

module.exports = BlocksUser