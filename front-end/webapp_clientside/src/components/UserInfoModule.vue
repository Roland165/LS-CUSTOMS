<template>
<div class="order-history">
  <div class="container mt-5">
    <div>
      <h2 class="text-center mb-4">Account Details:</h2>
      <table class="table table-striped table-bordered table-hover">
        <tbody>
          <tr>
            <td>User id:</td>
            <td>{{ user.id }}</td>
          </tr>
          <tr>
            <td>User name:</td>
            <td>{{ user.name }}</td>
          </tr>
          <tr>
            <td>User email:</td>
            <td>{{ user.email }}</td>
          </tr>
          <tr>
            <td>User role:</td>
            <td>{{ user.role }}</td>
          </tr>
        </tbody>
      </table>
      <div class="text-center mt-4">
        <router-link to="/home" class="btn btn-primary">Back to Home</router-link>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'UserInfo',
  props: ['action', 'id'],
  data() {
    return {
      user: {
        id: null,
        name: null,
        email: null,
        role: null,
      },
    };
  },
  methods: {
    async getAndUpdateUserInfo(){
      try {
        const response = await axios.get('http://localhost:9000/auth/info');

        console.log(response);

        if(response.data != ""){
          this.user.id = response.data.user_id;
          this.user.name = response.data.user_name;
          this.user.email = response.data.user_email;
          this.user.role = response.data.user_role;
        }

      } catch (ex) {
        console.error('Error fetching user data:', ex);
        alert('Failed to load user data. Please try again later.');
      }
    }

  },
  created() {
    this.getAndUpdateUserInfo();
  }
};
</script>

<style scoped>
.order-history {
  padding-top: 80px;
}

.order-history h1,
.order-history h2,
.order-history h3,
.order-history h4 {
  color: #333;
}

.order-history .table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.order-history th,
.order-history td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  vertical-align: middle;
}

.order-history th {
  background-color: #333;
  color: #fff;
}

.order-history .btn {
  display: inline-block;
  background-color: #0077b6;
  color: #fff;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
  border: none;
}

.order-history .btn:hover {
  background-color: #005a8e;
}

.order-history ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.order-history ul li {
  margin-bottom: 5px;
}

.order-history ul li:last-child {
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .order-history {
    padding-top: 120px;
  }

  .order-history .table {
    font-size: 0.9em;
  }

  .order-history th,
  .order-history td {
    padding: 8px;
  }

  .order-history .btn {
    padding: 6px 12px;
    font-size: 0.9em;
  }
}
</style>
