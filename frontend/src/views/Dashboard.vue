<template>
  <div class="card">
    <div class="card-header">
      <h5>Thông Tin Nhân Viên</h5>
    </div>
    <div class="card-body">
      <form @submit.prevent="updateProfile">
        <div class="row">
          <!-- MSNV -->
          <div class="col-md-6 mb-3">
            <label for="msnv" class="form-label">Mã Số Nhân Viên (MSNV):</label>
            <input type="text" class="form-control" id="msnv" v-model="nhanVienData.MSNV" disabled />
          </div>
          <!-- Họ Tên -->
          <div class="col-md-6 mb-3">
            <label for="hoTen" class="form-label">Họ Tên:</label>
            <input type="text" class="form-control" id="hoTen" v-model="nhanVienData.HoTen" required />
          </div>
        </div>
        <div class="row">
          <!-- Địa Chỉ -->
          <div class="col-md-6 mb-3">
            <label for="diaChi" class="form-label">Địa Chỉ:</label>
            <input type="text" class="form-control" id="diaChi" v-model="nhanVienData.DiaChi" required />
          </div>
          
          <!-- Số Điện Thoại -->
          <div class="col-md-6 mb-3">
            <label for="soDienThoai" class="form-label">Số Điện Thoại:</label>
            <input
              type="text"
              class="form-control"
              id="soDienThoai"
              v-model="nhanVienData.SoDienThoai"
              @input="validatePhoneNumber"
              required
            />
            <div v-if="phoneError" class="text-danger">
              Số điện thoại phải có đúng 10 chữ số.
            </div>
          </div>
        </div>
        
        <div class="row">
          <!-- Mật Khẩu -->
          <div class="col-md-6 mb-3">
            <label for="password" class="form-label">Mật Khẩu:</label>
            <input type="password" class="form-control" id="password" v-model="nhanVienData.password" />
          </div>
           <!-- Nhập Lại Mật Khẩu -->
          <div class="col-md-6 mb-3">
            <label for="confirmPassword" class="form-label">Nhập Lại Mật Khẩu:</label>
            <input type="password" class="form-control" id="confirmPassword" v-model="confirmPassword" />
          </div>
        </div>
   
        <!-- Thông Báo Lỗi -->
        <div v-if="passwordMismatch" class="alert alert-danger">
          Mật khẩu và xác nhận mật khẩu không khớp.
        </div>
        <div v-if="error" class="alert alert-danger">
          {{ error }}
        </div>
        <!-- Nút Cập Nhật -->
         <div class="text-center mt-2">
          <button type="submit" class="btn btn-primary" :disabled="updateLoading">
            <span v-if="updateLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Cập Nhật
          </button>
         </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { updateProfile as updateNhanVienProfile } from '../services/api';
import { useToast } from 'vue-toastification';

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();
const loading = ref(true);
const updateLoading = ref(false);
const error = ref('');
const confirmPassword = ref('');

const nhanVienData = ref({
  MSNV: '',
  HoTen: '',
  SoDienThoai: '',
  DiaChi: '',

});

const phoneError = ref(false);

const validatePhoneNumber = () => {
  const phoneRegex = /^\d{10}$/; // Chỉ chấp nhận 10 chữ số
  phoneError.value = !phoneRegex.test(nhanVienData.value.SoDienThoai);
};

const passwordMismatch = computed(() => {
    return nhanVienData.value.password && confirmPassword.value && nhanVienData.value.password !== confirmPassword.value;
});


const updateProfile = async () => {
  validatePhoneNumber(); // Kiểm tra số điện thoại
  if (phoneError.value || passwordMismatch.value) {
    return; // Dừng nếu có lỗi
  }

  updateLoading.value = true;
  error.value = '';
  
  try {
    await updateNhanVienProfile({
      MSNV: nhanVienData.value.MSNV,
      HoTen: nhanVienData.value.HoTen,
      SoDienThoai: nhanVienData.value.SoDienThoai,
      DiaChi: nhanVienData.value.DiaChi,
      Password: nhanVienData.value.password || undefined, // Cập nhật nếu có
    });

    // Nếu có đổi mật khẩu, yêu cầu đăng nhập lại
    if (nhanVienData.value.password) {
      await authStore.login({
        username: nhanVienData.value.MSNV,
        password: nhanVienData.value.password,
      });
    }

    await authStore.fetchCurrentNhanVien();

    toast.success('Cập nhật thông tin cá nhân thành công', {
      position: 'top-right',
      timeout: 3000,
      toastClassName: 'custom-toast',
    });

    nhanVienData.value.password = '';
    confirmPassword.value = '';
  } catch (err) {
    error.value = 'Cập nhật thông tin thất bại. Vui lòng thử lại.';
    console.error(err);
  } finally {
    updateLoading.value = false;
  }
};

onMounted(async () => {
  if (!authStore.nhanVien) {
    router.push('/login');
    return;
  }
  try {
    if (authStore.nhanVien) {
      nhanVienData.value.MSNV = authStore.nhanVien.MSNV || '';
      nhanVienData.value.HoTen = authStore.nhanVien.HoTenNV || '';
      nhanVienData.value.SoDienThoai = authStore.nhanVien.SoDienThoai || '';
      nhanVienData.value.DiaChi = authStore.nhanVien.DiaChi || '';

    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.card {
  max-width: 600px;
  margin: 20px auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #f8f9fa;
  padding: 15px;
  border-bottom: 1px solid #ddd;
  font-size: 18px;
  font-weight: bold;
}

.card-body {
  padding: 15px;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}
</style>