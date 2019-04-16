import Vue from 'vue';
import io from 'socket.io-client';
import VueSocketIO from 'vue-socket.io-extended';

export default ({ store }) => {
  const port = process.env.PORT || 3000
  Vue.use(VueSocketIO, io(`http://localhost:${port}`), { store });
}