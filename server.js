const express = require('express')
const app = express()
const server = require('http').createServer(app)
require('dotenv').config()
require('./blocks/connection/blocks')
const cors = require('cors')
const {setIO, setIOConnections} = require("./lib/connection/socket");
const { rateLimit } = require('express-rate-limit')
const HttpErrorHandler = require("./lib/errorHandlers");

// const io = require('socket.io')(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"]
//   }
// })

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 500, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

const io = setIO(server)
setIOConnections(io)

const corsOptions = {
  origins: ["http://localhost:3000"],
  methods: ["GET", "POST", "PUT"],
  optionsSuccessStatus: 200
}

app.use(limiter)
app.options('*', cors(corsOptions))
app.use(express.json())

// BLOCKS APP ROUTES
app.use('/api/blocks/auth', require('./blocks/routes/auth.routes'))
app.use('/api/blocks/app', require('./blocks/routes/app.routes'))
app.use('/api/blocks/projects', require('./blocks/routes/projects.routes'))
app.use('/api/blocks/history', require('./blocks/routes/history.routes'))

app.use(HttpErrorHandler)


server.listen(process.env.PORT, () => {
  console.log(`Running server on port ${process.env.PORT}`)
})
