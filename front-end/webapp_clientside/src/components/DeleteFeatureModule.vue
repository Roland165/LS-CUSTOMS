<template>
  <div class="delete-feature-module" v-if="isAdminBool">
    <div class="container mt-5">
      <h1 class="text-center mb-4">Delete Features</h1>
      <router-link class="btn btn-link" to="/admin">Back to Dashboard</router-link>
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

          <div class="feature-actions">
            <button
              @click="confirmDeleteFeature(feature)" 
              class="btn btn-danger"
            >
              Delete Feature
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { updateIsAdminBool } from '../authfunctions';

export default {
  name: 'DeleteFeatureModule',
  data() {
    return {
      features: [],
      isAdminBool: false,
    }
  },
  methods: {
    async fetchFeatures() {
      try {
        // Fetch feature
        const featuresResponse = await axios.get('http://localhost:9000/featuresapi/list');
        this.features = featuresResponse.data
      } catch (error) {
        console.error('Error fetching feature:', error);
        alert('Failed to load feautre');
      }
    },
    async confirmDeleteFeature(feature) {
      const confirmDelete = confirm(`Are you sure you want to delete the feature "${feature.feature_name}"?`);

      if (confirmDelete) {
        try {
          const response = await axios.get(`http://localhost:9000/featuresapi/del/${parseInt(feature.feature_id)}`);

          if (response.data.success) {
            alert('Feature deleted successfully');  
            this.fetchFeatures();
          } else {
            alert(response.data.message || 'Failed to delete feature');
          }
        } catch (error) {
          console.error('Error deleting feature:', error);
          let errorMessage = 'Failed to delete feature';
          if (error.response && error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
          }
          alert(errorMessage);
        }
      }
    }
  },
  async created() {
    this.isAdminBool = (await updateIsAdminBool());
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
  font-weight: bold;
  color: white;
  cursor: pointer;margin: 1%;
  display: inline-block;
  text-decoration: none;
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
