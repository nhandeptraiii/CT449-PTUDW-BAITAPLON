<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a href="/" class="navbar-brand"> 
      Ứng dụng Quản lý mượn sách <i class="fas fa-book" ></i>
    </a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ml-auto">
        <!-- <li class="nav-item">
          <router-link to="/" class="nav-link">
            <i class="nc-icon nc-chart-pie-35"></i>
            Dashboard
          </router-link>
        </li> -->
        <li class="nav-item">
          <router-link to="/sach" class="nav-link">
            <i class="nc-icon nc-book-bookmark"></i>
            Sách
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/docgia" class="nav-link">
            <i class="nc-icon nc-single-02"></i>
            Đọc Giả
          </router-link>
        </li>
        <li v-if="!isLibrarian" class="nav-item">  <!-- Ẩn nếu là "Thu Thu" -->
          <router-link to="/nhanvien" class="nav-link">
            <i class="nc-icon nc-badge"></i>
            Nhân Viên
          </router-link>
        </li>
        <li v-if="!isLibrarian" class="nav-item">
          <router-link to="/nhaxuatban" class="nav-link">
            <i class="nc-icon nc-bank"></i>
            Nhà Xuất Bản
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/muonsach" class="nav-link">
            <i class="nc-icon nc-paper"></i>
            Mượn Sách
          </router-link>
        </li>
        <li class="nav-item">
          <button @click="logout" class="nav-link btn btn-link">
            <i class="nc-icon nc-button-power"></i>
            Đăng xuất
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { useAuthStore } from '../stores/auth';
import { computed } from 'vue';

export default {
  setup() {
    const authStore = useAuthStore();

    const logout = () => {
      authStore.logout();
      window.location.reload();
    };

    const isLibrarian = computed(() => authStore.isLibrarian); // Kiểm tra nếu là "Thu Thu"

    return {
      logout,
      isLibrarian
    };
  }
};
</script>

<style scoped>
.navbar {
  background-color: #f8f9fa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-brand {
  font-size: 1.5em;
  font-weight: bold;
  color: #333;
}

.navbar-nav .nav-item .nav-link {
  display: flex;
  align-items: center;
  color: #333;
  font-size: 1.1em;
  font-weight: bold;
  margin-left: 15px;
}

.navbar-nav .nav-item .nav-link i {
  margin-right: 5px;
}

.navbar-nav .nav-item .nav-link:hover {
  color: #007bff;
}
</style>