<template>
  <div class="sidebar">
    <nav>
      <ul>
        <li>
          <router-link to="/">
            <i class="nc-icon nc-chart-pie-35"></i>
            <span>Dashboard</span>
          </router-link>
        </li>
        <li>
          <router-link to="/sach">
            <i class="nc-icon nc-book-bookmark"></i>
            <span>Sách</span>
          </router-link>
        </li>
        <li>
          <router-link to="/docgia">
            <i class="nc-icon nc-single-02"></i>
            <span>Độc Giả</span>
          </router-link>
        </li>
        <li>
          <router-link to="/nhanvien">
            <i class="nc-icon nc-badge"></i>
            <span>Nhân Viên</span>
          </router-link>
        </li>
        <li>
          <router-link to="/nhaxuatban">
            <i class="nc-icon nc-bank"></i>
            <span>Nhà Xuất Bản</span>
          </router-link>
        </li>
        <li>
          <router-link to="/muonsach">
            <i class="nc-icon nc-paper"></i>
            <span>Mượn Sách</span>
          </router-link>
        </li>
      </ul>
    </nav>
    <div class="logout">
      <button @click="logout">
        <i class="nc-icon nc-button-power"></i>
        <span>Đăng xuất</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminSidebar',
  methods: {
    logout() {
      // Thêm logic đăng xuất ở đây
      console.log('Đăng xuất');
    }
  }
};
</script>

<style scoped>
.sidebar {
  width: 200px; /* Giảm chiều ngang của sidebar 30% */
  position: fixed;
  height: 100%;
  background-color: #f8f9fa;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: auto;
}

.sidebar nav ul {
  list-style: none;
  padding: 0;
}

.sidebar nav ul li {
  margin: 15px 0;
  border: 1px solid #ccc; /* Thêm viền cho từng phần tử */
  border-radius: 5px; /* Bo tròn các góc */
  padding: 10px; /* Thêm khoảng cách bên trong */
  background-color: #fff; /* Màu nền trắng */
  transition: background-color 0.3s ease; /* Hiệu ứng chuyển màu nền */
}

.sidebar nav ul li:first-child {
  margin-top: 50px; /* Thêm khoảng cách trên cho phần tử đầu tiên */
}

.sidebar nav ul li:hover {
  background-color: #e9ecef; /* Màu nền khi hover */
}

.sidebar nav ul li a {
  display: flex;
  align-items: center;
  color: #333;
  text-decoration: none;
  font-size: 1.1em; /* Tăng kích thước font chữ */
  font-weight: bold; /* In đậm font chữ */
}

.sidebar nav ul li a i {
  margin-right: 10px;
}

.logout {
  margin-top: auto;
  padding: 10px;
  border: 1px solid #ccc; /* Thêm viền cho phần tử đăng xuất */
  border-radius: 5px; /* Bo tròn các góc */
  background-color: #fff; /* Màu nền trắng */
  text-align: center;
}

.logout button {
  background: none;
  border: none;
  color: #333;
  font-size: 1.1em; /* Tăng kích thước font chữ */
  font-weight: bold; /* In đậm font chữ */
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

/* .logout button i {
  margin-right: 10px;
} */

.logout button:hover {
  background-color: #e9ecef; /* Màu nền khi hover */
}
</style>