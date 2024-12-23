<template>
  <div class="admin-module">
    <div class="container mt-5">
      <h1 class="text-center mb-4">Admin Dashboard</h1>

      <div class="is-admin" v-if="isAdminBool">
        <div class="admin-actions">
          <div class="action-card" @click="goToAddCar">
            <h3>Add New Car</h3>
            <p>Expand our collection with a new vehicle</p>
            <router-link to="/add-car" class="btn btn-primary">Add Car</router-link>
          </div>

          <div class="action-card" @click="goToAddBrand">
            <h3>Add New Brand</h3>
            <p>Introduce a new automotive brand</p>
            <router-link to="/add-brand" class="btn btn-primary">Add Brand</router-link>
          </div>

          <div class="action-card" @click="goToAddFeature">
            <h3>Add New Feature</h3>
            <p>Add a new performance or esthetic feature</p>
            <router-link to="/add-feature" class="btn btn-primary">Add Feature</router-link>
          </div>

          <div class="action-card" @click="goToDeleteCar">
            <h3>Delete Car</h3>
            <p>Remove a vehicle from the collection</p>
            <router-link to="/delete-car" class="btn btn-danger">Delete Car</router-link>
          </div>

          <div class="action-card" @click="goToDeleteBrand">
            <h3>Delete Brand</h3>
            <p>Remove a brand from the database</p>
            <router-link to="/delete-brand" class="btn btn-danger">Delete Brand</router-link>
          </div>

          <div class="action-card" @click="goToDeleteFeature">
            <h3>Delete Feature</h3>
            <p>Remove a feature from the database</p>
            <router-link to="/delete-feature" class="btn btn-danger">Delete Feature</router-link>
          </div>
          <div class="action-card" @click="goToEditCar">
            <h3>Edit Car</h3>
            <p>Modify existing vehicle details</p>
            <router-link to="/edit-car" class="btn btn-success">Edit Car</router-link>
          </div>
          <div class="action-card" @click="goToEditBrand">
            <h3>Edit Brand</h3>
            <p>Modify existing brand details</p>
            <router-link to="/edit-brand" class="btn btn-success">Edit Brand</router-link>
          </div>
          <div class="action-card" @click="goToEditFeature">
            <h3>Edit Feature</h3>
            <p>Modify existing feature details</p>
            <router-link to="/edit-feature" class="btn btn-success">Edit Feature</router-link>
          </div>
        </div>
      </div>

      <div class="statistics-section mt-5">
        <h2 class="text-center mb-4">Quick Statistics</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <h4>Total Cars</h4>
            <p class="stat-number">{{ totalCars }}</p>
          </div>
          <div class="stat-card">
            <h4>Total Brands</h4>
            <p class="stat-number">{{ totalBrands }}</p>
          </div>
          <div class="stat-card">
            <h4>Total Features</h4>
            <p class="stat-number">{{ totalFeatures }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import {updateIsAdminBool, isLoggedIn} from "../authfunctions.js";

export default {
  name: 'AdminModule',
  data() {
    return {
      totalCars: 0,
      totalBrands: 0,
      totalFeatures: 0,
      isAdminBool: false,
    }
  },
  methods: {
    goToAddCar() {
      this.$router.push('/add-car');
    },
    goToAddBrand() {
      this.$router.push('/add-brand');
    },
    goToDeleteCar() {
      this.$router.push('/delete-car');
    },
    goToDeleteBrand() {
      this.$router.push('/delete-brand');
    },
    goToDeleteFeature() {
      this.$router.push('/delete-feature');
    },
    goToAddFeature() {
      this.$router.push('/add-feature');
    },
    goToEditCar(){
      this.$router.push('/edit-car');
    },
    goToEditBrand(){
      this.$router.push('/edit-brand');
    },
    goToEditFeature(){
      this.$router.push('/edit-feature');
    },
    async fetchStatistics() {
      try {
        // Fetch statistics (combined 3 requests into 1 to not crash the server)
        let arrayNum = await axios.get('http://localhost:9000/carsapi/getstats');

        this.totalCars = arrayNum.data.carsNum;
        this.totalBrands = arrayNum.data.brandsNum;
        this.totalFeatures = arrayNum.data.featuresNum;
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    },
  },
  async created() {
    this.isAdminBool = (await updateIsAdminBool());
    this.fetchStatistics();
  }
}
</script>

<style scoped>
.admin-module {
  padding-top: 80px;
}

.admin-actions {
  display: grid;
  grid-template-columns: 0.33fr 0.33fr 0.33fr;
  gap: 2rem;
  padding: 2rem 0;
}

.action-card {
  background: white;
  border-radius: 10px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.action-card:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

.action-card h3 {
  margin-bottom: 1rem;
  color: #333;
}

.action-card p {
  color: #666;
  margin-bottom: 1.5rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  text-transform: uppercase;
  font-weight: bold;
  text-decoration: none;
  color: white;
}

.btn-primary {
  background-color: #0077b6;
  border-color: #0077b6;
}

.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
}
.btn-success {
  background-color: #5cb85c;
  border-color: #5cb85c;
}

.statistics-section {
  background-color: #f8f9fa;
  padding: 2rem;
  border-radius: 10px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.stat-card h4 {
  color: #666;
  margin-bottom: 1rem;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #0077b6;
}

@media (max-width: 768px) {
  .admin-actions,
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
