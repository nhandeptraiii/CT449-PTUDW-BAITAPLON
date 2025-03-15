<template>
  <div class="login-wrapper">
    <div class="login-container">
      <h1 class="text-center">Đăng nhập</h1>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="msnv">Mã số nhân viên:</label>
          <input 
          type="text" 
          v-model="msnv" 
          name="msnv" 
          id="msnv" 
          autocomplete="msnv" 
          class="form-control" 
          required>
        </div>
        <div class="form-group">
          <label for="password">Mật khẩu:</label>
          <input 
          type="password" 
          v-model="password" 
          name="password" 
          id="password" 
          autocomplete="current-password" 
          class="form-control" 
          required>
        </div>
        <div class="form-check mb-3">
          <input 
          class="form-check-input" 
          type="checkbox" 
          id="remember-me"
          name="remember-me">
          <label class="form-check-label" for="rememberMe"> Remember me </label>
        </div>
        <button type="submit" 
        class="btn btn-primary w-100">
        <span v-if="isLoading" class="mr-2">
            <div class="spinner-border text-light" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          </span>
        Đăng nhập
      </button>
      </form>
      <div v-if="errorMessage" class="alert alert-danger mt-3">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter, useRoute } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const msnv = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')


const handleLogin = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''
    
    const success = await authStore.login({
      MSNV: msnv.value,
      Password: password.value
    })
    console.log("Login success:", success);
    console.log("User loaded:", authStore.isNhanVienLoaded);
    if (success) {
      const redirectPath = route.query.redirect || '/'
      router.push(redirectPath)
      
    } else {
      errorMessage.value = 'MSNV hoặc mật khẩu không đúng'
    }
  } catch (error) {
    console.error('Login error:', error)
    errorMessage.value = 'Đã xảy ra lỗi khi đăng nhập'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f9fa;
  margin: 0; /* Đảm bảo không có margin */
  padding: 0; /* Đảm bảo không có padding */
}

.login-container {
  max-width: 360px; /* Giảm kích thước khung đăng nhập */
  width: 100%;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.text-center {
  text-align: center;
}
</style>