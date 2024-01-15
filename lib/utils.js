const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')
const BlocksUser = require('../models/blocksuser.model')


function milSinceEpoch(date) {
    return (date).valueOf().toString()
}

function serverEncrypt(message) {
    try {
        return CryptoJS.AES.encrypt(message, process.env.SECRET).toString()
    } catch (err) {
        return null
    }
}

function serverDecrypt(ciphertext) {
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, process.env.SECRET).toString()
        const decrypted = Buffer.from(bytes, 'hex')
        return JSON.parse(JSON.stringify(decrypted))
    } catch (err) {
        return null
    }
}

function AESdecrypt(ciphertext) {
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, process.env.SECRET).toString()
        const decrypted = Buffer.from(bytes, 'hex')
        return JSON.parse(decrypted.toString())
    } catch (err) {
        return null
    }
}

async function verifyUser(token) {
    try {
        const decoded = await jwt.verify(token, process.env.SECRET)
        if (!decoded) {
            return false
        } else {
            const user = BlocksUser.findById(decoded.userId)
            if (!user) throw Error("No such user");
            return user;
        }
    } catch (err) {
        console.log(err)
        return null
    }
}

const wait = ms => new Promise(
    (resolve, reject) => setTimeout(resolve, ms)
);


module.exports = {milSinceEpoch, AESdecrypt, serverEncrypt, serverDecrypt, verifyUser, wait}