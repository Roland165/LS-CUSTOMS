<template>
  <div class="checkout">
    <div class="container mt-5">
      <h1 class="text-center">Checkout</h1>

      <table v-if="purchasedCars.length" class="table table-striped table-bordered table-hover">
        <thead>
        <tr>
          <th>
            <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" />
          </th>
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
            <button class="btn btn-danger" @click="deleteCar(car.custom_id)">Delete</button>
          </td>
        </tr>
        </tbody>
      </table>
      <p v-else class="text-center">No cars in checkout.</p>
      <div class="text-center mt-4">
        <button class="btn btn-primary" @click="confirmSelectedCars" :disabled="!selectedCars.length">
          Confirm Purchase
        </button>
      </div>
    </div>

    <div v-if="showConfirmation" class="modal">
      <div class="modal-content">
        <h2>Confirm Purchase</h2>
        <p>Total Price: {{ totalPrice }} €</p>
        <div class="modal-buttons">
          <button class="btn btn-success" @click="finalizeOrder">Confirm</button>
          <button class="btn btn-danger" @click="showConfirmation = false">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CheckoutModule',
  data() {
    return {
      purchasedCars: [],
      selectedCars: [],
      selectAll: false,
      showConfirmation: false,
      totalPrice: 0,
    };
  },
  methods: {
    loadPurchasedCars() {
      this.purchasedCars = JSON.parse(localStorage.getItem('purchasedCars')) || [];
    },
    toggleSelectAll() {
      this.selectedCars = this.selectAll ? this.purchasedCars.map(car => car.custom_id) : [];
    },
    confirmSelectedCars() {
      this.totalPrice = this.selectedCars.reduce((total, customId) => {
        const car = this.purchasedCars.find(c => c.custom_id === customId);
        return total + (car ? car.total_price : 0);
      }, 0);
      this.showConfirmation = true;
    },
    finalizeOrder() {
      const newOrder = {
        order_id: this.getNextOrderId(),
        order_date: new Date().toISOString().split('T')[0],
        cars: this.selectedCars.map(customId => this.purchasedCars.find(c => c.custom_id === customId)),
        total_price: this.totalPrice,
      };

      let orders = JSON.parse(localStorage.getItem('orders')) || [];
      orders.push(newOrder);
      localStorage.setItem('orders', JSON.stringify(orders));

      this.purchasedCars = this.purchasedCars.filter(car => !this.selectedCars.includes(car.custom_id));
      localStorage.setItem('purchasedCars', JSON.stringify(this.purchasedCars));

      this.selectedCars = [];
      this.showConfirmation = false;
    },
    deleteCar(customId) {
      this.purchasedCars = this.purchasedCars.filter(car => car.custom_id !== customId);
      localStorage.setItem('purchasedCars', JSON.stringify(this.purchasedCars));
    },
    getNextOrderId() {
      const currentCounter = JSON.parse(localStorage.getItem('orderCounter')) || 0;
      localStorage.setItem('orderCounter', JSON.stringify(currentCounter + 1));
      return currentCounter + 1;
    },
  },
  created() {
    this.loadPurchasedCars();
  },
};
</script>

<style scoped>
.checkout {
  padding-top: 80px;
}

.checkout h1,
.checkout h2,
.checkout h3 {
  color: #333;
}

.checkout .table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.checkout th,
.checkout td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.checkout th {
  background-color: #333;
  color: #fff;
}

.checkout .btn {
  display: inline-block;
  background-color: #0077b6;
  color: #fff;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.checkout .btn:hover {
  background-color: #005a8e;
}

.checkout .modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.checkout .modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 30%;
}

.checkout .modal-buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .checkout {
    padding-top: 120px;
  }

  .modal-content {
    width: 90%;
  }
}
</style>

