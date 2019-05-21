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

let users = []

io.on('connection', (socket) => {
  // console.log(`A user connected with socket id ${socket.id}`)

  // Get array of connected clients
  // console.log(Object.keys(io.sockets.sockets))
  // Get User count
  // console.log(io.engine.clientsCount)

  socket.on('new user', (data) => {
    socket.username = data.username
    socket.image = data.image

    users.push({
      username: socket.username,
      image: socket.image
    })

    updateUsers()
  })

  const updateUsers = () => io.emit('users', users)

  function removeByUsername(arr, id) {
    var i = arr.length;
    if (i) {
      while (--i) {
        var cur = arr[i];
        if (cur.username == id) {
          console.log(cur.username)
          arr.splice(i, 1);
        }
      }
    }
  }


  socket.on('typing', (data) => {
    io.emit('typing', { username: socket.username })
  })

  socket.on('chat message', (data) => {
    let image

    for (let user of users) {
      if (user.username === socket.username) image = user.image
    }

    io.emit('chat message', {
      username: socket.username,
      image: image,
      message: data
    })
  })

  socket.on('disconnect', () => {
    if (!socket.username) return

    removeByUsername(users, socket.username);

    // users.splice(users.indexOf(socket.username), 1)
    updateUsers()

    console.log(users)

  })
})

http.listen(port)
