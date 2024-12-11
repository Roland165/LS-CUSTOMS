<template>
  <div class="auth-module">
    <div class="container mt-5">
      <div class="auth-container">
        <div class="auth-tabs">
          <button
            :class="['tab-btn', { active: isLogin }]"
            @click="isLogin = true"
          >
            Login
          </button>
          <button
            :class="['tab-btn', { active: !isLogin }]"
            @click="isLogin = false"
          >
            Register
          </button>
        </div>
        <form v-if="isLogin" @submit.prevent="handleLogin" class="auth-form">
          <div class="form-group">
            <label>Username</label>
            <input
              type="text"
              v-model="loginForm.username"
              class="form-control"
              required
            >
          </div>

          <div class="form-group">
            <label>Password</label>
            <input
              type="password"
              v-model="loginForm.password"
              class="form-control"
              required
            >
          </div>

          <button type="submit" class="btn btn-primary">Login</button>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>
        </form>
        <form v-else @submit.prevent="handleRegister" class="auth-form">
          <div class="form-group">
            <label>Username</label>
            <input
              type="text"
              v-model="registerForm.username"
              class="form-control"
              required
            >
          </div>

          <div class="form-group">
            <label>Email</label>
            <input
              type="email"
              v-model="registerForm.email"
              class="form-control"
              required
            >
          </div>

          <div class="form-group">
            <label>Password</label>
            <input
              type="password"
              v-model="registerForm.password"
              class="form-control"
              required
            >
          </div>

          <div class="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              v-model="registerForm.confirmPassword"
              class="form-control"
              required
            >
          </div>

          <button type="submit" class="btn btn-primary">Register</button>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { sendRequest } from '../authfunctions';


export default {
  name: 'AuthModule',
  data() {
    return {
      isLogin: true,
      loginForm: {
        username: '',
        password: ''
      },
      registerForm: {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      error: null
    }
  },
  methods: {
    async handleLogin() {
      try {
        let response = await sendRequest('post', 'login',{
          username: String(this.loginForm.username),
          userpass: String(this.loginForm.password)
        });

        if (response.loginResult) {          
          sessionStorage.setItem("isLoggedInBool", true)
          sessionStorage.setItem("username",this.loginForm.username);

          let userRole = await sendRequest('get', 'protected');
          console.log("get protected response: "+userRole);
          
          sessionStorage.setItem("role",userRole);

          if (userRole === 'ADMIN') {
            this.$router.push('/admin');
            await location.reload()
          } else {
            this.$router.push('/');
            await location.reload()
          }
        } else {
          this.error = 'Invalid username or password';
        }
      } catch (error) {
        console.error('Login error:', error);
        this.error = 'Login failed';
      }
    },

    async handleRegister() {
      if (this.registerForm.password !== this.registerForm.confirmPassword) {
        this.error = 'Passwords do not match';
        return;
      }

      let response = await sendRequest('post', 'register',{
        username: String(this.registerForm.username),
        password: String(this.registerForm.password),
        email: String(this.registerForm.email)
      });

      this.registerForm = {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      };

      this.isLogin = true;
      alert('Registration successful! Please login.');
    }
  }
}
</script>

<style scoped>
.auth-module {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
  padding: 20px;
}

.auth-container {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.auth-tabs {
  display: flex;
  margin-bottom: 2rem;
  border-bottom: 2px solid #ddd;
}

.tab-btn {
  flex: 1;
  padding: 1rem;
  border: none;
  background: none;
  cursor: pointer;
  font-weight: bold;
  color: #666;
}

.tab-btn.active {
  color: #0077b6;
  border-bottom: 2px solid #0077b6;
  margin-bottom: -2px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #333;
  font-weight: 500;
}

.form-control {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.btn-primary {
  background-color: #0077b6;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #005f92;
}

.error-message {
  color: #dc3545;
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
}
</style>
