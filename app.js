const shrinkRay = require('shrink-ray-current')
const express = require('express')
const hbs = require('express-handlebars')
const path = require('path')
const request = require('request')
const queryString = require('query-string');

const routeHandler = require('./server/routeHandler.js')

const app = express()
const port = 3000

require('dotenv').config()

// Disable x-powered-by header
app.disable('x-powered-by')

// Brotli compression
app.use(shrinkRay())

// serve static files
app.use(express.static(__dirname + '/public', {
  maxAge: "365d",
  lastModified: "",
  etag: ""
}))

// Handlebars
app.set('view engine', 'hbs')
app.engine('hbs', hbs({
  extname: 'hbs',
  defaultView: 'default',
  layoutsDir: __dirname + '/views/layouts/'
}))

// Homepage
app.get('/', (req, res) => {
  res.render('home', {
    layout: 'default',
    template: 'home-template',
  })
})

app.get('/login', (req, res) => {
  const scopes = 'user-read-private user-read-email'

  res.redirect(
    'https://accounts.spotify.com/authorize'
    + '?response_type=code'
    + '&client_id='
    + process.env.SPOTIFY_CLIENT_ID
    + (scopes ? '&scope=' + encodeURIComponent(scopes) : '')
    + '&redirect_uri='
    + encodeURIComponent(process.env.CLIENT_URL_CALLBACK)
  )
})

// Callback after login
app.get('/spotify', (req, res) => {
  const code = req.query.code || null
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
      const id = body.id

      const options = {
        url: 'https://api.spotify.com/v1/me',
        headers: { 'Authorization': `Bearer ${access_token}` },
        json: true
      }

      request.get(options, (error, response, body) => {
        console.log(body)
      })

      res.redirect('/?' +
        queryString.stringify({
          access_token: access_token,
          refresh_token: refresh_token,
          user_id: id
        }))

    }
  })

  res.render('spotify', {
    data: userData,
    layout: 'default',
    template: 'spotify-template',
  })
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

app.listen(port, () => console.log(`Spotify app listening on port ${port}!`))