<template>
  <div id="app">
    <nav class="nav-bar">
      <div class="container">
        <router-link to="/" class = "nav_bar_button">Home</router-link>
        <router-link to="/purchase/list/all" class = "nav_bar_button">Purchase</router-link>
        <router-link to="/">
        <img src="../src/medias/LS-CUSTOMS_logo.png" alt="Logo" class="logo" @click="$router.push('/')"></router-link>
        <router-link to="/checkout/all" class = "nav_bar_button">Checkout</router-link>
        <router-link to="/orders/list/all" class = "nav_bar_button">Orders</router-link>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
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
  justify-content: center;
  align-items: center;
}

.nav-bar .nav_bar_button {
  color: #fff;
  text-decoration: none;
  margin: 0 20px;
  font-weight: bold;
  font-size: 1.2em;
  padding: 10px 20px;
  border-radius: 80px;
  border : #0077b6 solid 3px;
  transition: background-color 0.3s ease;
}

.nav-bar .nav_bar_button:hover {
  background-color: rgba(255, 255, 255, 0.3);
}
.logo {
  height: 60px;
  width: auto;
  max-width: 100%;
}

@media (max-width: 768px) {
  .nav-bar {
    flex-direction: column;
    align-items: flex-start;
  }
  .nav-bar .nav_bar_button {
    margin: 10px 0;
  }
}
</style>
