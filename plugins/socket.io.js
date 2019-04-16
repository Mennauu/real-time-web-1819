import Vue from 'vue';
import io from 'socket.io-client';
import VueSocketIO from 'vue-socket.io-extended';

let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')
const { host, port } = nuxt.options.server


export default ({ store }) => {
  Vue.use(VueSocketIO, io(`http://${host}:${port}`), { store });
}