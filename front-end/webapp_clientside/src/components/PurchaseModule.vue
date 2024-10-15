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
      <tr v-for="c of cars" v-bind:key="c.car_id">
        <td>{{ c.car_id }}</td>
        <td>{{ c.car_name }}</td>
        <td><a :href="'/#/purchase/customize/' + c.car_id">[CUSTOMIZE]</a></td>
      </tr>
    </table>

    <div v-if="action === 'customize'">
      <h2>Customize Car: {{ oneCar.car_name }}</h2>
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

      <h3>Features added to {{ oneCar.car_name }}:</h3>
      <ul>
        <li v-for="(f, key) in oneCar.features" :key="key">
          {{ f.feature_name }}
          <span v-if="f.feature_added_power">- Power: {{ f.feature_added_power }}hp</span>
          <span v-if="f.feature_added_weight">- Weight: {{ f.feature_added_weight }}kg</span>
          <span v-if="f.feature_color">- Color: {{ f.feature_color }}</span>
          - Price: {{ f.feature_price }}€
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Cars',
  props: ['action', 'id'],
  data () {
    return {
      cars: [],
      oneCar: {
        car_id: 0,
        car_name: 'xxx',
        car_seat_num: 0,
        car_creation_date: 0,
        car_base_power: 0,
        car_base_weight: 0,
        car_base_price: 0,
        brand_id: 0,
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
    }
  },
  methods: {
    async getAllData() {
      try {

        this.cars = [
          { car_id: 1, car_name: "Audi S4", car_seat_num: 5, car_base_power: 300, car_base_weight: 1600, car_base_price: 45000, brand_id: 2, features: [] },
          { car_id: 2, car_name: "BMW i8", car_seat_num: 4, car_base_power: 370, car_base_weight: 1400, car_base_price: 90000, brand_id: 1, features: [] }
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
      } catch (ex) {console.log(ex)}
    },

    refreshOneCar() {
      if (this.$props.id === "all" || this.$props.id === "0") return;
      try {this.oneCar = this.cars.find(car => car.car_id == this.$props.id);}
      catch (ex) { console.log(ex); }
    },

    purchaseCar() {
      if (this.selectedFeatures.color) {
        this.oneCar.features.push({
          feature_id: this.selectedFeatures.color.feature_id,
          feature_name: this.selectedFeatures.color.feature_name,
          feature_color: this.selectedFeatures.color.feature_color,
          feature_price: this.selectedFeatures.color.feature_price
        });
      }

      if (this.selectedFeatures.motor) {
        this.oneCar.features.push({
          feature_id: this.selectedFeatures.motor.feature_id,
          feature_name: this.selectedFeatures.motor.feature_name,
          feature_added_power: this.selectedFeatures.motor.feature_added_power,
          feature_price: this.selectedFeatures.motor.feature_price
        });
      }

      if (this.selectedFeatures.brakes) {
        this.oneCar.features.push({
          feature_id: this.selectedFeatures.brakes.feature_id,
          feature_name: this.selectedFeatures.brakes.feature_name,
          feature_added_weight: this.selectedFeatures.brakes.feature_added_weight,
          feature_price: this.selectedFeatures.brakes.feature_price
        });
      }
      let purchasedCars = JSON.parse(localStorage.getItem('purchasedCars')) || [];
      purchasedCars.push(this.oneCar);
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
}
</script>

<style scoped>
#app table {
  width: 95%;
  margin: 20px auto;
}
.purchase{
  padding-top: 50px;
}

#app td {
  text-align: left;
}
</style>

