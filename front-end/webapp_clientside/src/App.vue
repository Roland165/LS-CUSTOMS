<template>
  <div id="app">
    <nav class="nav_bar_header">
      <a href="/#/purchase/list/all">Purchase</a>
      <a href="/#/checkout/all">Checkout</a>
      <a href="/#/orders/list/all">Orders</a>
    </nav>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>

.nav_bar_header {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #42b983;
  padding: 10px 0;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1000;
}

.nav_bar_header a {
  color: white;
  text-decoration: none;
  margin: 0 20px;
  font-weight: bold;
  font-size: 1.2em;
  padding: 10px 20px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.nav_bar_header a:hover {
  background-color: #36a773;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
