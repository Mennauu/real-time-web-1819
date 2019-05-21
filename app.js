const express = require('express')
const request = require('request')
const cors = require('cors')
const querystring = require('querystring')
const cookieParser = require('cookie-parser')

const app = express()
const port = 3000

const http = require('http').Server(app)
const io = require('socket.io')(http)

require('dotenv').config()

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;
const stateKey = 'spotify_auth_state'

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = (length) => {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return text
}

app.use(express.static(__dirname + '/public'))
  .use(cors())
  .use(cookieParser())

app.get('/login', function (req, res) {
  const state = generateRandomString(16)
  const scope = 'user-read-private user-read-email'

  res.cookie(stateKey, state)

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }))
})

app.get('/spotify', function (req, res) {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' + querystring.stringify({ error: 'state_mismatch' }))
  } else {
    res.clearCookie(stateKey)

    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    }

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        const access_token = body.access_token
        const refresh_token = body.refresh_token

        const options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        }

        // use the access token to access the Spotify Web API
        // request.get(options, function (error, response, body) {
        //   console.log(body)
        // })

        res.redirect('/#' + querystring.stringify({ access_token: access_token, refresh_token: refresh_token }))
      } else {
        res.redirect('/#' + querystring.stringify({ error: 'invalid_token' }))
      }
    })
  }
})

app.get('/refresh_token', function (req, res) {
  const refresh_token = req.query.refresh_token

  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  }

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token

      res.send({ 'access_token': access_token })
    }
  })
})

// let clients = {}
// let clientList = []

let users = []

io.on('connection', (socket) => {
  // console.log(`A user connected with socket id ${socket.id}`)

  // Get array of connected clients
  // console.log(Object.keys(io.sockets.sockets))
  // Get User count
  // console.log(io.engine.clientsCount)

  // io.emit('set list', {
  //   username: socket.username,
  // })


  socket.on('new user', (data) => {
    socket.username = data
    users.push(socket.username)
    // clients[socket.username] = socket

    // const keys = Object.keys(clients)

    // io.emit('user joined', {
    //   username: data.username,
    //   usercount: io.engine.clientsCount,
    //   id: socket.id
    // })

    // keys.forEach(element => {
    //   if (clientList.includes(element) === false) {
    //     clientList.push(element)
    //   }
    // })

    // clientList.forEach(user => {
    //   io.emit('set list', {
    //     username: user
    //   })
    // })

    // console.log(clientList)

  })

  socket.on('typing', (data) => {
    io.emit('typing', { username: socket.username })
  })

  socket.on('chat message', (data) => {
    io.emit('chat message', {
      username: socket.username,
      message: data
    })
  })

  socket.on('disconnect', () => {

    io.emit('user left', {
      username: socket.username,
      id: socket.id
    })

    delete clients[socket.username]

    clientList.forEach(element => {
      if (element == socket.username) {
        clientList.splice(element, 1)
      }
    })

  })
})

http.listen(port)
