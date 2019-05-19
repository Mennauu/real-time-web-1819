const request = require('request')
const queryString = require('query-string');

exports.homePage = async (req, res) => {
  try {
    res.render('home', {
      layout: 'default',
      template: 'home-template',
    })
  } catch (err) {
    throw err
  }
}

exports.spotifyPage = (req, res) => {
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

  let userData = []

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
        res.redirect('/?' +
          queryString.stringify({
            access_token: access_token,
            refresh_token: refresh_token,
            user_id: id
          }))
      })

    }
  })

  setTimeout(() => {
    res.render('spotify', {
      data: userData,
      layout: 'default',
      template: 'spotify-template',
    },
      console.log(userData))
  }, 1000);
}