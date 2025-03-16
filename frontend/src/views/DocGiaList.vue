<template>
  <div class="main-content">
    <div class="container">
      <h2 class="mb-3 text-center">Danh Sách Đọc Giả</h2>
      <div class="search-bar mb-3 d-flex justify-content-between">
        <InputSearch class="search-input"/>
        <button class="btn btn-success mr-5"><i class="fas fa-plus"></i>  Thêm Đọc Giả</button>
      </div>
      <table class="table table-bordered table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Tên</th>
            <th scope="col">Ngày sinh</th>
            <th scope="col">Giới tính</th>
            <th scope="col">Địa chỉ</th>
            <th scope="col">Số điện thoại</th>
            <th scope="col">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Nguyễn Văn A</td>
            <td>01/01/1990</td>
            <td>Nam</td>
            <td>Hà Nội</td>
            <td>0123456789</td>
            <td>
              <button class="btn btn-primary btn-sm mr-2"><i class="fas fa-edit"></i>Chỉnh Sửa</button>
              <button class="btn btn-danger btn-sm"><i class="fas fa-trash"></i> Xóa</button>
            </td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>Trần Thị B</td>
            <td>02/02/1992</td>
            <td>Nữ</td>
            <td>TP. Hồ Chí Minh</td>
            <td>0987654321</td>
            <td>
              <button class="btn btn-primary btn-sm mr-2">Chỉnh Sửa</button>
              <button class="btn btn-danger btn-sm"><i class="fas fa-trash"></i> Xóa</button>
            </td>
          </tr>
          <!-- Thêm các hàng đọc giả khác ở đây -->
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import InputSearch from '@/components/InputSearch.vue';

export default {
  name: 'DocGiaList',
  components: {
    InputSearch,
  },
  data() {
    return {
      searchQuery: ''
    };
  }
};
</script>

<style scoped>
.main-content {  
  padding: 20px;
}

.container {
  max-width: 100%; /* Chiếm toàn bộ chiều rộng */
  margin: auto;
}

.table {
  margin-top: 20px;
}

.table-bordered th,
.table-bordered td {
  border: 1px solid #dee2e6; /* Thêm viền cho các ô trong bảng */
}

.search-bar {
  display: flex;
  justify-content: space-between;
}

.search-input {
  width: 350px; /* Làm cho input nhỏ lại */
  margin-right: 10px; /* Thêm khoảng cách bên phải cho thanh tìm kiếm */
}
</style>