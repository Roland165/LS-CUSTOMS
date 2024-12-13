<template>
  <div class="edit-feature" v-if="isAdminBool">
    <div class="container mt-5">
      <h1 class="text-center mb-4">Edit features</h1>

      <template v-if="!id">
        <router-link class="btn btn-link" to="/admin">Back to DashBoard</router-link>

        <div class="features-grid">
          <div v-for="feature in features" :key="feature.feature_id" class="feature-card">
            <div class="feature-info">
              <h3>{{ feature.feature_name }}</h3>
              <p>Price: {{ feature.feature_price }} €</p>
              <p>Color: {{ (feature.feature_color ? feature.feature_color : "None") }}</p>
              <router-link
                :to="`/edit-feature/${feature.feature_id}`"
                class="btn btn-primary"
              >
                Edit feature
              </router-link>
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <router-link class="btn btn-link" to="/edit-feature">Back to Edit</router-link>
        <div class="edit-form" v-if="featureToEdit">
          <h2>Edit feature: {{ featureToEdit.feature_name }}</h2>
          <form @submit.prevent="updatefeature">
            <div class="form-group">
              <label>Feature Name</label>
              <input type="text" v-model="featureToEdit.feature_name" class="form-control" required>
            </div>

            <div class="form-group">
              <label>Price</label>
              <input type="number" step="0.01" v-model="featureToEdit.feature_price" class="form-control" required>
              (€)
            </div>

            <div class="form-group">
              <label>Color</label>
              <input type="text" v-model="featureToEdit.feature_color" class="form-control" required>
            </div>

            <div class="form-group">
              <label>Added Power</label>
              <input type="number" v-model="featureToEdit.feature_added_power" class="form-control" required>
              (hp)
            </div>

            <div class="form-group">
              <label>Added Weight</label>
              <input type="number" step="0.01" v-model="featureToEdit.feature_added_weight" class="form-control" required>
              (Kg)
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Update Feature</button>
              <router-link to="/edit-feature" class="btn btn-secondary">
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
import { updateIsAdminBool } from '../authfunctions';

export default {
  name: 'EditfeatureModule',
  props: {
    id: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      features: [],
      featureToEdit: {
        feature_id: null,
        feature_name: '',
        feature_price: 0,
        feature_color: '',
        feature_added_power: 0,
        feature_added_weight: 0
      },
      isAdminBool: false,
    };
  },
  methods: {
    async fetchfeatures() {
      try {
        const response = await axios.get('http://localhost:9000/featuresapi/list');
        this.features = response.data;
      } catch (error) {
        console.error('Error fetching features:', error);
        alert('Failed to load features. Please try again.');
      }
    },
    async fetchfeatureDetails(featureId) {
      try {
        const response = await axios.get(`http://localhost:9000/featuresapi/show/${featureId}`);

        console.log('Raw response data:', response.data);

        this.featureToEdit = {
          feature_id: response.data.feature_id || null,
          feature_name: response.data.feature_name || '',
          feature_price: response.data.feature_price,
          feature_color: response.data.feature_color || '',
          feature_added_power: response.data.feature_added_power || '',
          feature_added_weight: response.data.feature_added_weight || 0
        };

        console.log('Processed featureToEdit:', this.featureToEdit);
      } catch (error) {
        console.error('Error fetching feature details:', error);
      }
    },
    async updatefeature() {
      try {
        const featureData = {
          feature_name: this.featureToEdit.feature_name.trim(),
          feature_price: this.featureToEdit.feature_price,
          feature_color: this.featureToEdit.feature_color.trim(),
          feature_added_power: this.featureToEdit.feature_added_power.trim(),
          feature_added_weight: this.featureToEdit.feature_added_weight
        };

        if (!featureData.feature_name) {
          alert('feature name is required');
          return;
        }

        const response = await axios.post(
          `http://localhost:9000/featuresapi/update/${this.featureToEdit.feature_id}`,
          featureData,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.success) {
          alert('feature updated successfully');
          this.$router.push('/edit-feature');
        }
      } catch (error) {
        console.error('Update Error:', error);
        alert('Failed to update feature: ' +
          (error.response && error.response.data ?
            error.response.data.message :
            error.message)
        );
      }
    }
  },
  async created() {
    this.isAdminBool = (await updateIsAdminBool())
    await this.fetchfeatures();
    if (this.id) {
      await this.fetchfeatureDetails(this.id);
    }
  },
  watch: {
    async '$route.params.id'(newId) {
      if (newId) {
        await this.fetchfeatureDetails(newId);
      } else {
        this.featureToEdit = {
          feature_id: null,
          feature_name: '',
          feature_price: 0,
          feature_color: '',
          feature_added_power: 0,
          feature_added_weight: 0
        };
      }
    }
  }
};
</script>

<style scoped>
.edit-feature {
  padding-top: 80px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 2rem 0;
}

.feature-card {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
}

.feature-info {
  text-align: center;
}

.feature-info h3 {
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
