<template>
  <div class="purchase">
    <div class="container mt-5">
      <h1 class="text-center">Choose Your Model</h1>
      <p class="text-center">
        ACTION = {{ action }}<br />
        ID = {{ id }}<br />
        <router-link class="btn btn-link" to="/purchase/list/all">Back to the list</router-link><br />
      </p>
      <router-link class="btn btn-link" to="/add-car">Add new car</router-link><br />
      <div v-if="action === 'list'">
        <div class="filters-section">
          <div class="filter-controls">
            <div class="filter-group">
              <label for="brand-filter">Filter by Brand:</label>
              <select id="brand-filter" v-model="selectedBrand" class="form-control">
                <option value="all">All Brands</option>
                <option v-for="brand in availableBrands" :key="brand" :value="brand">
                  {{ brand }}
                </option>
              </select>
            </div>

            <div class="filter-group">
              <label for="sort-option">Sort by:</label>
              <select id="sort-option" v-model="sortOption" class="form-control">
                <option value="none">None</option>
                <option value="price-asc">Price (Increasing)</option>
                <option value="price-desc">Price (Decreasing)</option>
              </select>
            </div>
          </div>
        </div>

        <div class="car-grid">
          <div v-for="c in filteredAndSortedCars" :key="c.car_id" class="car-card" @click="goToCustomize(c.car_id)">
            <div class="car-image">
              <img :src="getCarImage(c)" :alt="c.brand + ' ' + c.car_name">
            </div>
            <div class="car-info">
              <h3>{{ c.brand }} {{ c.car_name }}</h3>
              <p>Starting from {{ parseFloat(c.car_base_price) }}€</p>
              <router-link class="btn btn-primary" :to="'/purchase/customize/' + c.car_id">
                Configure
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div v-if="action === 'customize'" class="customization-section">
        <div class="customization-header">
          <h2>{{ oneCar.car_name }}</h2>
          <div class="price-info">
            <p class="base-price">Base Price: {{ oneCar.car_base_price }}€</p>
            <p class="total-price">Total Price: {{ calculateTotalPrice() }}€</p>
          </div>
        </div>

        <div class="customization-content">
          <div class="feature-sections">
            <div class="feature-section">
              <h3>Engine</h3>
              <div class="feature-options">
                <div
                  v-for="engine in motorFeatures"
                  :key="engine.feature_id"
                  class="feature-card"
                  :class="{ 'selected': selectedFeatures.motor === engine }"
                  @click="selectedFeatures.motor = engine"
                >
                  <img :src="getEngineImage(engine.feature_name)" :alt="engine.feature_name">
                  <div class="feature-info">
                    <h4>{{ engine.feature_name }}</h4>
                    <p>Power: {{ engine.feature_added_power }}hp</p>
                    <p class="price">{{ engine.feature_price }}€</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="feature-section">
              <h3>Brakes</h3>
              <div class="feature-options">
                <div
                  v-for="brake in brakeFeatures"
                  :key="brake.feature_id"
                  class="feature-card"
                  :class="{ 'selected': selectedFeatures.brakes === brake }"
                  @click="selectedFeatures.brakes = brake"
                >
                  <img :src="getBrakeImage(brake.feature_name)" :alt="brake.feature_name">
                  <div class="feature-info">
                    <h4>{{ brake.feature_name }}</h4>
                    <p>Weight: {{ brake.feature_added_weight }}kg</p>
                    <p class="price">{{ brake.feature_price }}€</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="feature-section">
              <h3>Color</h3>
              <div class="color-options">
                <div v-for="color in colorFeatures" :key="color.feature_id" class="color-card"
                     :class="{ 'selected': selectedFeatures.color === color }" @click="selectedFeatures.color = color">
                  <div class="color-sample" :style="{ backgroundColor: color.feature_color }"></div>
                  <div class="feature-info">
                    <h4>{{ color.feature_name }}</h4>
                    <p class="price">{{ color.feature_price }}€</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="feature-section">
              <h3>Other</h3>
              <div class="feature-options">
                <div
                  v-for="feature in features"
                  :key="feature.feature_id"
                  class="feature-card"
                  :class="{ 'selected': selectedFeaturesTab.includes(feature)}"
                  @click="selectedFeaturesTab.push(feature)"
                >
                  <!--<img :src="getEngineImage(engine.feature_name)" :alt="feature.feature_name">-->
                  <div class="feature-info">
                    <h4>{{ feature.feature_name }}</h4>
                    <p>Added power: {{ feature.feature_added_power }}hp</p>
                    <p class="price">{{ feature.feature_price }}€</p>
                    <p>Color: {{ feature.feature_color }}</p>
                    <p>Added weight: {{ feature.feature_added_weight }}Kg</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="action-buttons">
            <button class="btn btn-warning" @click="addToCart()">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showCartConfirmation" class="modal">
      <div class="modal-content">
        <h2>Added to Cart</h2>
        <p>{{ oneCar.car_name }} has been added to your cart!</p>
        <div class="modal-buttons">
          <router-link to="/checkout" class="btn btn-primary">Go to Checkout</router-link>
          <button class="btn btn-success" @click="continueShopping">Continue Shopping</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { onBeforeMount } from 'vue';
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
        brand_name: '',
      },
      features: [],
      colorFeatures: [],
      motorFeatures: [],
      brakeFeatures: [],
      selectedFeatures: {
        color: null,
        motor: null,
        brakes: null
      },
      selectedFeaturesTab: [],
      lastCustomId: 0,
      showCartConfirmation: false,
      selectedBrand: 'all',
      sortOption: 'none',
    };
  },
  methods: {
    getCarImage(car) {
      try {
        const formattedBrand = car.brand_name.split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join('');
        const formattedModel = car.car_name.replace(/[\s-()]/g, '');
        const imageName = `${formattedBrand}_${formattedModel}_img.jpg`;

        return require(`../medias/car_img/${imageName}`);
      } catch (error) {
        console.error('Failed to load image:', error);
        return require('../medias/default_img.jpg');
      }
    },
    getEngineImage(engineName) {
      switch(engineName) {
        case 'V6 Engine':
          return require('../medias/feature_img/v6_engine_img.jpg');
        case 'V8 Engine':
          return require('../medias/feature_img/v8_engine_img.jpg');
        case 'Electric Motor':
          return require('../medias/feature_img/electric_engine_img.jpg');
        default:
          return '';
      }
    },
    getBrakeImage(brakeName) {
      switch(brakeName) {
        case 'Standard Brakes':
          return require('../medias/feature_img/standard_brakes_img.jpg');
        case 'Performance Brakes':
          return require('../medias/feature_img/performance_brakes_img.jpg');
        case 'Carbon Ceramic Brakes':
          return require('../medias/feature_img/carbon_brakes_img.jpg');
        default:
          return '';
      }
    },
    goToCustomize(carId) {
      this.$router.push(`/purchase/customize/${carId}`);
      this.getFeaturesForCar(carId);
    },
    async getAllData() {
      try {
        const response = await axios.get('http://localhost:9000/carsapi/list');
        this.cars = response.data.map(car => ({
          car_id: car.car_id,
          car_name: car.car_name,
          car_base_price: car.car_base_price,
          brand: car.brand_name,
          brand_name: car.brand_name
        }));
        this.features
        this.colorFeatures = [
          { feature_id: 1, feature_name: 'Red Paint', feature_color: 'red', feature_price: 500 },
          { feature_id: 2, feature_name: 'Blue Paint', feature_color: 'blue', feature_price: 600 },
          { feature_id: 3, feature_name: 'Matte Black', feature_color: 'black', feature_price: 800 }
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
        console.error('Error fetching data:', ex);
        alert('Failed to load cars. Please try again later.');
      }
    },
    async getFeaturesForCar(carId) {
      try {
        const response = await axios.get(`http://localhost:9000/carsapi/show/${carId}/features`);
        this.features = response.data.map(feature => ({
          feature_id: feature.feature_id,
          feature_name: feature.feature_name,
          feature_price: feature.feature_price,
          feature_color: feature.feature_color,
          feature_added_power: feature.feature_added_power,
          feature_added_weight: feature.feature_added_weight,
        }));
      } catch (ex) {
        console.error('Error fetching data:', ex);
        alert('Failed to load features. Please try again later.');
      }
    },
    refreshOneCar() {
      if (this.$props.id === "all" || this.$props.id === "0") return;
      try {
        // Find the car by ID
        this.oneCar = this.cars.find(car => car.car_id == this.$props.id);
      } catch (ex) {
        console.error(ex);
      }
    },
    loadLastCustomId() {
      this.lastCustomId = JSON.parse(sessionStorage.getItem('lastCustomId')) || 0;
    },
    calculateTotalPrice() {
      let basePrice = parseFloat(this.oneCar.car_base_price);
      let featurePrice = 0;
      if (this.selectedFeatures.color) featurePrice += this.selectedFeatures.color.feature_price;
      if (this.selectedFeatures.motor) featurePrice += this.selectedFeatures.motor.feature_price;
      if (this.selectedFeatures.brakes) featurePrice += this.selectedFeatures.brakes.feature_price;
      for(let feature of this.selectedFeaturesTab){
        featurePrice = featurePrice + parseFloat(feature.feature_price);
        console.log(feature.feature_name+": "+feature.feature_price);
      }
      return basePrice + featurePrice;
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
      let purchasedCars = JSON.parse(sessionStorage.getItem('purchasedCars')) || [];
      purchasedCars.push(purchasedCar);
      sessionStorage.setItem('purchasedCars', JSON.stringify(purchasedCars));
      this.showCartConfirmation = true;
    },
    getNextCustomId() {
      this.lastCustomId += 1;
      sessionStorage.setItem('lastCustomId', JSON.stringify(this.lastCustomId));
      return this.lastCustomId;
    },
    continueShopping() {
      this.showCartConfirmation = false;
      this.$router.push('/purchase/list/all');
    },
    beforeMount(){
      get
    }
  },
  watch: {
    id(newVal, oldVal) {
      this.refreshOneCar();
    }
  },
  created() {
    this.getAllData();
  },
  computed: {
    filteredAndSortedCars() {
      let result = [...this.cars];

      if (this.selectedBrand !== 'all') {
        result = result.filter(car => car.brand === this.selectedBrand);
      }

      if (this.sortOption === 'price-asc') {
        result.sort((a, b) => a.car_base_price - b.car_base_price);
      } else if (this.sortOption === 'price-desc') {
        result.sort((a, b) => b.car_base_price - a.car_base_price);
      }

      return result;
    },
    availableBrands() {
      return [...new Set(this.cars.map(car => car.brand))];
    }
  },
};
</script>

<style scoped>
.purchase {
  padding-top: 80px;
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

.car-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  padding: 2rem 0;
}

.car-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}
.car-card:hover {
  transform: scale(1.05);
}
.car-image {
  width: 100%;
  height: 300px;
  overflow: hidden;
}

.car-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.car-info {
  padding: 1rem;
  text-align: center;
}

.customization-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem 0;
  border-bottom: 1px solid #e5e5e5;
}

.total-price {
  color: #D5001C;
  font-size: 1.5rem;
  font-weight: bold;
}

.feature-section {
  margin-bottom: 3rem;
}

.feature-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}
.color-card:hover{
  transform: scale(1.05);
}
.feature-card:hover {
  transform: scale(1.05);
}

.feature-card {
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.feature-card.selected {
  border: 2px solid #D5001C;
  box-shadow: 0 4px 12px rgba(213, 0, 28, 0.1);
}

.feature-card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.color-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.color-card {
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.color-card.selected {
  border: 2px solid #D5001C;
}

.color-sample {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 1rem;
  border: 1px solid #e5e5e5;
}

.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 30%;
  text-align: center;
  border-radius: 8px;
}

.modal-buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.filters-section {
  margin-bottom: 2rem;
}

.filter-controls {
  display: flex;
  gap: 2rem;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.filter-group label {
  font-weight: bold;
  margin: 0;
}

.filter-group select {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  min-width: 150px;
}

@media (max-width: 768px) {
  .car-grid {
    grid-template-columns: 1fr;
  }

  .customization-header {
    flex-direction: column;
    text-align: center;
  }

  .feature-options,
  .color-options {
    grid-template-columns: 1fr;
  }

  .modal-content {
    width: 90%;
  }
  .filter-controls {
    flex-direction: column;
    gap: 1rem;
  }

  .filter-group {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
