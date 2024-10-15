<template>
  <div class="hello">
    <p>
      ACTION = {{ action }}<br />
      ID = {{ id }}<br />
      <a href="/#/cars/list/all">Back to the list</a>
      <a href="/#/cars/edit/0">Add a new car</a>
    </p>
    <!-- For Datasheet /cars/show/42-->
    <table v-if="action === 'show'" class="table table-striped table-bordered table-hover">
      <tr>
        <td>ID</td>
        <td>{{ oneCar.car_id }}</td>
      </tr>
      <tr>
        <td>BRAND</td>
        <td>{{ oneCar.car_brand }}</td>
      </tr>
      <tr>
        <td>NAME</td>
        <td>{{ oneCar.car_name }}</td>
      </tr>
      <tr>
        <td>BASE POWER</td>
        <td>{{ oneCar.car_base_power }}</td>
      </tr>
      <tr>
        <td>BASE PRICE</td>
        <td>{{ oneCar.car_base_price }}</td>
      </tr>
      <tr>
        <td>BASE WEIGHT</td>
        <td>{{ oneCar.car_base_weight }}</td>
      </tr>
      <tr>
        <td>SEAT NUM</td>
        <td>{{ oneCar.car_seat_num }}</td>
      </tr>
      <tr>
        <td>CREATION DATE</td>
        <td>{{ oneCar.car_creation_date }}</td>
      </tr>
    </table>

    <!-- For Form /cars/edit/42-->
    <table v-if="action === 'edit'" class="table table-striped table-bordered table-hover">
      <tr>
        <td>ID</td>
        <td><input type="text" name="car_id" v-model="oneCar.car_id" /></td>
      </tr>
      <tr>
        <td>BRAND</td>
        <td>
          <select name="brand_id" v-model="oneCar.brand_id">
            <option v-for="b of brands" v_bind:key="b.brand_id" :value="b.brand_id">
              {{ b.brand_name }}
            </option>
          </select>
        </td>
      </tr>
      <tr>
        <td>CAR NAME</td>
        <td><input type="text" name="car_name" v-model="oneCar.car_name" /></td>
      </tr>
      <tr>
        <td>BASE POWER</td>
        <td><input type="text" name="car_base_power" v-model="oneCar.car_base_power" /></td>
      </tr>
      <tr>
        <td>BASE PRICE</td>
        <td><input type="text" name="car_base_price" v-model="oneCar.car_base_price" /></td>
      </tr>
      <tr>
        <td>BASE WEIGHT</td>
        <td><input type="text" name="car_base_weight" v-model="oneCar.car_base_weight" /></td>
      </tr>
      <tr>
        <td>SEAT NUM</td>
        <td><input type="text" name="car_seat_num" v-model="oneCar.car_seat_num" /></td>
      </tr>
      <tr>
        <td>CREATION DATE</td>
        <td><input type="text" name="car_creation_date" v-model="oneCar.car_creation_date" /></td>
      </tr>
      <tr>
        <td colspan="2">
          <input type="button" value="SEND" @click="sendEditRequest">
          <!--@ is used to execute the function below and not somewhere else(template)-->
        </td>
      </tr>
    </table>

    <!-- For List /cars/list/all-->
    <table v-if="action === 'list'" class="table table-striped table-bordered table-hover">
      <tr>
        <td>ID</td>
        <td>NAME</td>
        <td>SHOW DATASHEET</td>
        <td>EDIT CAR</td>
        <td>DELETE CAR</td>
      </tr>
      <tr v-for="c of cars" v-bind:key="c.car_id">
        <td>{{ c.car_id }}</td>
        <td>{{ c.car_name }}</td>
        <td><a :href="'/#/cars/show/' + c.car_id">[SHOW DATASHEET]</a></td>
        <td><a :href="`/#/cars/edit/${c.car_id}`">[EDIT CAR]</a></td>
        <td><input type="button" value="DELETE CAR" @click="sendDeleteRequest()"> </td>
      </tr>

    </table>
  </div>
</template>

<script>
export default {
  name: 'Cars',
  props: ['action', 'id'],
  data() {
    return {

      cars: [],
      brands: [],
      oneCar: {
        car_id: 0,
        car_brand: 0,
        car_name: "toto",
        car_seat_num: 0,
        car_base_price: 0,
        car_base_power: 0,
        car_base_weight: 0,
        car_creation_date: "1990-01-01"

      }
    }
  },
  methods: {
    async getAllData() {
      try {
        /*
      let responseCars = await this.$http.get("toto");
      this.cars = responseCars.data;
      //We will have to define what $http is 
      let responseBrands = await this.$http.get("toto");
      this.brands = responseBrands.data;
      */
        this.brands = [{ brand_id: 1, brand_name: "BMW" }, { brand_id: 2, brand_name: "Audi" },
        { brand_id: 2, brand_name: "Citroen" }];
        this.cars = [{
          car_id: 1, brand_id: 1, car_name: "e46", car_base_price: 32000,
          car_base_power: 200, car_base_weight: 1450, car_creation_date: "1995-01-15", car_seat_num: 5
        },
        {
          car_id: 2, brand_id: 2, car_name: "A3", car_base_price: 43000, car_base_power: 150,
          car_base_weight: 1600, car_creation_date: "2000-01-15", car_seat_num: 4
        }];

        this.refreshOneCar();
      } catch (ex) { console.log(ex); }
    },
    async refreshOneCar() {
      if (this.$props.id === "all" || this.$props.id === "0") return; // we use a string here bcause the property id will always be a string.
      try {
        /*
      let responseCar = await this.$http.get("toto");
      this.oneCar = responseCar.data;
      */
        this.oneCar = this.cars.find(car => car.car_id == this.$props.id);
      } catch (ex) { console.log(ex); }
    },
    async sendDeleteRequest() { },
    async sendEditRequest() { },
    // We will write these 2 functions at the end of the semester, when we will have the backend.
  },
  watch: {
    id: function (newVal, oldVal) {
      this.refreshOneCar();
    }
  },
  created() {
    this.getAllData();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a {
  color: #42b983;
}

p {
  color: darkgray;
}

#app table {
  width: 95%;
  margin: 20px;
}

#app td {
  text-align: center;
}
</style>
