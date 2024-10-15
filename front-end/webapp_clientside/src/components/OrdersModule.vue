<template>
  <div class="order-history">
    <p>
      ACTION = {{ action }}<br />
      ID = {{ id }}<br />
      <a href="/#/orders/list/all">Back to the list</a><br />
    </p>

    <div v-if="action === 'details' && order">
      <h2>Details Order: {{ order.order_id }}</h2>
      <p>Date: {{ order.order_date }}</p>
      <h3>Cars Purchased</h3>
      <ul>
        <li v-for="car in order.cars" :key="car.car_id">
          {{ car.car_name }} - {{ car.car_base_price }}€
        </li>
      </ul>
      <p>Total Price: {{ order.total_price }}€</p>
    </div>
    <div v-if="action === 'list'">
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
          <td>{{ order.order_date }}</td>
          <td>
            <ul>
              <li v-for="car in order.cars" :key="car.car_id">
                {{ car.car_name }} - {{ car.car_base_price }}€
              </li>
            </ul>
          </td>
          <td>{{ order.total_price }}€</td>
          <td>
            <a :href="'/#/orders/details/' + order.order_id">[DETAILS]</a>
          </td>
        </tr>
        </tbody>
      </table>

      <p v-else>
        No previous orders found.
      </p>
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
      order:null,
    };
  },
  methods: {
    async getAllOrders() {
      this.orders = [
        {
          order_id: 1,
          order_date: "2024-01-05",
          cars: [
            { car_id: 1, car_name: "Audi S4", car_base_price: 40000 },
            { car_id: 2, car_name: "BMW i8", car_base_price: 80000 }
          ],
          total_price: 120000
        },
        {
          order_id: 2,
          order_date: "2024-02-15",
          cars: [{ car_id: 3, car_name: "Citroen C3", car_base_price: 25000 }],
          total_price: 25000
        }
      ];
      if (this.action === 'details' && this.id) {
        this.order = this.orders.find(order => order.order_id == this.id);
      }
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
  padding-top: 50px;
}

#app table {
  width: 95%;
  margin: 20px auto;
}

#app td {
  text-align: left;
}

p {
  text-align: center;
  color: #666;
  font-size: 1.1em;
}
</style>
