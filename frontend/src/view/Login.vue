<template>
  <div class="login-container">
    <h1>Đăng nhập</h1>
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="msnv">Mã số nhân viên:</label>
        <input type="text" v-model="credentials.MSNV" id="msnv" class="form-control" required>
      </div>
      <div class="form-group">
        <label for="password">Mật khẩu:</label>
        <input type="password" v-model="credentials.Password" id="password" class="form-control" required>
      </div>
      <button type="submit" class="btn btn-primary">Đăng nhập</button>
    </form>
    <div v-if="error" class="alert alert-danger mt-3">
      {{ error }}
    </div>
  </div>
</template>

<script>
import AuthService from '../services/authService';

export default {
  data() {
    return {
      credentials: {
        MSNV: '',
        Password: ''
      },
      error: null
    };
  },
  methods: {
    async login() {
      try {
        const response = await AuthService.login(this.credentials);
        localStorage.setItem('token', response.token);
        this.$router.push('/');
      } catch (error) {
        this.error = 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.';
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
}
</style>