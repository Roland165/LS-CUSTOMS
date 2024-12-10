<template>
  <div class="add-brand-module" v-if="isAdminBool">
    <div class="container mt-5">
      <h1 class="text-center mb-4">Add New Brand</h1>
      <router-link class="btn btn-link" to="/admin">Back to Dashboard</router-link>
      <div class="form-container">
        <form @submit.prevent="addBrand">
          <div class="form-group">
            <label for="brandName">Brand Name</label>
            <input
              type="text"
              id="brandName"
              v-model="brandData.brand_name"
              class="form-control"
              required
            >
          </div>

          <div class="form-group">
            <label for="brandRevenue">Brand Revenue</label>
            <input
              type="number"
              id="brandRevenue"
              v-model="brandData.brand_revenue"
              class="form-control"
              required
            >
          </div>

          <div class="form-group">
            <label for="brandCreationDate">Creation Date</label>
            <input
              type="date"
              id="brandCreationDate"
              v-model="brandData.brand_creation_date"
              class="form-control"
              required
            >
          </div>

          <div class="form-group">
            <label for="brandCreator">Creator</label>
            <input
              type="text"
              id="brandCreator"
              v-model="brandData.brand_creator"
              class="form-control"
              required
            >
          </div>

          <div class="form-group">
            <label for="brandCreationPlace">Creation Place</label>
            <input
              type="text"
              id="brandCreationPlace"
              v-model="brandData.brand_creation_place"
              class="form-control"
              required
            >
          </div>

          <button type="submit" class="btn btn-primary">Add Brand</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { updateIsAdminBool } from '../authfunctions';

export default {
  name: 'AddBrandModule',
  data() {
    return {
      brandData: {
        brand_name: '',
        brand_revenue: '',
        brand_creation_date: '',
        brand_creator: '',
        brand_creation_place: ''
      },
      isAdminBool: false,
    }
  },
  methods: {
    async addBrand() {
      try {
        console.log('Sending brand data:', this.brandData);
        const response = await axios.post('http://localhost:9000/brandsapi/add', this.brandData);

        if (response.data.success) {
          alert('Brand added successfully!');
          this.brandData = {
            brand_name: '',
            brand_revenue: '',
            brand_creation_date: '',
            brand_creator: '',
            brand_creation_place: ''
          };
          this.$router.push('/admin');
        } else {
          alert(response.data.message || 'Failed to add brand');
        }
      } catch (error) {
        console.error('Error adding brand:', error);
        let errorMessage = 'Failed to add brand';
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
        alert(errorMessage);
      }
    },
  },
  async created() {
      this.isAdminBool = (await updateIsAdminBool());
  }
}
</script>

<style scoped>
.add-brand-module {
  padding-top: 80px;
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
  padding: 0.75rem;
  background-color: #0077b6;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin: 1%;
  display: inline-block;
  text-decoration: none;
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
