const express = require('express')
const request = require('request')
const cors = require('cors')
const querystring = require('querystring')
const cookieParser = require('cookie-parser')
const SpotifyWebApi = require('spotify-web-api-node')

const app = express()
const port = 3000

const http = require('http').Server(app)
const io = require('socket.io')(http)

require('dotenv').config()

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;
const stateKey = 'spotify_auth_state'

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
})

let spotify_token = ''

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

        spotify_token = access_token

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
let queList = []

io.on('connection', (socket) => {

  spotifyApi.setAccessToken(spotify_token)

  // socket.emit('stream', queList)

  // spotifyApi.setAccessToken(access_token)

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
  const updateQueList = () => io.emit('add to que', queList)

  function removeByUsername(username) {
    var i = users.length;
    if (i) {
      while (--i) {
        var cur = users[i];
        if (cur.username == username) {
          users.splice(i, 1)
          updateUsers()
        }
      }
    }
  }

  function removeAfterPlaying(length) {
    setTimeout(function () {
      queList.shift()
      updateQueList()
    }, length * 31000)
  }

  socket.on('stream', (data) => {
    let playlist = data

    // if (ended == 'ended') {
    //   playlist.shift()
    //   queList.shift()
    //   updateQueList()
    // }
    io.emit('stream', playlist)

  })

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

  socket.on('searching', (data) => {
    spotifyApi.searchTracks(data)
      .then(function (data) {
        socket.emit('searching', data.body)
        socket.emit('clicked song', data.body)
      }, function (err) {
        console.error(err)
      })
  })

  socket.on('add to que', (data) => {
    queList.push({
      id: data.id,
      name: data.name,
      artist: data.artists[0].name,
      image: data.album.images[2].url,
      preview: data.preview_url
    })

    updateQueList()
    removeAfterPlaying(queList.length)
  })

  socket.on('disconnect', () => {
    if (!socket.username) return

    removeByUsername(socket.username)
  })
})

http.listen(port)
