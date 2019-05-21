(function () {
  /**
   * Obtains parameters from the hash of the URL
   * @return Object
   */
  function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    while (e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  var userProfileSource = document.getElementById('user-profile-template').innerHTML
  var userProfileTemplate = Handlebars.compile(userProfileSource)
  var userProfilePlaceholder = document.getElementById('user-profile')
  var oauthSource = document.getElementById('oauth-template').innerHTML
  var oauthTemplate = Handlebars.compile(oauthSource)
  var oauthPlaceholder = document.getElementById('oauth')
  var params = getHashParams()
  var access_token = params.access_token
  var refresh_token = params.refresh_token
  var error = params.error;


  if (error) {
    alert('There was an error during the authentication');
  } else {
    if (access_token) {
      // render oauth info
      oauthPlaceholder.innerHTML = oauthTemplate({
        access_token: access_token,
        refresh_token: refresh_token
      })
      $.ajax({
        url: 'https://api.spotify.com/v1/me',
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        success: function (response) {
          // userProfilePlaceholder.innerHTML = userProfileTemplate(response);
          console.log(response)
          $('#login').hide();
          $('#loggedin').show();
        }
      })
    } else {
      $('#login').show();
      $('#loggedin').hide();
    }
  }
})();