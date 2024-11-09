<template>
  <div class="order-history">
    <div class="container mt-5">
      <div v-if="loading" class="text-center">Loading...</div>
      <div v-else-if="action === 'details' && order">
        <h2 class="text-center mb-4">Order Details: {{ order.order_id }}</h2>
        <p class="text-center">Date: {{ formatDate(order.order_date) }}</p>
        <table class="table table-striped table-bordered table-hover">
          <thead>
          <tr>
            <th>Car Name</th>
            <th>Features</th>
            <th>Price</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="car in order.cars" :key="car.custom_id">
            <td>{{ car.car_name }}</td>
            <td>
              <ul class="list-unstyled mb-0">
                <li v-for="feature in car.features" :key="feature.feature_id">
                  {{ feature.feature_name }} ({{ feature.feature_price }}€)
                </li>
              </ul>
            </td>
            <td>{{ car.total_price }}€</td>
          </tr>
          </tbody>
        </table>
        <div class="text-right mt-3">
          <h4>Total Order Price: {{ order.total_price }}€</h4>
        </div>
        <div class="text-center mt-4">
          <router-link to="/orders/list/all" class="btn btn-primary">Back to List</router-link>
        </div>
      </div>


      <div v-else-if="action === 'list'">
        <h1 class="text-center mb-4">Order History</h1>
        <p class="text-center mb-4">
          ACTION = {{ action }}<br />
          ID = {{ id }}<br />
          <router-link to="/orders/list/all" class="btn btn-link">Back to the list</router-link>
        </p>
        <table class="table table-striped table-bordered table-hover" v-if="orders.length > 0">
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
              <ul class="list-unstyled mb-0">
                <li v-for="car in order.cars" :key="car.custom_id">
                  {{ car.car_name }} - {{ car.total_price }}€
                </li>
              </ul>
            </td>
            <td>{{ order.total_price }}€</td>
            <td>
              <router-link :to="'/orders/details/' + order.order_id" class="btn btn-info">DETAILS</router-link>
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
        this.orders = JSON.parse(localStorage.getItem('orders')) || [];

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
.order-history h3,
.order-history h4 {
  color: #333;
}

.order-history .table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.order-history th,
.order-history td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  vertical-align: middle;
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
  border: none;
}

.order-history .btn:hover {
  background-color: #005a8e;
}

.order-history ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.order-history ul li {
  margin-bottom: 5px;
}

.order-history ul li:last-child {
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .order-history {
    padding-top: 120px;
  }

  .order-history .table {
    font-size: 0.9em;
  }

  .order-history th,
  .order-history td {
    padding: 8px;
  }

  .order-history .btn {
    padding: 6px 12px;
    font-size: 0.9em;
  }
}
</style>
