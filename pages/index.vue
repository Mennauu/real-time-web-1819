:<template>
  <section>
    <div class="chatArea">
      <ul>
        <li v-for="(message, index) in messages" :key="index" class="message">{{message}}</li>
      </ul>
    </div>
    <textarea v-model="message" placeholder="Message"></textarea>
    <button @click="sendMessage">Send</button>
  </section>
</template>

<script>
export default {
  asyncData() {
    return {
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
    sendMessage() {
      if (this.message !== "") {
        this.$socket.emit("send-message", this.message);
        this.message = "";
      }
    }
  }
};
</script>

<style>
</style>
