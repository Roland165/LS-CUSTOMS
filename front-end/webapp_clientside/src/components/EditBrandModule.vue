<template>
  <div class="edit-brand">
    <div class="container mt-5">
      <h1 class="text-center mb-4">Edit Brands</h1>

      <template v-if="!id">
        <router-link class="btn btn-link" to="/admin">Back to DashBoard</router-link>

        <div class="brands-grid">
          <div v-for="brand in brands" :key="brand.brand_id" class="brand-card">
            <div class="brand-info">
              <h3>{{ brand.brand_name }}</h3>
              <p>Creation Date: {{ formatDate(brand.brand_creation_date) }}</p>
              <p>Creator: {{ brand.brand_creator }}</p>
              <router-link
                :to="`/edit-brand/${brand.brand_id}`"
                class="btn btn-primary"
              >
                Edit Brand
              </router-link>
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <router-link class="btn btn-link" to="/edit-brand">Back to Edit</router-link>
        <div class="edit-form" v-if="brandToEdit">
          <h2>Edit Brand: {{ brandToEdit.brand_name }}</h2>
          <form @submit.prevent="updateBrand">
            <div class="form-group">
              <label>Brand Name</label>
              <input type="text" v-model="brandToEdit.brand_name" class="form-control" required>
            </div>

            <div class="form-group">
              <label>Creation Date</label>
              <input type="date" v-model="brandToEdit.brand_creation_date" class="form-control" required>
            </div>

            <div class="form-group">
              <label>Creator</label>
              <input type="text" v-model="brandToEdit.brand_creator" class="form-control" required>
            </div>

            <div class="form-group">
              <label>Creation Place</label>
              <input type="text" v-model="brandToEdit.brand_creation_place" class="form-control" required>
            </div>

            <div class="form-group">
              <label>Revenue</label>
              <input type="number" v-model="brandToEdit.brand_revenue" class="form-control" required>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Update Brand</button>
              <router-link to="/edit-brand" class="btn btn-secondary">
                Cancel
              </router-link>
            </div>
          </form>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'EditBrandModule',
  props: {
    id: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      brands: [],
      brandToEdit: {
        brand_id: null,
        brand_name: '',
        brand_creation_date: new Date().toISOString().split('T')[0],
        brand_creator: '',
        brand_creation_place: '',
        brand_revenue: 0
      }
    };
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return '';
      return new Date(dateString).toLocaleDateString();
    },
    async fetchBrands() {
      try {
        const response = await axios.get('http://localhost:9000/brandsapi/list');
        this.brands = response.data;
      } catch (error) {
        console.error('Error fetching brands:', error);
        alert('Failed to load brands. Please try again.');
      }
    },
    async fetchBrandDetails(brandId) {
      try {
        const response = await axios.get(`http://localhost:9000/brandsapi/show/${brandId}`);
        console.log('Fetched brand details:', response.data);

        this.brandToEdit = {
          brand_id: response.data.brand_id,
          brand_name: response.data.brand_name || '',
          brand_creation_date: response.data.brand_creation_date ?
            new Date(response.data.brand_creation_date).toISOString().split('T')[0] :
            new Date().toISOString().split('T')[0],
          brand_creator: response.data.brand_creator || '',
          brand_creation_place: response.data.brand_creation_place || '',
          brand_revenue: response.data.brand_revenue || 0
        };
      } catch (error) {
        console.error('Error fetching brand details:', error);
        alert('Failed to fetch brand details');
      }
    },
    async updateBrand() {
      try {
        const brandData = {
          brand_name: this.brandToEdit.brand_name || '',
          brand_creation_date: this.brandToEdit.brand_creation_date || new Date().toISOString().split('T')[0],
          brand_creator: this.brandToEdit.brand_creator || '',
          brand_creation_place: this.brandToEdit.brand_creation_place || '',
          brand_revenue: this.brandToEdit.brand_revenue || 0
        };

        if (!brandData.brand_name.trim()) {
          alert('Brand name is required');
          return;
        }

        console.log('Sending update data:', brandData);

        const response = await axios.post(
          `http://localhost:9000/brandsapi/update/${this.brandToEdit.brand_id}`,
          brandData,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.success) {
          alert('Brand updated successfully');
          this.$router.push('/edit-brand');
        }
      } catch (error) {
        console.error('Update Error:', {
          message: error.message,
          response: error.response ? {
            data: error.response.data,
            status: error.response.status
          } : 'No response'
        });

        alert('Failed to update brand: ' +
          (error.response && error.response.data ?
            error.response.data.message :
            error.message)
        );
      }
    }
  },
  async created() {
    await this.fetchBrands();
    if (this.id) {
      await this.fetchBrandDetails(this.id);
    }
  },
  watch: {
    async '$route.params.id'(newId) {
      if (newId) {
        await this.fetchBrandDetails(newId);
      } else {
        this.brandToEdit = null;
      }
    }
  }
};
</script>

<style scoped>
.edit-brand {
  padding-top: 80px;
}

.brands-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 2rem 0;
}

.brand-card {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.brand-card:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
}

.brand-info {
  text-align: center;
}

.brand-info h3 {
  margin-bottom: 1rem;
}

.edit-form {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
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
</style>
