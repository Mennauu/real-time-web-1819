<template>
  <nuxt/>
</template>

<style lang="scss">
html {
  font-family: "Nunito Sans", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 18px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

h1 {
  font-size: 3em;
}

h2 {
  font-size: 2em;
}

p {
  margin-bottom: 1em;
}

.button {
  outline: 0;
  border: 0;
  padding: 0.8em 4.8em 0.8em 2.4em;
  border-radius: 5px;
  font-size: 1em;
  position: relative;
  cursor: pointer;
  transition: 0.4s;
  text-decoration: none;

  img {
    max-height: 1em;
    margin-left: 0.35em;
    font-size: 1.3em;
    position: absolute;
    right: 2em;
    top: 0.55em;
  }
}
</style>
