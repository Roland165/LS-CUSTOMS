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
          <tr>
            <td>Member since:</td>
            <td>{{ user.created }}</td>
          </tr>
        </tbody>
      </table>
      <div class="text-center mt-4">
        <router-link to="/" class="btn btn-primary">Back to Home</router-link>
      </div>
    </div>
  </div>
</div>
</template>

<script>
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
        created: null,
      },
    };
  },
  methods: {
    loadUserInfo() {
      this.user.id      = sessionStorage.getItem("userId")      || null;
      this.user.name    = sessionStorage.getItem("username")    || null;
      this.user.email   = sessionStorage.getItem("userEmail")   || null;
      this.user.role    = sessionStorage.getItem("role")        || null;
      this.user.created = sessionStorage.getItem("userCreated") || null;
    }
  },
  created() {
    this.loadUserInfo();
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
