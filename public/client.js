(function () {

  const getHashParams = () => {
    let hashParams = {}
    let e, r = /([^&;=]+)=?([^&;]*)/g
    const q = window.location.hash.substring(1)

    while (e = r.exec(q)) hashParams[e[1]] = decodeURIComponent(e[2])

    return hashParams
  }

  const advance = (duration, element) => {
    var progress = document.getElementById("progress");
    increment = 10 / duration
    percent = Math.min(increment * element.currentTime * 10, 100);
    progress.style.width = percent + '%'
    startTimer(duration, element);
  }

  const startTimer = (duration, element) => {
    if (percent < 100) {
      timer = setTimeout(function () { advance(duration, element) }, 100);
    }
  }

  const userProfileSource = document.getElementById('user-profile-template').innerHTML
  const userProfileTemplate = Handlebars.compile(userProfileSource)
  const userProfilePlaceholder = document.getElementById('user-profile')
  const oauthSource = document.getElementById('oauth-template').innerHTML
  const oauthTemplate = Handlebars.compile(oauthSource)
  const oauthPlaceholder = document.getElementById('oauth')
  const audioPlayer = document.getElementById('audioPlayer');
  const params = getHashParams();
  const access_token = params.access_token
  const refresh_token = params.refresh_token
  const error = params.error

  if (error) {
    alert('There was an error during the authentication');
  } else {
    if (access_token) {
      // render oauth info
      oauthPlaceholder.innerHTML = oauthTemplate({
        access_token: access_token,
        refresh_token: refresh_token
      });

      $.ajax({
        url: 'https://api.spotify.com/v1/me',
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        success: function (response) {
          userProfilePlaceholder.innerHTML = userProfileTemplate(response)

          $('#login').hide()
          $('#loggedin').show()

          $(function () {
            var socket = io()

            socket.on('connect', () => {

              socket.emit('new user', {
                username: response.display_name,
                image: response.images[0].url
              })

              $("#que:empty").addClass('loading')

            })

            socket.on('stream', (data) => {

              $("#que").removeClass('loading')

              if (data.length) {

                if (audioPlayer.currentTime == 0) {
                  if (data[0].preview) {

                    audioPlayer.src = data[0].preview
                    const promise = audioPlayer.play()

                    $(audioPlayer).on("loadedmetadata", function () {
                      var duration = audioPlayer.duration
                      advance(duration, audioPlayer)

                      $('div.progress').addClass('visible')
                    })

                    if (promise !== undefined) {

                      promise.then(_ => {
                        // Autoplay started!
                      }).catch(error => {
                        // console.log(error)
                      })
                    }

                  }

                  audioPlayer.onended = function () {
                    audioPlayer.currentTime = 0

                    if (data.length > 0) {
                      socket.emit('remove from que', data[0].name)
                    }
                  }
                }
              }
            })

            socket.on('users', (data) => {
              // https://stackoverflow.com/a/55614231 : Remove duplicates from an array of objects
              let cleanData = [...new Map(data.map(obj => [JSON.stringify(obj), obj])).values()]
              let users = ''
              // let message = ''

              for (let user of cleanData) {
                users += `<div class='user'><img src='${user.image}' alt='${user.username}' class="user-profile--avatar"><span class="user-profile--name">${user.username}</span></div>`
                // message =
                //   `<li class="message">
                //      <img src="${user.image}" alt="${user.username}" class="message--image">
                //      <span class="message--text--join">${user.username} joined the room</span>
                //    </li>`
              }


              // $('#messages').append(message)

              $('#user-profile').html(users)
            })

            $('#sendMessage').submit((e) => {
              e.preventDefault()
              socket.emit('chat message', $('#m').val())
              $('#m').val('')
              return false
            })

            $('#searchSongs').submit((e) => {
              e.preventDefault()
              socket.emit('searching', $('#numberSearch').val())
              $('#numberSearch').val('')
              return false
            })

            $('#m').bind('keypress', () => socket.emit('typing'))

            socket.on('searching', (data) => {
              let result = ''

              for (let song of data.tracks.items) {
                if (song.preview_url != null) {
                  result += `
                    <li class="song" id="${song.id}">
                      <img src="${song.album.images[2].url}" alt="${song.name}">
                        <div>
                          <span>${song.name}</span>
                          <small>${song.artists[0].name}</small>
                        </div>
                    </li>`
                }
              }

              $('#songs').html(result)
            })

            socket.on('clicked song', (data) => {
              let result = ''

              for (let song of data.tracks.items) {

                $(`#${song.id}`).click(() => {
                  if (song.id === song.id) {
                    socket.emit('add to que', song)
                  }
                })

              }
            })

            socket.on('add to que', (data) => {
              let cleanData = [...new Map(data.map(obj => [JSON.stringify(obj), obj])).values()]
              let queList = ''

              for (let song of cleanData) {
                queList += `
                <li class="song" id="${song.id}">
                  <img src="${song.image}" alt="${song.name}">
                    <div>
                      <span>${song.name}</span>
                      <small>${song.artist}</small>
                    </div>
                </li>`
              }

              socket.emit('stream', cleanData)

              $('#que').html(queList)
            })

            socket.on('typing', (data) => {
              $('div.feedback').html(`<small class='typing'>${data.username} is typing</small>`)
            })

            socket.on('chat message', (data) => {
              $('div.feedback').html('')

              if (data.message !== '') {
                let message =
                  `<li class="message">
                     <img src="${data.image}" alt="${data.username}" class="message--image">
                     <span class="message--text">${data.message}</span>
                   </li>`
                $('#messages').append(message)
              }

              $("div.chatbox").animate({ scrollTop: $('div.chatbox').prop("scrollHeight") }, 50)
            })

            // socket.on('user joined', (data) => {
            //   $('#messages').append($('<li>').addClass(data.id).text(`${data.username} joined the app`));
            //   console.log(data.usercount)
            // })

            // socket.on('user left', (data) => {
            //   $('#messages').append($('<li>').addClass(data.id).text(`${data.username} left the app`));
            // })
          })
        }
      })
    } else {
      // render initial screen
      $('#login').show()
      $('#loggedin').hide()
    }

    // document.getElementById('obtain-new-token').addEventListener('click', function () {
    //   $.ajax({
    //     url: '/refresh_token',
    //     data: {
    //       'refresh_token': refresh_token
    //     }
    //   }).done(function (data) {
    //     access_token = data.access_token;
    //     oauthPlaceholder.innerHTML = oauthTemplate({
    //       access_token: access_token,
    //       refresh_token: refresh_token
    //     });
    //   });
    // }, false);
  }
})()