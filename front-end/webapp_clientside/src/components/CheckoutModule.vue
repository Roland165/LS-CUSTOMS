<template>
  <div class="checkout">
    <h1 class="text-center">Checkout</h1>

    <table v-if="purchasedCars.length" class="table table-striped table-bordered table-hover">
      <thead>
      <tr>
        <th>Select</th>
        <th>Custom ID</th>
        <th>Name</th>
        <th>Total Price (€)</th>
        <th>Features</th>
        <th>Delete</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="car in purchasedCars" :key="car.custom_id">
        <td>
          <input type="checkbox" v-model="selectedCars" :value="car.custom_id" />
        </td>
        <td>{{ car.custom_id }}</td>
        <td>{{ car.car_name }}</td>
        <td>{{ car.total_price }} €</td>
        <td>
          <ul>
            <li v-for="feature in car.features" :key="feature.feature_id">
              {{ feature.feature_name }} (Price: {{ feature.feature_price }}€)
            </li>
          </ul>
        </td>
        <td>
          <button @click="deleteCar(car.custom_id)">Delete</button>
        </td>
      </tr>
      </tbody>
    </table>
    <p v-else>No cars in checkout.</p>
    <button @click="confirmSelectedCars" :disabled="!selectedCars.length">Confirm Purchase</button>
  </div>
</template>

<script>
export default {
  name: 'Checkout',
  data() {
    return {
      purchasedCars: [],
      selectedCars: [],
      lastCustomId: 0,
    };
  },
  methods: {
    loadPurchasedCars() {
      this.purchasedCars = JSON.parse(localStorage.getItem('purchasedCars')) || [];
    },
    confirmSelectedCars() {
      const newOrder = {
        custom_id: this.getNextOrderId(),  // Generate the order ID
        order_date: new Date().toISOString().split('T')[0],
        cars: [],
        total_price: 0,
      };

      this.selectedCars.forEach(customId => {
        const car = this.purchasedCars.find(c => c.custom_id === customId);
        if (car) {
          newOrder.cars.push(car);
          newOrder.total_price += car.total_price;
        }
      });

      let orders = JSON.parse(localStorage.getItem('orders')) || [];
      orders.push(newOrder);
      localStorage.setItem('orders', JSON.stringify(orders));

      // Clear selected cars from purchasedCars
      this.purchasedCars = this.purchasedCars.filter(car => !this.selectedCars.includes(car.custom_id));
      localStorage.setItem('purchasedCars', JSON.stringify(this.purchasedCars));

      this.selectedCars = [];
    },
    deleteCar(customId) {
      this.purchasedCars = this.purchasedCars.filter(car => car.custom_id !== customId);
      localStorage.setItem('purchasedCars', JSON.stringify(this.purchasedCars));
    },
    loadLastCustomId() {
      this.lastCustomId = JSON.parse(localStorage.getItem('lastCustomId')) || 0;
    },
    getNextOrderId() {
      // Increment the order ID
      return JSON.parse(localStorage.getItem('orderCounter')) || 0 + 1;
    },
    saveOrderCounter() {
      const currentCounter = JSON.parse(localStorage.getItem('orderCounter')) || 0;
      localStorage.setItem('orderCounter', JSON.stringify(currentCounter + 1));
    },
  },
  created() {
    this.loadPurchasedCars();
    this.loadLastCustomId();  // Load last custom_id when component is created
  },
};
</script>

<style scoped>
.checkout {
  padding-top: 50px;
}
.table {
  width: 100%;
  margin: 20px 0;
}
.text-center {
  color: #333;
}
</style>


