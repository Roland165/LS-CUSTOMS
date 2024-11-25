<template>
  <div class="add-car">
    <div class="container mt-5">
      <div class="header-section mb-5">
        <h1 class="text-center">Add New Car</h1>
        <p class="text-center">
          <router-link class="btn btn-link" to="/purchase/list/all">Back to the list</router-link>
        </p>
      </div>

      <div class="add-car-form">
        <form @submit.prevent="addCar" class="mt-4">
          <!-- Brand and Model Section -->
          <div class="form-section">
            <h3 class="section-title">Car Identity</h3>
            <div class="form-group mb-4">
              <label for="brand">Brand:</label>
              <select id="brand" v-model="newCar.brand_id" class="form-control custom-select" required>
                <option value="" disabled>Select a brand</option>
                <option v-for="brand in brands" :key="brand.brand_id" :value="brand.brand_id">
                  {{ brand.brand_name }}
                </option>
              </select>
            </div>

            <div class="form-group mb-4">
              <label for="model">Model Name:</label>
              <input type="text" id="model" v-model="newCar.car_name" class="form-control" required
                     placeholder="e.g., 911 Turbo S">
            </div>
          </div>

          <!-- Specifications Section -->
          <div class="form-section">
            <h3 class="section-title">Technical Specifications</h3>
            <div class="specs-grid">
              <div class="form-group">
                <label for="seats">Seats</label>
                <input type="number" id="seats" v-model="newCar.car_seat_num" class="form-control"
                       required min="1" max="9">
              </div>

              <div class="form-group">
                <label for="power">Power (HP)</label>
                <input type="number" id="power" v-model="newCar.car_base_power" class="form-control"
                       required min="0">
              </div>

              <div class="form-group">
                <label for="weight">Weight (kg)</label>
                <input type="number" id="weight" v-model="newCar.car_base_weight" class="form-control"
                       required min="0">
              </div>

              <div class="form-group">
                <label for="price">Price (€)</label>
                <input type="number" id="price" v-model="newCar.car_base_price" class="form-control"
                       required min="0">
              </div>
            </div>

            <div class="form-group mb-4">
              <label for="creation_date">Release Date:</label>
              <input type="date" id="creation_date" v-model="newCar.car_creation_date" class="form-control" required>
            </div>
          </div>

          <!-- Image Upload Section -->
          <div class="form-section">
            <h3 class="section-title">Car Image</h3>
            <div class="image-upload-container">
              <div class="form-group">
                <label for="carImage" class="upload-label">
                  <i class="fas fa-cloud-upload-alt"></i>
                  <span>Choose an image</span>
                </label>
                <input type="file" id="carImage" @change="handleFileUpload" class="form-control"
                       accept="image/*" required>
              </div>
              <div class="image-preview" v-if="imagePreview">
                <img :src="imagePreview" alt="Preview">
              </div>
              <small class="text-muted">Image will be saved as: {{ getImageName }}</small>
            </div>
          </div>

          <!-- Submit Section -->
          <div class="submit-section">
            <button type="submit" class="btn btn-primary">Add Car</button>
            <router-link to="/purchase/list/all" class="btn btn-secondary">Cancel</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AddCarModule',
  data() {
    return {
      brands: [],
      previewImage: null,
      newCar: {
        brand_id: '',
        car_name: '',
        car_seat_num: 2,
        car_creation_date: '',
        car_base_power: 0,
        car_base_weight: 0,
        car_base_price: 0,
        imageFile: null
      }
    }
  },
  computed: {
    getImageName() {
      if (!this.newCar.brand_id || !this.newCar.car_name) return '';
      const brand = this.brands.find(b => b.brand_id === this.newCar.brand_id);
      if (!brand) return '';

      const formattedBrand = brand.brand_name.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
      const formattedModel = this.newCar.car_name.replace(/[\s-()]/g, '');
      return `${formattedBrand}_${formattedModel}_img.jpg`;
    }
  },
  methods: {
    async fetchBrands() {
      try {
        const response = await axios.get('http://localhost:9000/carsapi/brands');
        this.brands = response.data;
      } catch (error) {
        console.error('Error fetching brands:', error);
        alert('Failed to load brands. Please try again.');
      }
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file && file.type.startsWith('image/')) {
        this.newCar.imageFile = file;

        // Create image preview
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewImage = e.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please select a valid image file');
        event.target.value = '';
        this.previewImage = null;
      }
    },
    async addCar() {
      try {
        if (!this.newCar.imageFile) {
          alert('Please select an image file');
          return;
        }
        const newFile = new File([this.newCar.imageFile], this.getImageName, {
          type: this.newCar.imageFile.type
        });
        const formData = new FormData();
        Object.keys(this.newCar).forEach(key => {
          if (key !== 'imageFile') {
            formData.append(key, this.newCar[key]);
          }
        });
        formData.append('image', newFile);

        const response = await axios.post('http://localhost:9000/carsapi/add-car', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.data.success) {
          alert('Car added successfully!');
          this.$router.push('/purchase/list/all');
        }
      } catch (error) {
        console.error('Error adding car:', error);
        alert('Failed to add car. Please try again.');
      }
    }
  },
  handleFileUpload(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.newCar.imageFile = file;
      // Create image preview
      const reader = new FileReader();
      reader.onload = e => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file');
      event.target.value = '';
      this.imagePreview = null;
    }
  },
  created() {
    this.fetchBrands();
  }
}
</script>
<style scoped>
.add-car {
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

.add-car-form {
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

.specs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
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

.form-control:focus {
  border-color: #0077b6;
  box-shadow: 0 0 0 0.2rem rgba(0, 119, 182, 0.25);
}

.custom-select {
  height: 45px;
}

.image-upload-container {
  text-align: center;
  padding: 2rem;
  border: 2px dashed #ddd;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.upload-label {
  display: block;
  cursor: pointer;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.upload-label:hover {
  background: #e9ecef;
}

.image-preview {
  margin-top: 1rem;
  max-width: 300px;
  margin: 1rem auto;
}

.image-preview img {
  width: 100%;
  height: auto;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

.text-muted {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .add-car-form {
    margin: 0 1rem;
    padding: 1rem;
  }

  .specs-grid {
    grid-template-columns: 1fr;
  }

  .submit-section {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    margin-bottom: 0.5rem;
  }
}
</style>
