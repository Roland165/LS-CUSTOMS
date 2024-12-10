<template>
  <div id="app">
    <nav class="nav-bar">
      <div class="container">
        <div class="nav-content">
          <router-link to="/" class="nav_bar_button">Home</router-link>
          <router-link to="/purchase/list/all" class="nav_bar_button purchase-button">Purchase</router-link>
          <router-link to="/" class="logo-container">
            <img src="../src/medias/LS-CUSTOMS_logo.png" alt="Logo" class="logo" @click="$router.push('/')">
          </router-link>
          <router-link to="/checkout/all" class="nav_bar_button checkout-button">Checkout</router-link>
          <router-link to="/orders/list/all" class="nav_bar_button">Orders</router-link>
        </div>
        <div
          class="account-dropdown"
          @mouseenter="dropdownOpen = Boolean(isLoggedIn)"
          @mouseleave="dropdownOpen = false"
        >
          <router-link
            :to="isLoggedIn ? '#' : '/auth'"
            class="account-link"
          >
            <button class="cssbuttons-io-button account-button" @click="goToAuthPage">
              {{ accountButtonText }}
              <div class="icon">
                <svg
                  height="24"
                  width="24"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M0 0h24v24H0z" fill="none"></path>
                  <path
                    d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
            </button>
          </router-link>
          <div v-if="(dropdownOpen && isLoggedIn)" class="dropdown-menu">
            <div
              v-if="role === 'ADMIN'"
              class="dropdown-item"
              @click="goToAdmin"
            >
              Admin Dashboard
            </div>
            <div class="dropdown-item" @click="logout">
              Logout
            </div>
          </div>
        </div>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script>
import { logoutUser } from './authfunctions';


export default {
  name: 'App',
  data() {
    return {
      dropdownOpen: false,
      username: null,
      role: null,
      isLoggedIn: false,
    }
  },
  computed: {
    accountButtonText() {
      if(this.username != "null"){
        return this.username
      }else{
        return "Account"
      }
    },
    isAdmin() {
      return this.role === 'ADMIN';
    }
  },
  methods: {
    goToAdmin() {
      if (this.isAdmin) {
        this.$router.push('/admin');
        this.dropdownOpen = false;
      }
    },
    async logout() {
      if(await logoutUser()){
        
        sessionStorage.setItem("isLoggedInBool", false);
        this.isLoggedIn = false;
        sessionStorage.setItem("username",null);
        sessionStorage.setItem("role",null);
        
        //this.currentUser = null;
        this.$router.push('/auth');
        this.dropdownOpen = false;
      }else{
        alert("Error during logout");
      }
    },
    checkLoginStatus() {
    if(sessionStorage.getItem("isLoggedInBool") == null){
      sessionStorage.setItem("isLoggedInBool", false);
      this.accountText = "Account";
      console.log("RESET SESSIONSTORAGE isLoggedIn TO false");
    }
    this.isLoggedIn = sessionStorage.getItem("isLoggedInBool");
    this.username = sessionStorage.getItem("username");
    this.role = sessionStorage.getItem("role");
    
    console.log("sessionStorage isLoggedInBool: "+sessionStorage.getItem("isLoggedInBool"));
    console.log("local isLoggedInBool: "+this.isLoggedIn);
    },
    goToAuthPage() {
        this.$router.push('/auth');
        this.dropdownOpen = false;
    },
  },
  created() {
    this.checkLoginStatus();
    window.addEventListener('storage', this.checkLoginStatus);
  },
  beforeDestroy() {
    window.removeEventListener('storage', this.checkLoginStatus);
  },
};
</script>

<style>
body {
  font-family: 'Montserrat', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #EEEFF2;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.nav-bar {
  background-color: rgba(51, 51, 51, 0.4);
  padding: 0px;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1000;
  transition: background-color 0.3s ease;
}

.nav-bar .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.nav-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

}

.nav-bar .nav_bar_button {
  color: #fff;
  text-decoration: none;
  margin: 0 20px;
  font-weight: bold;
  font-size: 1.2em;
  padding: 10px 20px;
  border-radius: 80px;
  border: #0077b6 solid 3px;
  transition: background-color 0.3s ease;
}

.purchase-button {
  margin-right: 80px !important;
}

.checkout-button {
  margin-left: 140px !important;
}

.nav-bar .nav_bar_button:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.logo-container {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.logo {
  height: 60px;
  width: auto;
  max-width: 100%;
}

.account-button {
  background: #0077b6;
  color: white;
  font-family: inherit;
  padding: 0.35em;
  padding-left: 1.2em;
  font-size: 17px;
  font-weight: 500;
  border-radius: 0.9em;
  border: none;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  box-shadow: inset 0 0 1.6em -0.6em #0077b6;
  overflow: hidden;
  position: absolute;
  right: -5%;
  top: 22%;
  height: 2.8em;
  padding-right: 3.3em;
  cursor: pointer;
}

.cssbuttons-io-button .icon {
  background: white;
  margin-left: 1em;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.2em;
  width: 2.2em;
  border-radius: 0.7em;
  box-shadow: 0.1em 0.1em 0.6em 0.2em #0077;
  right: 0.3em;
  transition: all 0.3s;
}

.cssbuttons-io-button:hover .icon {
  width: calc(100% - 0.6em);
}

.cssbuttons-io-button .icon svg {
  width: 1.1em;
  transition: transform 0.3s;
  color: #0077;
}

.cssbuttons-io-button:hover .icon svg {
  transform: translateX(0.1em);
}

.cssbuttons-io-button:active .icon {
  transform: scale(0.95);
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 40px);
  background: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  z-index: 1000;
  min-width: 200px;
}

.dropdown-item {
  padding: 12px 15px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  color: #333;
  text-align: left;
}

.dropdown-item:hover {
  background-color: rgba(0,119,182,0.1);
  color: #0077b6;
}
.account-dropdown {
  position: absolute;
  right: -5%;
  top: 22%;
}
@media (max-width: 768px) {
  .nav-bar .container {
    flex-direction: column;
    align-items: stretch;
  }
  .dropdown-menu {
    position: static;
    width: 100%;
  }

  .nav-content {
    flex-direction: column;
    gap: 10px;
  }

  .logo-container {
    position: static;
    transform: none;
    margin: 10px 0;
  }

  .account-button {
    position: static;
    margin-top: 10px;
    align-self: center;
  }

  .purchase-button, .checkout-button {
    margin: 10px 20px !important;
  }
}
</style>
