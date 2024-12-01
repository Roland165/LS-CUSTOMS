<template>
  <div class="delete-car">
    <div class="container mt-5">
      <h1 class="text-center mb-4">Delete Cars</h1>
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
            <button
              class="btn btn-danger"
              @click="confirmDeleteCar(car)"
            >
              Delete Car
            </button>
          </div>
        </div>
      </div>
      <div v-if="carToDelete" class="modal">
        <div class="modal-content">
          <h2>Confirm Deletion</h2>
          <p>Are you sure you want to delete the {{ carToDelete.brand_name }} {{ carToDelete.car_name }}?</p>
          <div class="modal-buttons">
            <button class="btn btn-danger" @click="deleteCar">Yes, Delete</button>
            <button class="btn btn-secondary" @click="carToDelete = null">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import path from 'path';

export default {
  name: 'DeleteModule',
  data() {
    return {
      cars: [],
      carToDelete: null,
      selectedBrand: 'all'
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
    async fetchCars() {
      try {
        const response = await axios.get('http://localhost:9000/carsapi/list');
        this.cars = response.data;
      } catch (error) {
        console.error('Error fetching cars:', error);
        alert('Failed to load cars. Please try again.');
      }
    },
    confirmDeleteCar(car) {
      this.carToDelete = car;
    },
    async deleteCar() {
      if (!this.carToDelete) return;

      try {
        const deleteResponse = await axios.get(`http://localhost:9000/carsapi/del/${this.carToDelete.car_id}`);

        if (deleteResponse.data.rowsDeleted > 0) {
          // Remove the image file
          const formattedBrand = this.carToDelete.brand_name.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join('');
          const formattedModel = this.carToDelete.car_name.replace(/[\s-()]/g, '');
          const imageName = `${formattedBrand}_${formattedModel}_img.jpg`;
          await this.fetchCars();
          this.carToDelete = null;

          alert('Car deleted successfully!');
        } else {
          alert('Failed to delete car.');
        }
      } catch (error) {
        console.error('Error deleting car:', error);
        alert('Failed to delete car. Please try again.');
      }
    }
  },
  created() {
    this.fetchCars();
  }
}
</script>

<style scoped>
.delete-car {
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

.btn-danger {
  background-color: #dc3545;
  color: white;
  display: inline-block;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
  margin: 1%;

}

.btn-danger:hover {
  background-color: #c82333;
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
