<template>
  <div class="checkout">
    <table class="table table-striped">
      <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Base Price</th>
        <th>Select</th>
        <th>Delete</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="car in cars" :key="car.car_id">
        <td>{{ car.car_id }}</td>
        <td>{{ car.car_name }}</td>
        <td>{{ car.car_base_price }}€</td>
        <td>
          <input type="checkbox" v-model="selectedCars" :value="car" @change="updateTotalPrice()">
        </td>
        <td><button @click="deleteOrder(car.car_id)">Delete</button></td>
      </tr>
      </tbody>
    </table>

    <h2>Total Price: {{ totalPrice }}€</h2>
    <button @click="confirmPurchase">Confirm Purchase</button>
  </div>
</template>

<script>
export default {
  name: 'Checkout',
  data() {
    return {
      cars: [],
      selectedCars: [],
      totalPrice: 0
    };
  },
  methods: {
    async getAllData() {
      const savedCars = localStorage.getItem('cars');
      this.cars = savedCars ? JSON.parse(savedCars) : [
        {
          car_id: 1,
          car_name: "Audi S4",
          car_base_price: 40000,
          car_seat_num: 5,
          car_creation_date: 2018,
          car_base_power: 300,
          car_base_weight: 1500
        },
        {
          car_id: 2,
          car_name: "BMW i8",
          car_base_price: 80000,
          car_seat_num: 4,
          car_creation_date: 2020,
          car_base_power: 370,
          car_base_weight: 1480
        },
        {
          car_id: 3,
          car_name: "Citroen C3",
          car_base_price: 25000,
          car_seat_num: 5,
          car_creation_date: 2021,
          car_base_power: 110,
          car_base_weight: 1100
        }
      ];
    },
    updateTotalPrice() {
      this.totalPrice = this.selectedCars.reduce((total, car) => {
        return total + car.car_base_price;
      }, 0);
    },
    confirmPurchase() {
      if (this.selectedCars.length === 0) {
        alert("Please select at least one car to purchase.");
        return;
      }
      alert(`You have purchased ${this.selectedCars.length} car(s) for a total of ${this.totalPrice}€.`);
    },
    deleteOrder(carId) {
      this.cars = this.cars.filter(car => car.car_id !== carId);
      this.selectedCars = this.selectedCars.filter(car => car.car_id !== carId);
      localStorage.setItem('cars', JSON.stringify(this.cars));

      this.updateTotalPrice();
    }
  },

  created() {
    this.getAllData();
  }
}
</script>

<style scoped>
.checkout {
  padding-top: 50px;
}
#app table {
  width: 95%;
  margin: 20px auto;
}
#app td {
  text-align: center;
}
</style>
