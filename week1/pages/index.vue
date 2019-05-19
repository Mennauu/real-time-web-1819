:<template>
  <section>
    <div class="chatarea">
      <div class="formarea">
        <strong>Naam</strong>
        <input v-model="user" v-on:input="userChange(user)" placeholder="Wat is je naam?">
      </div>
      <div class="chatarea__container">
        <ul>
          <li v-for="(message, index) in messages" :key="index" class="message">
            <div class="messages__container">
              <img class="messages__image" :src="message.user" :alt="message.user">
              <p
                class="messages__text"
                :style="{ backgroundColor: `#${message.color}` }"
              >{{message.text}}</p>
              <small class="messages__date">{{message.date}}</small>
            </div>
          </li>
        </ul>
      </div>
      <div class="messagearea" ref="referencedElement" :class="{'visible' : user !== ''}">
        <strong>Bericht</strong>
        <textarea v-model="message" placeholder="Type een bericht"></textarea>
        <button @click="sendMessage">Send</button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      user: "",
      message: "",
      messages: []
    };
  },

  mounted() {
    this.$socket.on("new-message", message => {
      this.messages.push(message);
    });
  },

  methods: {
    userChange(user) {
      this.$refs.referencedElement.classList.add("visible");
    },
    hashCode(str) {
      var hash = 0;
      for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      return hash;
    },
    intToRGB(i) {
      var c = (i & 0x00ffffff).toString(16).toUpperCase();

      return "00000".substring(0, 6 - c.length) + c;
    },
    sendMessage() {
      if (this.message !== "") {
        this.$socket.emit("send-message", {
          date: new Date().toLocaleTimeString().slice(0, -3),
          user: `https://robohash.org/${this.user}`,
          text: this.message,
          color: (this.color = this.intToRGB(this.hashCode(this.user)))
        });
        this.message = "";
      }
    }
  }
};
</script>

<style>
.chatarea {
  max-width: 378px;
  width: 100%;
  margin: 1em auto;
}

.formarea {
  margin-bottom: 1em;
}

.messagearea {
  visibility: hidden;
}

.chatarea__container {
  background-color: #ece5dd;
  padding: 1em;
  border-radius: 5px;
}

.chatarea ul {
  list-style-type: none;
  padding: 0;
}

.messages__container {
  display: inline-flex;
  margin-bottom: 0.6em;
  position: relative;
}

.messages__image {
  width: 3em;
  height: 3em;
  max-width: 100%;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 0.6em;
}

.messages__user {
  margin-right: 0.6em;
  padding-top: 0.6em;
}

.messages__text {
  background-color: #dcf8c6;
  border-radius: 5px;
  padding: 0.6em;
  align-self: center;
  hyphens: auto;
  max-width: 260px;
  word-break: break-word;
}

.messages__date {
  position: absolute;
  background-color: #dcf8c6;
  right: -2.7em;
  bottom: 0.3em;
  border-radius: 5px;
  padding: 0.3em;
  color: gray;
}

strong {
  margin-top: 1em;
  display: block;
}
</style>
