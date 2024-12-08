<template>
  <div class="edit-car">
    <div class="container mt-5">
      <h1 class="text-center mb-4">Edit Cars</h1>

      <template v-if="!id">
        <router-link class="btn btn-link" to="/admin">Back to DashBoard</router-link>
        <div class="filters-section mb-4">
          <div class="filter-controls">
            <div class="filter-group">
              <label for="brand-filter">Filter by Brand:</label>
              <select id="brand-filter" v-model="selectedBrand" class="form-control">
                <option value="all">All Brands</option>
                <option v-for="brand in availableBrands" :key="brand" :value="brand">
                  {{ brand }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="car-grid">
          <div v-for="car in filteredCars" :key="car.car_id" class="car-card">
            <div class="car-image">
              <img :src="getCarImage(car)" :alt="car.brand_name + ' ' + car.car_name">
            </div>
            <div class="car-info">
              <h3>{{ car.brand_name }} {{ car.car_name }}</h3>
              <p>Base Price: {{ car.car_base_price }}€</p>
              <router-link :to="`/edit-car/${car.car_id}`" class="btn btn-primary"> Edit Car </router-link>
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <router-link class="btn btn-link" to="/edit-car">Back to Edit</router-link>
        <div class="edit-form" v-if="carToEdit">
          <h2>Edit Car: {{ carToEdit.brand_name }} {{ carToEdit.car_name }}</h2>
          <form @submit.prevent="updateCar">

            <div class="form-group">
              <label>Base Price (€)</label>
              <input type="number" v-model="carToEdit.car_base_price" class="form-control" required>
            </div>

            <div class="form-group">
              <label>Base Power (HP)</label>
              <input type="number" v-model="carToEdit.car_base_power" class="form-control" required>
            </div>

            <div class="form-group">
              <label>Base Weight (kg)</label>
              <input type="number" v-model="carToEdit.car_base_weight" class="form-control" required>
            </div>

            <div class="form-group">
              <label>Number of Seats</label>
              <input type="number" v-model="carToEdit.car_seat_num" class="form-control" required>
            </div>

            <div class="form-group">
              <label>Release Date</label>
              <input type="date" v-model="carToEdit.car_creation_date" class="form-control" required>
            </div>

            <div class="form-group">
              <label>Car Image</label>
              <input type="file" @change="handleImageUpload" class="form-control" accept="image/*">
              <div class="image-preview" v-if="imagePreview">
                <img :src="imagePreview" alt="Preview">
              </div>
              <div class="current-image" v-else-if="carToEdit">
                <img :src="getCarImage(carToEdit)" :alt="carToEdit.car_name">
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Update Car</button>
              <router-link to="/edit-car" class="btn btn-secondary">
                Back to List
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
  name: 'EditCarModule',
  props: {
    id: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      carToEdit: {
        car_id: null,
        brand_id: null,
        car_name: '',
        car_seat_num: null,
        car_creation_date: '',
        car_base_power: null,
        car_base_weight: null,
        car_base_price: null
      },
      cars: [],
      brands: [],
      selectedBrand: 'all',
      newImageFile: null,
      imagePreview: null
    }
  },
  computed: {
    availableBrands() {
      return [...new Set(this.cars.map(car => car.brand_name))];
    },
    filteredCars() {
      let result = [...this.cars];
      if (this.selectedBrand !== 'all') {
        result = result.filter(car => car.brand_name === this.selectedBrand);
      }
      return result;
    }
  },
  methods: {
    getCarImage(car) {
      try {
        const formattedBrand = car.brand_name.split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join('');
        const formattedModel = car.car_name.replace(/[\s-()]/g, '');
        const imageName = `${formattedBrand}_${formattedModel}_img.jpg`;
        return require(`@/medias/car_img/${imageName}`);
      } catch (error) {
        console.error('Image not found:', error);
        return require('@/medias/default_img.jpg');
      }
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file && file.type.startsWith('image/')) {
        this.newImageFile = file;
        const reader = new FileReader();
        reader.onload = e => {
          this.imagePreview = e.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please select a valid image file');
        event.target.value = '';
        this.imagePreview = null;
        this.newImageFile = null;
      }
    },

    async fetchCars() {
      try {
        const response = await axios.get('http://localhost:9000/carsapi/list');
        this.cars = response.data;
      } catch (error) {
        console.error('Error fetching cars:', error);
        alert('Failed to load cars. Please try again.');
      }
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

    async fetchCarDetails(carId) {
      try {
        const response = await axios.get(`http://localhost:9000/carsapi/show/${carId}`);
        console.log('Fetched car details:', response.data);

        const date = new Date(response.data.car_creation_date);
        const formattedDate = date.toISOString().split('T')[0];

        this.carToEdit = {
          ...response.data,
          car_creation_date: formattedDate
        };

        console.log('Formatted date:', formattedDate);
      } catch (error) {
        console.error('Error fetching car details:', error);
        alert('Failed to fetch car details');
      }
    },

    async updateCar() {
      try {
        const formData = new FormData();

        const carData = {
          brand_id: parseInt(this.carToEdit.brand_id),
          car_name: this.carToEdit.car_name,
          car_seat_num: parseInt(this.carToEdit.car_seat_num),
          car_creation_date: this.carToEdit.car_creation_date,
          car_base_power: parseInt(this.carToEdit.car_base_power),
          car_base_weight: parseFloat(this.carToEdit.car_base_weight),
          car_base_price: parseFloat(this.carToEdit.car_base_price)
        };

        const selectedBrand = this.brands.find(b => b.brand_id === this.carToEdit.brand_id);
        const brandName = selectedBrand ? selectedBrand.brand_name : 'Unknown';

        if (this.newImageFile) {
          const formattedBrand = brandName.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join('');
          const formattedModel = this.carToEdit.car_name.replace(/[\s-()]/g, '');
          const newFileName = `${formattedBrand}_${formattedModel}_img.jpg`;

          const newFile = new File([this.newImageFile], newFileName, {
            type: this.newImageFile.type
          });

          formData.append('image', newFile);
        }

        Object.keys(carData).forEach(key => {
          formData.append(key, carData[key]);
        });

        const response = await axios.post(
          `http://localhost:9000/carsapi/update/${this.carToEdit.car_id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        if (response.data.success) {
          alert('Car updated successfully');
          this.$router.push('/edit-car');
        }
      } catch (error) {
        console.error('Update Error:', {
          message: error.message,
          response: error.response ? {
            data: error.response.data,
            status: error.response.status
          } : 'No response',
          request: error.request ? 'Request made' : 'No request'
        });

        alert('Failed to update car: ' +
          (error.response && error.response.data ?
            error.response.data.message :
            error.message));
      }
    }
  },

  async created() {
    await this.fetchCars();
    await this.fetchBrands();

    if (this.id) {
      await this.fetchCarDetails(this.id);
    }
  },
  watch: {
    async '$route.params.id'(newId) {
      if (newId) {
        await this.fetchCarDetails(newId);
      } else {
        this.carToEdit = null;
      }
    }
  }
}
</script>

<style scoped>
.edit-car {
  padding-top: 80px;
}

.car-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 2rem 0;
}

.car-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.car-card:hover {
  transform: scale(1.05);
}

.car-image {
  width: 100%;
  height: 300px;
  overflow: hidden;
}

.car-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.car-info {
  padding: 1rem;
  text-align: center;
}

.car-info h3 {
  margin-bottom: 1rem;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  max-width: 500px;
  width: 90%;
}

.modal-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.filters-section {
  margin-bottom: 2rem;
}

.filter-controls {
  display: flex;
  justify-content: center;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 1rem;
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
