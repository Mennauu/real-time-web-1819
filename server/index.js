const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Sockets.io
  io.on('connection', socket => {
    socket.broadcast.emit('user-connected', socket.id)
    console.log(`A user connected with socket id ${socket.id}`)

    socket.on('disconnect', () => {
      socket.broadcast.emit('user-disconnected', socket.id)
      console.log(`${socket.id} disconnected`)
    })

    socket.on('last-messages', (fn) => {
      fn(messages)
    })

    socket.on('send-message', (message) => {
      io.emit('new-message', message)
    })
  })

  // Listen the server
  http.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })

}
start()
