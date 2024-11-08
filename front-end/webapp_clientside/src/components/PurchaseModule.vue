<template>
  <div class="purchase">
    <div class="container mt-5">
      <h1 class="text-center">Customize</h1>
      <p class="text-center">
        ACTION = {{ action }}<br />
        ID = {{ id }}<br />
        <router-link class="btn btn-link" to="/purchase/list/all">Back to the list</router-link><br />
      </p>

      <table v-if="action === 'list'" class="table table-striped table-bordered table-hover mt-4">
        <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Customize</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="c in cars" :key="c.car_id">
          <td>{{ c.car_id }}</td>
          <td>{{ c.car_name }}</td>
          <td>
            <router-link class="btn btn-primary" :to="'/purchase/customize/' + c.car_id">[CUSTOMIZE]</router-link>
          </td>
        </tr>
        </tbody>
      </table>

      <div v-if="action === 'customize'" class="customization-section">
        <h2 class="text-center">Customize Your Car: {{ oneCar.car_name }}</h2>
        <p class="text-center"><strong>Base Price:</strong> {{ oneCar.car_base_price }} €</p>
        <p class="text-center"><strong>Total Price:</strong> {{ calculateTotalPrice() }} €</p>

        <table class="table table-striped table-bordered table-hover mt-4">
          <tbody>
          <tr>
            <td>SELECT COLOR</td>
            <td>
              <select v-model="selectedFeatures.color" class="form-control">
                <option v-for="f in colorFeatures" :value="f" :key="f.feature_id">
                  {{ f.feature_name }} (Color: {{ f.feature_color }})
                </option>
              </select>
            </td>
          </tr>

          <tr>
            <td>SELECT MOTOR</td>
            <td>
              <select v-model="selectedFeatures.motor" class="form-control">
                <option v-for="f in motorFeatures" :value="f" :key="f.feature_id">
                  {{ f.feature_name }} (Power: {{ f.feature_added_power }}hp, Price: {{ f.feature_price }}€)
                </option>
              </select>
            </td>
          </tr>

          <tr>
            <td>SELECT BRAKES</td>
            <td>
              <select v-model="selectedFeatures.brakes" class="form-control">
                <option v-for="f in brakeFeatures" :value="f" :key="f.feature_id">
                  {{ f.feature_name }} (Weight Added: {{ f.feature_added_weight }}kg, Price: {{ f.feature_price }}€)
                </option>
              </select>
            </td>
          </tr>

          <tr>
            <td colspan="2" class="text-center">
              <button class="btn btn-success" @click="purchaseCar()">GO TO PURCHASE</button>
              <button class="btn btn-warning" @click="addToCart()">ADD TO CART</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PurchaseModule',
  props: ['action', 'id'],
  data() {
    return {
      cars: [],
      oneCar: {
        car_id: 0,
        car_name: 'xxx',
        car_base_price: 0,
        features: []
      },
      colorFeatures: [],
      motorFeatures: [],
      brakeFeatures: [],
      selectedFeatures: {
        color: null,
        motor: null,
        brakes: null
      },
      lastCustomId: 0,
    };
  },
  methods: {
    async getAllData() {
      try {
        this.cars = [
          { car_id: 1, car_name: "Audi S4", car_base_price: 45000 },
          { car_id: 2, car_name: "BMW i8", car_base_price: 90000 }
        ];
        this.colorFeatures = [
          { feature_id: 1, feature_name: 'Red Paint', feature_color: 'Red', feature_price: 500 },
          { feature_id: 2, feature_name: 'Blue Paint', feature_color: 'Blue', feature_price: 600 },
          { feature_id: 3, feature_name: 'Matte Black', feature_color: 'Black', feature_price: 800 }
        ];
        this.motorFeatures = [
          { feature_id: 4, feature_name: 'V6 Engine', feature_added_power: 50, feature_price: 5000 },
          { feature_id: 5, feature_name: 'V8 Engine', feature_added_power: 80, feature_price: 8000 },
          { feature_id: 6, feature_name: 'Electric Motor', feature_added_power: 100, feature_price: 10000 }
        ];
        this.brakeFeatures = [
          { feature_id: 7, feature_name: 'Standard Brakes', feature_added_weight: 15, feature_price: 1000 },
          { feature_id: 8, feature_name: 'Performance Brakes', feature_added_weight: 10, feature_price: 2000 },
          { feature_id: 9, feature_name: 'Carbon Ceramic Brakes', feature_added_weight: 5, feature_price: 4000 }
        ];

        this.refreshOneCar();
        this.loadLastCustomId();
      } catch (ex) {
        console.log(ex);
      }
    },

    refreshOneCar() {
      if (this.$props.id === "all" || this.$props.id === "0") return;
      try {
        this.oneCar = this.cars.find(car => car.car_id == this.$props.id);
      } catch (ex) {
        console.log(ex);
      }
    },

    loadLastCustomId() {
      this.lastCustomId = JSON.parse(localStorage.getItem('lastCustomId')) || 0;
    },

    calculateTotalPrice() {
      let basePrice = this.oneCar.car_base_price;
      let featurePrice = 0;

      if (this.selectedFeatures.color) featurePrice += this.selectedFeatures.color.feature_price;
      if (this.selectedFeatures.motor) featurePrice += this.selectedFeatures.motor.feature_price;
      if (this.selectedFeatures.brakes) featurePrice += this.selectedFeatures.brakes.feature_price;

      return basePrice + featurePrice;
    },

    purchaseCar() {
      const purchasedCar = JSON.parse(JSON.stringify(this.oneCar));
      purchasedCar.total_price = this.calculateTotalPrice();
      purchasedCar.features = [];

      if (this.selectedFeatures.color) {
        purchasedCar.features.push(this.selectedFeatures.color);
      }
      if (this.selectedFeatures.motor) {
        purchasedCar.features.push(this.selectedFeatures.motor);
      }
      if (this.selectedFeatures.brakes) {
        purchasedCar.features.push(this.selectedFeatures.brakes);
      }

      purchasedCar.custom_id = this.getNextCustomId();

      let purchasedCars = JSON.parse(localStorage.getItem('purchasedCars')) || [];
      purchasedCars.push(purchasedCar);
      localStorage.setItem('purchasedCars', JSON.stringify(purchasedCars));

      this.$router.push('/checkout');
    },

    addToCart() {
      const purchasedCar = JSON.parse(JSON.stringify(this.oneCar));
      purchasedCar.total_price = this.calculateTotalPrice();
      purchasedCar.features = [];

      if (this.selectedFeatures.color) {
        purchasedCar.features.push(this.selectedFeatures.color);
      }
      if (this.selectedFeatures.motor) {
        purchasedCar.features.push(this.selectedFeatures.motor);
      }
      if (this.selectedFeatures.brakes) {
        purchasedCar.features.push(this.selectedFeatures.brakes);
      }

      purchasedCar.custom_id = this.getNextCustomId();

      let purchasedCars = JSON.parse(localStorage.getItem('purchasedCars')) || [];
      purchasedCars.push(purchasedCar);
      localStorage.setItem('purchasedCars', JSON.stringify(purchasedCars));

      alert(`${this.oneCar.car_name} has been added to your cart!`);
    },

    getNextCustomId() {
      this.lastCustomId += 1;
      localStorage.setItem('lastCustomId', JSON.stringify(this.lastCustomId));
      return this.lastCustomId;
    }
  },

  watch: {
    id(newVal, oldVal) {
      this.refreshOneCar();
    }
  },

  created() {
    this.getAllData();
  }
};
</script>

<style scoped>
.purchase {
  padding-top: 80px;
}

.purchase h1,
.purchase h2,
.purchase h3 {
  color: #333;
}

.purchase .table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.purchase th,
.purchase td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.purchase th {
  background-color: #333;
  color: #fff;
}

.purchase .btn {
  display: inline-block;
  background-color: #0077b6;
  color: #fff;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.purchase .btn:hover {
  background-color: #005a8e;
}
</style>
