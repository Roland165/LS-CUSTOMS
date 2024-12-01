<template>
  <div class="delete-feature-module">
    <div class="container mt-5">
      <h1 class="text-center mb-4">Delete Features</h1>
      <router-link class="btn btn-link" to="/admin">Back to DashBoard</router-link>
      <div v-if="features.length === 0" class="no-features-message">
        <p>No features available to delete.</p>
      </div>

      <div v-else class="features-list">
        <div
          v-for="feature in features"
          :key="feature.feature_id"
          class="feature-card"
        >
          <div class="feature-info">
            <h3>{{ feature.feature_name }}</h3>
            <p>Price: {{ parseFloat(feature.feature_price) }} €</p>
            <p>Color: {{ String(feature.feature_color) }}</p>
            <p>Added power: {{ feature.feature_added_power }} hp</p>
            <p>Added weight: {{ parseFloat(feature.feature_added_weight) }} Kg</p>
          </div>

          <!--
          <div class="feature-actions">
            <span
              v-if="brand.carCount > 0"
              class="cars-count-warning"
            >
              Cannot delete: {{ brand.carCount }} associated cars
            </span>

            <button
              @click="confirmDeleteFeature(feature)" 
              :disabled="brand.carCount > 0"
              class="btn btn-danger"
            >  TODO: create confirmDeleteFeature 
              Delete Feature
            </button>
          </div>
          -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'DeleteFeatureModule',
  data() {
    return {
      features: []
    }
  },
  methods: {
    formatRevenue(revenue) {
      return revenue ? revenue.toLocaleString() : 'N/A';
    },
    async fetchFeatures() {
      try {
        // Fetch feature
        const featuresResponse = await axios.get('http://localhost:9000/featuresapi/list');

        /*
        // Fetch cars for each brand to check associations
        const brandsWithCarCount = await Promise.all(
          brandsResponse.data.map(async (brand) => {
            try {
              const carsResponse = await axios.get(`http://localhost:9000/brandsapi/show/${brand.brand_id}/cars`);
              const associatedCars = carsResponse.data

              return {
                ...brand,
                carCount: associatedCars.length
              };
            } catch (error) {
              console.error(`Error fetching cars for brand ${brand.brand_id}:`, error);
              return {
                ...brand,
                carCount: 0
              };
            }
          })
        );
        */

        console.log(featuresResponse);
        this.features = featuresResponse.data
      } catch (error) {
        console.error('Error fetching brands:', error);
        alert('Failed to load brands');
      }
    },/*
    async confirmDeleteBrand(brand) {
      const confirmDelete = confirm(`Are you sure you want to delete the brand "${brand.brand_name}"?`);

      if (confirmDelete) {
        try {
          const response = await axios.delete(`http://localhost:9000/brandsapi/del/${brand.brand_id}`);

          if (response.data.success) {
            alert('Brand deleted successfully');
            this.fetchBrands();
          } else {
            alert(response.data.message || 'Failed to delete brand');
          }
        } catch (error) {
          console.error('Error deleting brand:', error);
          let errorMessage = 'Failed to delete brand';
          if (error.response && error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
          }
          alert(errorMessage);
        }
      }
    }*/
  },
  created() {
    this.fetchFeatures();
  },
}

</script>

<style scoped>
.delete-feature-module {
  padding-top: 80px;
}

.features-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  padding: 20px;
}

.feature-card {
  background-color: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.feature-info h3 {
  margin-bottom: 0.5rem;
  color: #333;
}

.feature-info p {
  color: #666;
  margin: 0.25rem 0;
}

.feature-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;
}

.cars-count-warning {
  color: #dc3545;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 5px;
  text-transform: uppercase;
  font-weight: bold;
  color: white;
  cursor: pointer;
}

.btn-danger {
  background-color: #dc3545;
  border: none;
}

.btn-danger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.no-features-message {
  text-align: center;
  color: #666;
  padding: 2rem;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.btn-link {
  display: inline-block;
  background-color: #0077b6;
  color: #fff;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
  margin: 1%;
}
.btn-link:hover {
  background-color: #005a8e;
}
@media (max-width: 768px) {
  .features-list {
    grid-template-columns: 1fr;
  }
}
</style>
