<template>
  <div class="add-brand">
    <div class="container mt-5">
      <div class="header-section mb-5">
        <h1 class="text-center">Add New Brand</h1>
        <p class="text-center">
          <router-link class="btn btn-link" to="/purchase/list/all">Back to the list</router-link>
        </p>
      </div>

      <div class="add-brand-form">
        <form @submit.prevent="addBrand" class="mt-4">
          <div class="form-section">
            <h3 class="section-title">Brand Details</h3>

            <div class="form-group mb-4">
              <label for="brand-name">Brand Name:</label>
              <input
                type="text"
                id="brand-name"
                v-model="newBrand.brand_name"
                class="form-control"
                required
                placeholder="e.g., Ferrari, Porsche"
              >
            </div>

            <div class="form-group mb-4">
              <label for="brand-country">Country of Origin:</label>
              <input
                type="text"
                id="brand-country"
                v-model="newBrand.brand_country"
                class="form-control"
                required
                placeholder="e.g., Italy, Germany"
              >
            </div>

            <div class="form-group mb-4">
              <label for="brand-founded">Founded Year:</label>
              <input
                type="number"
                id="brand-founded"
                v-model="newBrand.brand_founded"
                class="form-control"
                required
                min="1800"
                max="2023"
              >
            </div>
          </div>

          <div class="submit-section">
            <button type="submit" class="btn btn-primary">Add Brand</button>
            <button type="button" @click="resetForm" class="btn btn-secondary">Reset</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  name: 'AddBrandModule',
  data() {
    return {
      newBrand: {
        brand_name: '',
        brand_country: '',
        brand_founded: null
      }
    }
  },
  methods: {
    resetForm() {
      this.newBrand = {
        brand_name: '',
        brand_country: '',
        brand_founded: null
      };
    },
    async addBrand() {
      try {
        console.log('Sending brand data:', this.newBrand); // Add this for debugging

        const response = await axios.post('http://localhost:9000/carsapi/add-brand', this.newBrand, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        console.log('Response:', response.data); // Add this for debugging

        if (response.data.success) {
          alert('Brand added successfully!');
          this.$router.push('/purchase/list/all');
        }
      } catch (error) {
        console.error('Error adding brand:', error);
        alert('Failed to add brand. Please try again.');
      }
    }
  }
}
</script>

<style scoped>
.add-brand {
  padding-top: 80px;
  padding-bottom: 40px;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.header-section {
  text-align: center;
  margin-bottom: 2rem;
}

.header-section h1 {
  color: #333;
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.add-brand-form {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #eee;
}

.section-title {
  color: #0077b6;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.form-group label {
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
}

.form-control {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 0.75rem;
  transition: border-color 0.3s ease;
}

.logo-preview {
  max-width: 300px;
  margin: 0 auto;
}

.logo-preview img {
  max-width: 100%;
  max-height: 200px;
  object-fit: contain;
  border-radius: 5px;
}

.submit-section {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 2rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #0077b6;
  border: none;
}

.btn-primary:hover {
  background-color: #005a8e;
  transform: translateY(-2px);
}

.btn-secondary {
  background-color: #6c757d;
  border: none;
}

.btn-secondary:hover {
  background-color: #5a6268;
  transform: translateY(-2px);
}
</style>
