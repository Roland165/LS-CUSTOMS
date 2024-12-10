<template>
  <div class="delete-brand-module" v-if="isAdminBool || true"> <!---OR True so that server does not crash because of too many requests-->
    <div class="container mt-5">
      <h1 class="text-center mb-4">Delete Brands</h1>
      <router-link class="btn btn-link" to="/admin">Back to Dashboard</router-link>
      <div v-if="brands.length === 0" class="no-brands-message">
        <p>No brands available to delete.</p>
      </div>

      <div v-else class="brands-list">
        <div
          v-for="brand in brands"
          :key="brand.brand_id"
          class="brand-card"
        >
          <div class="brand-info">
            <h3>{{ brand.brand_name }}</h3>
            <p>Revenue: {{ formatRevenue(brand.brand_revenue) }} Million €</p>
            <p>Creation Date: {{ formatDate(brand.brand_creation_date) }}</p>
            <p>Creator: {{ brand.brand_creator }}</p>
            <p>Creation Place: {{ brand.brand_creation_place }}</p>
          </div>

          <div class="brand-actions">
            <span
              v-if="brand.carCount > 0"
              class="cars-count-warning"
            >
              Cannot delete: {{ brand.carCount }} associated cars
            </span>

            <button
              @click="confirmDeleteBrand(brand)"
              :disabled="brand.carCount > 0"
              class="btn btn-danger"
            >
              Delete Brand
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
  name: 'DeleteBrandModule',
  data() {
    return {
      brands: [],
      isAdminBool: false,
    }
  },
  methods: {
    formatRevenue(revenue) {
      return revenue ? revenue.toLocaleString() : 'N/A';
    },
    formatDate(date) {
      return date ? new Date(date).toLocaleDateString() : 'N/A';
    },
    async fetchBrands() {
      try {
        // Fetch brands
        const brandsResponse = await axios.get('http://localhost:9000/brandsapi/list');

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

        this.brands = brandsWithCarCount;
      } catch (error) {
        console.error('Error fetching brands:', error);
        alert('Failed to load brands');
      }
    },
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
    }
  },
  async created() {
    this.isAdminBool = (await updateIsAdminBool());
    this.fetchBrands();
  }
}
</script>

<style scoped>
.delete-brand-module {
  padding-top: 80px;
}

.brands-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  padding: 20px;
}

.brand-card {
  background-color: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.brand-info h3 {
  margin-bottom: 0.5rem;
  color: #333;
}

.brand-info p {
  color: #666;
  margin: 0.25rem 0;
}

.brand-actions {
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
  cursor: pointer;
  margin: 1%;
  display: inline-block;
  text-decoration: none;
}

.btn:not(.btn-link){
  text-transform: uppercase;
}

.btn-danger {
  background-color: #dc3545;
  border: none;
}

.btn-danger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.no-brands-message {
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
  .brands-list {
    grid-template-columns: 1fr;
  }
}
</style>
