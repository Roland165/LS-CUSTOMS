<template>
  <div class="admin-module">
    <div class="container mt-5">
      <h1 class="text-center mb-4">Admin Dashboard</h1>

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

export default {
  name: 'AdminModule',
  data() {
    return {
      totalCars: 0,
      totalBrands: 0,
      totalFeatures: 0
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
    async fetchStatistics() {
      try {
        // Fetch cars
        const carsResponse = await axios.get('http://localhost:9000/carsapi/list');
        this.totalCars = carsResponse.data.length;

        // Fetch brands
        const brandsResponse = await axios.get('http://localhost:9000/brandsapi/list');
        this.totalBrands = brandsResponse.data.length;

        // Fetch features (you might need to create an endpoint for this)
        const featuresResponse = await axios.get('http://localhost:9000/carsapi/features');
        this.totalFeatures = featuresResponse.data.length;
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    }
  },
  created() {
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
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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
}

.btn-primary {
  background-color: #0077b6;
  border-color: #0077b6;
}

.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
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
