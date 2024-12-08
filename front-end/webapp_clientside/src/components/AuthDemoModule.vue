<template>
  <div class="hello">
    <h1>Authentication demo</h1>
    <p>{{ msg }}</p>
    <input type="button" @click="sendRequest('post', 'login', { username: 'joeuser', userpass: 'joeXXX' })" value="LOGIN BAD" />
    <input type="button" @click="sendRequest('post', 'login', { username: 'user', userpass: 'user' })" value="LOGIN USER" />
    <input type="button" @click="sendRequest('post', 'login', { username: 'admin', userpass: 'admin' })" value="LOGIN ADMIN" />
    <input type="button" @click="sendRequest('get', 'user')" value="ACCESS /user" />
    <input type="button" @click="sendRequest('get', 'admin')" value="ACCESS /admin" />
    <input type="button" @click="sendRequest('get', 'protected')" value="ACCESS /protected" />
    <input type="button" @click="sendRequest('get', 'logout')" value="LOGOUT" />
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AuthenticationDemo',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    async sendRequest(method, endpoint, params) {
      try {
        let response = null;
        if (method === "post") {
          response = await axios.post("http://localhost:9000/auth/"+endpoint, params);
        }
        else
          response = await axios.get("http://localhost:9000/auth/"+endpoint);
        this.msg = JSON.stringify(response.data);
      } catch (error) {
        console.log(error);
      }
    }
  },

}
</script>

<style scoped>
.hello {
  margin-top: 200px;
}
</style>
