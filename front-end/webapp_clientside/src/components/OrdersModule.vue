<template>
  <div class="order-history">
    <div v-if="loading">Loading...</div>
    <div v-else>


      <div v-if="action === 'details' && order">
        <h2 class="text-center mb-4">Order Details: {{ order.order_id }}</h2>
        <p class="text-center mb-4">
          ACTION = {{ action }}<br />
          ID = {{ id }}<br />
          <router-link to="/orders/list/all" class="btn btn-link">Back to the list</router-link>
        </p>
        <p class="text-center">Date: {{ formatDate(order.order_date) }}</p>
        <h3 class="mt-4 mb-3">Cars Purchased</h3>
        <div class="card mb-3" v-for="car in order.cars" :key="car.custom_id">
          <div class="card-body">
            <h5 class="card-title">{{ car.car_name }} - {{ car.total_price }}€</h5>
            <ul class="list-group list-group-flush">
              <li class="list-group-item" v-for="feature in car.features" :key="feature.feature_id">
                {{ feature.feature_name }} ({{ feature.feature_price }}€)
              </li>
            </ul>
          </div>
        </div>
        <p class="text-right font-weight-bold">Total Order Price: {{ order.total_price }}€</p>
      </div>

      <div v-else-if="action === 'list'">
        <h1 class="text-center mb-4">Order History</h1>
        <p class="text-center mb-4">
          ACTION = {{ action }}<br />
          ID = {{ id }}<br />
          <router-link to="/orders/list/all" class="btn btn-link">Back to the list</router-link>
        </p>
        <table class="table table-striped" v-if="orders.length > 0">
          <thead>
          <tr>
            <th>Order ID</th>
            <th>Date</th>
            <th>Car(s) Purchased</th>
            <th>Total Price</th>
            <th>Details</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="order in orders" :key="order.order_id">
            <td>{{ order.order_id }}</td>
            <td>{{ formatDate(order.order_date) }}</td>
            <td>
              <ul class="list-unstyled">
                <li v-for="car in order.cars" :key="car.custom_id">
                  {{ car.car_name }} - {{ car.total_price }}€
                </li>
              </ul>
            </td>
            <td>{{ order.total_price }}€</td>
            <td>
              <router-link :to="'/orders/details/' + order.order_id" class="btn btn-sm btn-info">
                DETAILS
              </router-link>
            </td>
          </tr>
          </tbody>
        </table>
        <p v-else class="text-center">No previous orders found.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OrderHistoryModule",
  props: ['action', 'id'],
  data() {
    return {
      orders: [],
      order: null,
      loading: true,
    };
  },
  methods: {
    getAllOrders() {
      this.loading = true;
      try {
        // Load all orders from localStorage
        this.orders = JSON.parse(localStorage.getItem('orders')) || [];

        // Load specific order if 'details' action is selected
        if (this.action === 'details' && this.id) {
          this.order = this.orders.find(order => order.order_id == this.id);
          if (!this.order) {
            console.error('Order not found');
          }
        }
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    }
  },
  watch: {
    id(newVal, oldVal) {
      if (this.action === 'details') {
        this.getAllOrders();
      }
    },
    action(newVal, oldVal) {
      if (newVal === 'list') {
        this.order = null;
      } else if (newVal === 'details' && this.id) {
        this.getAllOrders();
      }
    }
  },
  created() {
    this.getAllOrders();
  }
};
</script>

<style scoped>
.order-history {
  padding-top: 80px;
}

.order-history h1,
.order-history h2,
.order-history h3 {
  color: #333;
}

.order-history table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.order-history th,
.order-history td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.order-history th {
  background-color: #333;
  color: #fff;
}

.order-history .btn {
  display: inline-block;
  background-color: #0077b6;
  color: #fff;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.order-history .btn:hover {
  background-color: #005a8e;
}

@media (max-width: 768px) {
  .order-history {
    padding-top: 120px;
  }
}
</style>
