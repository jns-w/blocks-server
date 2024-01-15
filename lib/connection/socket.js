const socket = require("socket.io")
const BLOCKSPREFIX = process.env.BLOCKSPREFIX
const BOREDPREFIX = process.env.BOREDPREFIX

let _io;

const setIO = (server) => {
  _io = socket(server, {
    cors: {
      origin: "*",
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    }
  })
  return _io
}

const getIO = () => {
  return _io
}

const setIOConnections = (io) => {
  io.on('connection', (client) => {
    // console.log('client', client, 'connected')

    client.on('ping', (data) => {
      console.log("ping")
      client.emit('ping (all)')
      client.broadcast.emit('ping (broadcast)')
    })

    client.on('subscribe', async function (data) {
      console.log('subbing', data)
      switch (data.app) {
        case BLOCKSPREFIX:
          client.join(`${BLOCKSPREFIX}-${data.user._id}`)
          console.log(`joined blocks id: ${data.user._id}`);
          break;
        case BOREDPREFIX:
          client.join(`${BOREDPREFIX}-${data.roomCode}`)
          console.log(`joined bored id: ${data.roomCode}`)
          break;
      }
    })

    client.on(BLOCKSPREFIX, (data) => {
      switch (data.action) {
        case 'timer-on':
          // client.broadcast will exclude sender in emit
          client.broadcast.to(`${BLOCKSPREFIX}-${data.user._id}`).emit('timer-on', {state: data.state})
          break;
        case 'timer-off':
          client.broadcast.to(`${BLOCKSPREFIX}-${data.user._id}`).emit('timer-off', {state: data.state})
          break;
        case 'state-change':
          client.broadcast.to(`${BLOCKSPREFIX}-${data.user._id}`).emit('state-change', {state: data.state})
      }
    })

    client.on(BOREDPREFIX, (data) => {
      switch (data.action) {
        case 'state-change':
          client.broadcast.to(`${BOREDPREFIX}-${data.roomCode}`).emit('state-change', {state: data.state})
      }
    })

    client.on('unsubscribe', async function (data) {
      switch (data.app) {
        case BLOCKSPREFIX:
          client.leave(`${BLOCKSPREFIX}-${data.user._id}`)
          break;
        case BOREDPREFIX:
          client.leave(`${BOREDPREFIX}-${data.roomCode}`)
      }
    })
    client.on('disconnect', (client) => {
    })
  })
}

module.exports = {
  getIO,
  setIO,
  setIOConnections
}