<template>
  <div class="add-feature-module" v-if="isAdminBool">
    <div class="container mt-5">
      <h1 class="text-center mb-4">Add New Feature</h1>
      <router-link class="btn btn-link" to="/admin">Back to DashBoard</router-link>
      <div class="form-container">
        <form @submit.prevent="addFeature">

          <div class="form-group">
            <label for="featureName">Feature Name</label>
            <input
              type="text"
              id="featureName"
              v-model="featureData.feature_name"
              class="form-control"
              required
            >
          </div>

          <div class="form-group">
            <label for="featurePrice">Price (€)</label>
            <input
              type="number" 
              step="0.01"
              min="0"
              id="featurePrice"
              v-model="featureData.feature_price"
              class="form-control"
              required
            >
          </div>

          <div class="form-group">
            <label for="featureColor">Color</label>
            <input
              type="text"
              id="featureColor"
              v-model="featureData.feature_color"
              class="form-control"
              required
            >
          </div>

          <div class="form-group">
            <label for="featureAddedPower">Added power (hp)</label>
            <input
              type="number"
              min="0"
              step="1"
              id="featureAddedPower"
              v-model="featureData.feature_added_power"
              class="form-control"
              required
            >
          </div>

          <div class="form-group">
            <label for="featureAddedWeight">Added Weight (Kg)</label>
            <input
              type="number"
              step="0.01"
              id="featureAddedWeight"
              v-model="featureData.feature_added_weight"
              class="form-control"
              required
            >
          </div>

          <button type="submit" class="btn btn-primary">Add Feature</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { updateIsAdminBool } from '../authfunctions';

export default {
  name: 'AddFeatureModule',
  data() {
    return {
      featureData: {
        feature_name: '',
        feature_price: '',
        feature_color: '',
        feature_added_power: '',
        feature_added_weight: ''
      },
      isAdminBool: false,
    }
  },
  methods: {
    async addFeature() {
      try {
        console.log('Sending feature data:', this.featureData);
        const response = await axios.post('http://localhost:9000/featuresapi/add', this.featureData);

        if (response.data.success) {
          alert('Feature added successfully!');
          this.featureData = {
            feature_name: '',
            feature_price: '',
            feature_color: '',
            feature_added_power: '',
            feature_added_weight: ''
          };
          //this.$router.push('/admin');
        } else {
          alert(response.data.message || 'Failed to add feature');
        }
      } catch (error) {
        console.error('Error adding feature:', error);
        let errorMessage = 'Failed to add feature';
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
        alert(errorMessage);
      }
    }
  },
  async created() {
      this.isAdminBool = (await updateIsAdminBool());
  }
}
</script>

<style scoped>
.add-feature-module {
  padding-top: 80px;
}

.btn-link{
  padding: 8px 16px;
}

.form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: bold;
}

.form-control {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

.btn {
  display: inline-block;
  padding: 0.75rem;
  background-color: #0077b6;
  color: white;
  border: none;
  text-decoration: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin: 1%;
}

.btn:hover {
  background-color: #005f92;
}

@media (max-width: 768px) {
  .form-container {
    margin: 0 1rem;
  }
}
</style>
