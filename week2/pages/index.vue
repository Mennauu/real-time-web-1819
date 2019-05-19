<template>
  <section class="container--center">
    <div>
      <h1 class="title">Play Spotify Together</h1>
      <p class="subtitle">
        Lets you
        <strong>play & listen</strong> to music in
        <strong>sync with friends</strong>
      </p>

      <a class="button button--spotify" href="/login">
        Log in with Spotify
        <img src="/spotify_icon.png" alt="Spotify Icon">
      </a>
      <small class="note">
        Note: you need a
        <a href="https://www.spotify.com/nl/premium/?checkout=false">premium account</a>
      </small>
    </div>
  </section>
</template>

<script>
</script>

<style lang="scss">
.container--center {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-image: linear-gradient(
    -225deg,
    #ffe29f 0%,
    #ffa99f 48%,
    #ff719a 100%
  );
}

.title {
  text-transform: uppercase;
  font-weight: 900;
  color: #fff;
}

.subtitle {
  margin-bottom: 2.5em;
  color: #fff;
  font-size: 1.4rem;
}

.button--spotify {
  background-color: #1db954;
  color: #fff;
  font-weight: bold;
  text-transform: uppercase;
  display: inline-block;
  margin: auto;

  &:hover {
    background-color: darken(#1db954, 5%);
  }
}

.note {
  display: block;
  margin-top: 1em;
  color: #fff;

  a {
    color: #fff;
  }
}
</style>
