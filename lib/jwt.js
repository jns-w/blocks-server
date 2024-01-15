const jwt = require('jsonwebtoken')
require('dotenv').config()

async function validToken(token) {
  try {
    const verify = await jwt.verify(token, process.env.SECRET)
    return !!verify;
  } catch (err) {
    return null
  }
}


module.exports = {validToken}