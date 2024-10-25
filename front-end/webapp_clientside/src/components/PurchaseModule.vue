<template>
  <div class="purchase">
    <p>
      ACTION = {{ action }}<br />
      ID = {{ id }}<br />
      <a href="/#/purchase/list/all">Back to the list</a><br />
    </p>

    <table v-if="action === 'list'" class="table table-striped table-bordered table-hover">
      <tr>
        <td>ID</td>
        <td>NAME</td>
        <td>CUSTOMIZE</td>
      </tr>
      <tr v-for="c of cars" :key="c.car_id">
        <td>{{ c.car_id }}</td>
        <td>{{ c.car_name }}</td>
        <td><a :href="'/#/purchase/customize/' + c.car_id">[CUSTOMIZE]</a></td>
      </tr>
    </table>

    <div v-if="action === 'customize'">
      <h2>Customize Car: {{ oneCar.car_name }}</h2>
      <p><strong>Base Price:</strong> {{ oneCar.car_base_price }} €</p>
      <p><strong>Total Price:</strong> {{ calculateTotalPrice() }} €</p>
      <table class="table table-striped table-bordered table-hover">
        <tr><td>SELECT COLOR</td>
          <td>
            <select v-model="selectedFeatures.color">
              <option v-for="f in colorFeatures" :value="f">{{ f.feature_name }} (Color: {{ f.feature_color }})</option>
            </select>
          </td>
        </tr>

        <tr><td>SELECT MOTOR</td>
          <td>
            <select v-model="selectedFeatures.motor">
              <option v-for="f in motorFeatures" :value="f">{{ f.feature_name }} (Power: {{ f.feature_added_power }}hp, Price: {{ f.feature_price }}€)</option>
            </select>
          </td>
        </tr>

        <tr><td>SELECT BRAKES</td>
          <td>
            <select v-model="selectedFeatures.brakes">
              <option v-for="f in brakeFeatures" :value="f">{{ f.feature_name }} (Weight Added: {{ f.feature_added_weight }}kg, Price: {{ f.feature_price }}€)</option>
            </select>
          </td>
        </tr>

        <tr><td colspan="2">
          <input type="button" value="PURCHASE" @click="purchaseCar()" />
        </td></tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Cars',
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
      }
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

      // Assign a unique ID to each purchased car
      purchasedCar.unique_id = Date.now() + Math.random().toString(36).substring(7);

      let purchasedCars = JSON.parse(localStorage.getItem('purchasedCars')) || [];
      purchasedCars.push(purchasedCar);
      localStorage.setItem('purchasedCars', JSON.stringify(purchasedCars));

      window.location.href = '/#/checkout';
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
/* Add styling here as needed */
</style>

