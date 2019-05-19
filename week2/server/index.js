const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()

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

  // app.use(express.json())

  // app.get('/login', function (req, res) {
  //   var scopes = 'user-read-private user-read-email';
  //   res.redirect('https://accounts.spotify.com/authorize' +
  //     '?response_type=code' +
  //     '&client_id=' + process.env.SPOTIFY_CLIENT_ID, +
  //     (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
  //     '&redirect_uri=' + encodeURIComponent(process.env.CLIENT_URL));
  // });

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
