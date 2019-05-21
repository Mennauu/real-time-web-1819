const express = require('express')
const hbs = require('express-handlebars')
const path = require('path')
const request = require('request')
const queryString = require('query-string')

const app = express()
const port = 3000

const http = require('http').Server(app)
const io = require('socket.io')(http)

require('dotenv').config()

// Disable x-powered-by header
app.disable('x-powered-by')

// Brotli compression
// app.use(shrinkRay())

// serve static files
app.use(express.static(__dirname + '/public', {
  maxAge: "365d",
  lastModified: "",
  etag: ""
}))

// Handlebars
// app.set('view engine', 'hbs')
// app.engine('hbs', hbs({
//   extname: 'hbs',
//   defaultView: 'default',
//   layoutsDir: __dirname + '/views/layouts/'
// }))

// Homepage
app.get('/', (req, res) => {
  // res.render('home', {
  //   layout: 'default',
  //   template: 'home-template',
  // })
})



/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function (length) {
  var text = ''
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

var stateKey = 'spotify_auth_state'

app.get('/login', (req, res) => {
  var state = generateRandomString(16);
  res.cookie(stateKey, state)

  const scopes = 'user-read-private user-read-email'

  res.redirect(
    'https://accounts.spotify.com/authorize?' +
    queryString.stringify({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: scopes,
      redirect_uri: process.env.CLIENT_URL_CALLBACK,
      state: state
    })
  )
})

// Callback after login
app.get('/spotify', (req, res) => {
  const code = req.query.code || null
  const state = req.query.state || null
  const storedState = req.cookies ? req.cookies[stateKey] : null

  if (state === null || state !== storedState) {
    res.redirect('/#' + queryString.stringify({ error: 'state_mismatch' }))
  } else {
    res.clearCookie(stateKey)

    const auth = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.CLIENT_URL_CALLBACK
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')),
      },
      json: true
    }

    request.post(auth, (error, response, body) => {
      if (!error && response.statusCode === 200) {

        const access_token = body.access_token
        const refresh_token = body.refresh_token

        const options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': `Bearer ${access_token}` },
          json: true
        }

        request.get(options, (error, response, body) => {
          let clients = {}

          io.on('connection', (socket) => {
            clients[socket.id] = { name: body.display_name };

            // io.emit('connect', clients[socket.id].name)
            console.log(`A user connected with socket id ${clients[socket.id].name}`)

            // io.emit('user-connected', clients[socket.id].name)

            socket.on('disconnect', () => {
              socket.broadcast.emit('user-disconnected', socket.id)
              console.log(`${clients[socket.id].name} has disconnected`)
              delete clients[socket.id]
            })

            socket.on('chat message', (msg) => {
              io.emit('chat message', `${clients[socket.id].name + ': ' + msg}`)
              console.log('message: ' + msg)
            })
          })
        })

        res.redirect('/#' + queryString.stringify({ access_token: access_token, refresh_token: refresh_token }))

      } else {
        res.redirect('/#' + queryString.stringify({ error: 'invalid_token' }))
      }
    })
  }
})

// // Subject page
// app.get('/:genre', routeHandler.subjectPage)
// // Detail page
// app.get('/:genre/:isbn', routeHandler.detailPage)


app.get('/refresh_token', (req, res) => {

  const refresh_token = req.query.refresh_token

  const auth = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  }

  request.post(auth, function (err, res, body) {
    if (!err && res.statusCode === 200) {
      const access_token = body.access_token

      res.send({ 'access_token': access_token })
    }
  })
})

http.listen(port)
// app.listen(port, () => console.log(`Spotify app listening on port ${port}!`))