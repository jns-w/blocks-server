const mongoose = require('mongoose').default;
require('dotenv').config();

const URI = process.env.BLOCKSDB || 'mongodb://localhost:27017/blocks'

const conn = mongoose.createConnection(URI, {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
    if (err) {
      console.log('error occurred')
      console.log("reason: " + err)
    } else {
      console.log(`Conn established to ${process.env.BLOCKSPREFIX}DB`)
    }
  })

module.exports = conn;
