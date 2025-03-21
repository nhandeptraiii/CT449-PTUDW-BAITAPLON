<template>
  <div class="main-content">
    <div class="container">
      <h2 class=" text-center">Danh Sách Mượn Sách</h2>
      <div class="search-bar mb-3 d-flex justify-content-between">
        <InputSearch class="search-input"/>
        <button class="btn btn-success mr-5"><i class="fas fa-plus"></i>  Thêm Phiếu Mượn Sách</button>
      </div>
      <table class="table table-bordered table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Tên Sách</th>
            <th scope="col">Tên Đọc Giả</th>
            <th scope="col">Ngày Mượn</th>
            <th scope="col">Ngày Trả</th>
            <th scope="col">Trạng Thái</th>
            <th scope="col">Hành Động</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Sách A</td>
            <td>Tác Giả A</td>
            <td>Nhà Xuất Bản A</td>
            <td>2021</td>
            <td>Đã Trả</td>
            <td>
              <button class="btn btn-primary btn-sm mr-2"><i class="fas fa-edit"></i>Chỉnh Sửa</button>
              <button class="btn btn-danger btn-sm"><i class="fas fa-trash"></i> Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import InputSearch from '@/components/InputSearch.vue';


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
}
</style>