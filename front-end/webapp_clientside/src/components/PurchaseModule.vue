<template>
  <div class="purchase">
    <div class="container mt-5">

      <!-- MAIN PAGE  -->
      <h1 class="text-center">Choose Your Model</h1>

      <div v-if="action === 'list'">
        <div class="filters-section">
          <div class="filter-controls">
            <!-- FILTER BRAND  -->
            <div class="filter-group">
              <label for="brand-filter">Filter by Brand:</label>
              <select id="brand-filter" v-model="selectedBrand" class="form-control">
                <option value="all">All Brands</option>
                <option v-for="brand in availableBrands" :key="brand" :value="brand">
                  {{ brand }}
                </option>
              </select>
            </div>
            <!-- FILTER SORT  -->
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

        <!-- CARS DISPLAY  -->
        <div class="car-grid">
          <div v-for="c in filteredAndSortedCars" :key="'Cars'+c.car_id" class="car-card" @click="goToCustomize(c.car_id)">
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


      <!-- CUSTOMIZE PART  -->
      <div v-if="action === 'customize'" class="customization-section">
        <router-link class="btn btn-link" to="/purchase/list/all">Back to the list</router-link><br />
        <div class="customization-header">
          <h2>{{ oneCar.car_name }}</h2>
          <div class="price-info">
            <p class="base-price">Base Price: {{ parseFloat(oneCar.car_base_price) }}€</p>
            <p class="total-price">Total Price: {{ calculateTotalPrice() }}€</p>
          </div>
        </div>

        <!-- STORE AVAILABLE  -->
        <div class="store-availability-section">
          <h3>Available at:</h3>
          <div v-if="availableStores.length > 0" class="store-list">
            <div v-for="store in availableStores" :key="store.store_id" class="store-card">
              <h4>{{ store.store_name }}</h4>
              <div class="store-details">
                <p><i class="fas fa-map-marker-alt"></i> {{ store.store_city }}</p>
                <p><i class="fas fa-location-dot"></i> {{ store.store_address }}</p>
                <p><i class="fas fa-user-tie"></i> Director: {{ store.store_director }}</p>
              </div>
            </div>
          </div>
          <div v-else class="no-stores-message">
            <p>No stores available with this configuration</p>
          </div>
        </div>

        <div class="customization-content">
          <div class="feature-sections">

            <!-- SEATS  -->
            <div class="feature-section" v-if="seatFeatures.length > 0">
              <h3>Seats</h3>
              <div class="feature-options">
                <div v-for="feature in seatFeatures" :key="'Seat'+feature.feature_id" class="feature-card"
                     :class="{ 'selected': selectedFeaturesByType.seats === feature }" @click="selectFeatureByType('seats', feature)">
                  <div class="feature-info">
                    <h4>{{ feature.feature_name }}</h4>
                    <p v-if="feature.feature_added_power">Added power: {{ feature.feature_added_power }} hp</p>
                    <p class="price">{{ parseFloat(feature.feature_price) }} €</p>
                    <p v-if="feature.feature_color">Color: {{ feature.feature_color }}</p>
                    <p v-if="feature.feature_added_weight">Added weight: {{ parseFloat(feature.feature_added_weight) }} Kg</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- SPOILERS  -->
            <div class="feature-section" v-if="spoilerFeatures.length > 0">
              <h3>Spoilers</h3>
              <div class="feature-options">
                <div v-for="feature in spoilerFeatures" :key="'Spoiler'+feature.feature_id" class="feature-card"
                     :class="{ 'selected': selectedFeaturesByType.spoilers === feature }" @click="selectFeatureByType('spoilers', feature)">
                  <div class="feature-info">
                    <h4>{{ feature.feature_name }}</h4>
                    <p v-if="feature.feature_added_power">Added power: {{ feature.feature_added_power }} hp</p>
                    <p class="price">{{ parseFloat(feature.feature_price) }} €</p>
                    <p v-if="feature.feature_color">Color: {{ feature.feature_color }}</p>
                    <p v-if="feature.feature_added_weight">Added weight: {{ parseFloat(feature.feature_added_weight) }} Kg</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- TIRES  -->
            <div class="feature-section" v-if="tireFeatures.length > 0">
              <h3>Tires</h3>
              <div class="feature-options">
                <div v-for="feature in tireFeatures" :key="'Tire'+feature.feature_id" class="feature-card"
                  :class="{ 'selected': selectedFeaturesByType.tires === feature }" @click="selectFeatureByType('tires', feature)">
                  <div class="feature-info">
                    <h4>{{ feature.feature_name }}</h4>
                    <p v-if="feature.feature_added_power">Added power: {{ feature.feature_added_power }} hp</p>
                    <p class="price">{{ parseFloat(feature.feature_price) }} €</p>
                    <p v-if="feature.feature_color">Color: {{ feature.feature_color }}</p>
                    <p v-if="feature.feature_added_weight">Added weight: {{ parseFloat(feature.feature_added_weight) }} Kg</p>
                  </div>
                </div>
              </div>
            </div>
            <!-- STEERING WHEEL -->
            <div class="feature-section" v-if="steeringWheelFeatures.length > 0">
              <h3>Steering Wheel</h3>
              <div class="feature-options">
                <div v-for="feature in steeringWheelFeatures" :key="'SteeringWheel'+feature.feature_id" class="feature-card"
                  :class="{ 'selected': selectedFeaturesByType.steeringWheel === feature }" @click="selectFeatureByType('steeringWheel', feature)">
                  <div class="feature-info">
                    <h4>{{ feature.feature_name }}</h4>
                    <p v-if="feature.feature_added_power != 0">Added power: {{ feature.feature_added_power }} hp</p>
                    <p class="price">{{ parseFloat(feature.feature_price) }} €</p>
                    <p v-if="feature.feature_color">Color: {{ feature.feature_color }}</p>
                    <p v-if="feature.feature_added_weight != 0">Added weight: {{ parseFloat(feature.feature_added_weight) }} Kg</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- ECU REPROGRAMMING -->
            <div class="feature-section" v-if="ecuProgrammingFeatures.length > 0">
              <h3>ECU Programming</h3>
              <div class="feature-options">
                <div v-for="feature in ecuProgrammingFeatures" :key="'ECU Programming'+feature.feature_id" class="feature-card"
                     :class="{ 'selected': selectedFeaturesByType.ecuProgramming === feature }" @click="selectFeatureByType('ecuProgramming', feature)">
                  <div class="feature-info">
                    <h4>{{ feature.feature_name }}</h4>
                    <p v-if="feature.feature_added_power != 0">Added power: {{ feature.feature_added_power }} hp</p>
                    <p class="price">{{ parseFloat(feature.feature_price) }} €</p>
                    <p v-if="feature.feature_color">Color: {{ feature.feature_color }}</p>
                    <p v-if="feature.feature_added_weight != 0">Added weight: {{ parseFloat(feature.feature_added_weight) }} Kg</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- SUSPENSION -->
            <div class="feature-section" v-if="suspensionFeatures.length > 0">
              <h3>Suspension</h3>
              <div class="feature-options">
                <div v-for="feature in suspensionFeatures" :key="'Suspension'+feature.feature_id" class="feature-card"
                     :class="{ 'selected': selectedFeaturesByType.suspension === feature }" @click="selectFeatureByType('suspension', feature)">
                  <div class="feature-info">
                    <h4>{{ feature.feature_name }}</h4>
                    <p v-if="feature.feature_added_power != 0">Added power: {{ feature.feature_added_power }} hp</p>
                    <p class="price">{{ parseFloat(feature.feature_price) }} €</p>
                    <p v-if="feature.feature_color">Color: {{ feature.feature_color }}</p>
                    <p v-if="feature.feature_added_weight != 0">Added weight: {{ parseFloat(feature.feature_added_weight) }} Kg</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- OTHERS  -->
            <div class="feature-section" v-if="otherFeatures.length > 0">
              <h3>Other Features</h3>
              <div class="feature-options">
                <div v-for="feature in otherFeatures" :key="'Other'+feature.feature_id" class="feature-card"
                  :class="{ 'selected': selectedFeaturesTab.includes(feature)}" @click="toggleFeatureSelect(feature)">
                  <div class="feature-info">
                    <h4>{{ feature.feature_name }}</h4>
                    <p v-if="feature.feature_added_power">Added power: {{ feature.feature_added_power }} hp</p>
                    <p class="price">{{ parseFloat(feature.feature_price) }} €</p>
                    <p v-if="feature.feature_color">Color: {{ feature.feature_color }}</p>
                    <p v-if="feature.feature_added_weight">Added weight: {{ parseFloat(feature.feature_added_weight) }} Kg</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ADD TO CART  -->
          <div class="action-buttons">
            <button class="btn btn-warning" @click="addToCart()">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>

    <!-- CART CONFIRMATION  -->
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
      selectedFeaturesByType: {
        seats: null,
        spoilers: null,
        tires: null,
        steeringWheel: null,
        ecuProgramming : null,
        suspension: null,
      },
      selectedFeaturesTab: [],
      lastCustomId: 0,
      showCartConfirmation: false,
      selectedBrand: 'all',
      sortOption: 'none',
      availableStores: [],
    };
  },
  methods: {

    //LOAD CAR IMG FROM /src/medias/car_img/
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

    //GO TO CUSTOMIZE SECTION
    async goToCustomize(carId) {
      await this.getFeaturesForCar(carId);
      await this.$router.push(`/purchase/customize/${carId}`);
      await this.checkStoreAvailability();
    },

    //GET CARS DATA FROM CARSAPI
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
        this.refreshOneCar();
        this.loadLastCustomId();
      } catch (ex) {
        console.error('Error fetching data:', ex);
        alert('Failed to load cars. Please try again later.');
      }
    },

    //GET FEATURES FROM CARSAPI FOR ONE CAR
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
        console.log("this.getFeaturesForCar called.");
      } catch (ex) {
        console.error('Error fetching data:', ex);
        alert('Failed to load features. Please try again later.');
      }
    },

    //UPDATE THE CAR BY THE ID
    refreshOneCar() {
      if (this.$props.id === "all" || this.$props.id === "0") return;
      try {
        this.oneCar = this.cars.find(car => car.car_id == this.$props.id);
      } catch (ex) {
        console.error(ex);
      }
    },

    //GIVES THE LAST CUSTOM ID
    loadLastCustomId() {
      this.lastCustomId = JSON.parse(sessionStorage.getItem('lastCustomId')) || 0;
    },

    // SELECT A TYPICAL FEATURE ASKED
    selectFeatureByType(type, feature) {
      if (this.selectedFeaturesByType[type] === feature) {
        this.selectedFeaturesByType[type] = null;
      } else {
        this.selectedFeaturesByType[type] = feature;
      }
      this.checkStoreAvailability();
    },

    //ADDITION OF BASEPRICE & FEATURES PRICES
    calculateTotalPrice() {
      let basePrice = parseFloat(this.oneCar.car_base_price);
      let featurePrice = 0;

      // Add prices from type-specific features
      Object.values(this.selectedFeaturesByType).forEach(feature => {
        if (feature) {
          featurePrice += parseFloat(feature.feature_price);
        }
      });

      // Add prices from multi-select features
      this.selectedFeaturesTab.forEach(feature => {
        featurePrice += parseFloat(feature.feature_price);
      });

      return basePrice + featurePrice;
    },

    //ADD THE CUSTOM IN SESSIONSTORAGE WITH THE CORRECT ID
    addToCart() {
      const purchasedCar = JSON.parse(JSON.stringify(this.oneCar));
      purchasedCar.total_price = this.calculateTotalPrice();

      // Combine features from different selection methods
      purchasedCar.features = [
        ...Object.values(this.selectedFeaturesByType).filter(f => f !== null),
        ...this.selectedFeaturesTab
      ];

      purchasedCar.custom_id = this.getNextCustomId();
      let purchasedCars = JSON.parse(sessionStorage.getItem('purchasedCars')) || [];
      purchasedCars.push(purchasedCar);
      sessionStorage.setItem('purchasedCars', JSON.stringify(purchasedCars));
      this.showCartConfirmation = true;
    },

    //GIVE NEW CUSTOM ID & ADD IT TO THE COUNTER
    getNextCustomId() {
      this.lastCustomId += 1;
      sessionStorage.setItem('lastCustomId', JSON.stringify(this.lastCustomId));
      return this.lastCustomId;
    },

    //REDIRECT TO /purchase/list/all
    continueShopping() {
      this.showCartConfirmation = false;
      this.$router.push('/purchase/list/all');
    },

    //MANAGE FEATURE SELECTION
    toggleFeatureSelect(feature) {
      if (this.selectedFeaturesTab.includes(feature)) {   //ALREADY SELECTED
        this.selectedFeaturesTab = this.selectedFeaturesTab.filter(
          f => f.feature_id !== feature.feature_id
        );                                                //DESELECT IT
      } else {                                            //NOT SELECTED
        this.selectedFeaturesTab.push(feature);           //SELECT IT
      }
      this.checkStoreAvailability();
    },

    //SEARCH IN WHICH STORE IF THE CUSTOM IS AVAILABLE
    async checkStoreAvailability() {
      try {
        const selectedFeatures = [
          ...Object.values(this.selectedFeaturesByType).filter(f => f !== null),
          ...this.selectedFeaturesTab
        ];
        const featureIds = selectedFeatures.map(f => f.feature_id);

        const response = await axios.get(
          `http://localhost:9000/storeapi/available/${this.oneCar.car_id}`,
          { params: { features: featureIds.join(',') } }
        );
        this.availableStores = response.data;
        console.log('Available stores:', this.availableStores);
      } catch (error) {
        console.error('Error checking store availability:', error);
        this.availableStores = [];
      }
    }
  },

  //UPDATE THE STORE AVAILABILITY BY MAKING IT DIRECTLY VISIBLE FOR THE USER
  mounted() {
    this.getAllData();
    if (this.action === 'customize') {
      this.checkStoreAvailability();
    }
  },

  //HANDLE THE ID CHANGES & FEATURE SELECTION CHANGES
  watch: {
    id: {
      handler(newVal, oldVal) {
        this.refreshOneCar();
      },
      immediate: true
    },
    selectedFeaturesByType: {
      handler() {
        this.checkStoreAvailability();
      },
      deep: true
    },
    selectedFeaturesTab: {
      handler() {
        this.checkStoreAvailability();
      },
      deep: true
    }
  },
  computed: {

    //SEARCH THE SEATS FEATURES
    seatFeatures() {
      return this.features.filter(f =>
        f.feature_name.toLowerCase().includes('seat')
      );
    },

    //SEARCH THE SPOILERS FEATURES
    spoilerFeatures() {
      return this.features.filter(f =>
        f.feature_name.toLowerCase().includes('spoiler')
      );
    },

    //SEARCH THE TIRES FEATURES
    tireFeatures() {
      return this.features.filter(f =>
        f.feature_name.toLowerCase().includes('tire')
      );
    },

    //SEARCH THE STEERING WHEELS FEATURES
    steeringWheelFeatures() {
      return this.features.filter(f =>
        f.feature_name.toLowerCase().includes('steering') ||
        f.feature_name.toLowerCase().includes('wheel')
      );
    },

    //SEARCH ECU PROGRAMMING FEATURES
    ecuProgrammingFeatures() {
      return this.features.filter(f =>
        f.feature_name.toLowerCase().includes('ecu') ||
        f.feature_name.toLowerCase().includes('programming')
      );
    },

    //SEARCH THE SUSPENSIONS FEATURES
    suspensionFeatures() {
      return this.features.filter(f =>
        f.feature_name.toLowerCase().includes('suspension') ||
        f.feature_name.toLowerCase().includes('coilovers')
      );
    },

    //SEARCH THE OTHERS FEATURES NOT IN THE PREVIOUS ONES
    otherFeatures() {
      return this.features.filter(f =>
        !this.seatFeatures.includes(f) &&
        !this.spoilerFeatures.includes(f) &&
        !this.tireFeatures.includes(f) &&
        !this.steeringWheelFeatures.includes(f) &&
        !this.ecuProgrammingFeatures.includes(f)&&
        !this.suspensionFeatures.includes(f)
      );
    },

    //HANDLE THE BRAND FILTER & SORTING PRICE
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

    //GIVE EVERY BRANDS AVAILABLE
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

.btn-link{
  margin: 1%;
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

.store-availability-section {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  margin: 20px 0;
}

.store-availability-section h3 {
  color: #333;
  font-size: 1.2rem;
  margin-bottom: 15px;
  border-bottom: 2px solid #0077b6;
  padding-bottom: 5px;
  display: inline-block;
}

.store-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
  max-height: 300px;
  overflow-y: auto;
  padding: 10px;
}

.store-card {
  background: white;
  border-radius: 6px;
  padding: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.store-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.store-card h4 {
  color: #0077b6;
  font-size: 1.1rem;
  margin-bottom: 8px;
}

.store-details {
  font-size: 0.9rem;
}

.store-details p {
  margin: 4px 0;
  color: #666;
  display: flex;
  align-items: center;
}

.store-details i {
  margin-right: 8px;
  color: #0077b6;
  width: 16px;
}

.no-stores-message {
  background-color: #fff3f3;
  color: #d63031;
  padding: 12px;
  border-radius: 6px;
  text-align: center;
  margin: 10px 0;
  border: 1px solid #ffcdd2;
}

.store-list::-webkit-scrollbar {
  width: 8px;
}

.store-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.store-list::-webkit-scrollbar-thumb {
  background: #0077b6;
  border-radius: 4px;
}

.store-list::-webkit-scrollbar-thumb:hover {
  background: #005a8e;
}



@media (max-width: 768px) {
  .car-grid {
    grid-template-columns: 1fr;
  }

  .customization-header {
    flex-direction: column;
    text-align: center;
  }

  .feature-options {
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

  .store-list {
    grid-template-columns: 1fr;
    max-height: 400px;
  }

  .store-card {
    padding: 10px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .store-list {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
