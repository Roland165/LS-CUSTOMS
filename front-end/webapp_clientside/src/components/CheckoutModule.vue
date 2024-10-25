<template>
  <div class="checkout">
    <h1>Checkout</h1>

    <table v-if="purchasedCars.length" class="table table-striped table-bordered table-hover">
      <thead>
      <tr>
        <th>Select</th>
        <th>Car ID</th>
        <th>Car Name</th>
        <th>Features</th>
        <th>Total Price (€)</th>
        <th>Delete</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="car in purchasedCars" :key="car.unique_id">
        <td>
          <input type="checkbox" v-model="selectedCars" :value="car.unique_id" />
        </td>
        <td>{{ car.car_id }}</td>
        <td>{{ car.car_name }}</td>
        <td>
          <ul>
            <li v-for="feature in car.features" :key="feature.feature_id">
              {{ feature.feature_name }}
              <span v-if="feature.feature_color"> - Color: {{ feature.feature_color }}</span>
              <span v-if="feature.feature_added_power"> - Power: {{ feature.feature_added_power }}hp</span>
              <span v-if="feature.feature_added_weight"> - Weight: {{ feature.feature_added_weight }}kg</span>
              - Price: {{ feature.feature_price }}€
            </li>
          </ul>
        </td>
        <td>{{ car.total_price }} €</td>
        <td>
          <button @click="deleteCar(car.unique_id)">Delete</button>
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
    };
  },
  methods: {
    loadPurchasedCars() {
      this.purchasedCars = JSON.parse(localStorage.getItem('purchasedCars')) || [];
    },
    confirmSelectedCars() {
      this.purchasedCars = this.purchasedCars.filter(car => !this.selectedCars.includes(car.unique_id));
      localStorage.setItem('purchasedCars', JSON.stringify(this.purchasedCars));
      this.selectedCars = [];
    },
    deleteCar(uniqueId) {
      this.purchasedCars = this.purchasedCars.filter(car => car.unique_id !== uniqueId);
      localStorage.setItem('purchasedCars', JSON.stringify(this.purchasedCars));
    }
  },
  created() {
    this.loadPurchasedCars();
  }
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
</style>

