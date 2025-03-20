<template>
  <div class="main-content">
    <div class="container">
      <h2 class="mb-3 text-center">Danh Sách Sách</h2>
      <div class="search-bar mb-3 d-flex justify-content-between">
        <InputSearch class="search-input" v-model="searchQuery"/>
        <button class="btn btn-success mr-5" @click="showAddModal = true"><i class="fas fa-plus"></i> Thêm Sách</button>
      </div>
      <table class="table table-bordered table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Mã Sách</th>
            <th scope="col">Tên Sách</th>
            <th scope="col">Tác Giả</th>
            <th scope="col">Đơn Giá</th>
            <th scope="col">Số Quyển</th>
            <th scope="col">Nhà Xuất Bản</th>
            <th scope="col">Năm Xuất Bản</th>
            <th scope="col">Hành Động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="8" class="px-6 py-4 text-center text-sm text-gray-500">
              <div class="flex justify-center">
                <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            </td>
          </tr>
          <tr v-else-if="filteredSach.length === 0">
            <td colspan="8" class="px-6 py-4 text-center text-sm text-gray-500">
              Không tìm thấy quyển sách nào
            </td>
          </tr>
          <tr v-for="(sach,index) in filteredSach" :key="sach._id">
            <th scope="row">{{ index + 1 }}</th>
            <td>{{ sach.MaSach }}</td>
            <td>{{ sach.TenSach }}</td>
            <td>{{ sach.TacGia }}</td>
            <td>{{ formatDonGia(sach.DonGia) }}</td>
            <td>{{ sach.SoQuyen }}</td>
            <td>{{ sach.MaNXB.TenNXB }}</td>
            <td>{{ sach.NamXuatBan }}</td>
            <td>
              <button class="btn btn-primary btn-sm mr-2" @click="editSach(sach)"><i class="fas fa-edit" ></i> Chỉnh Sửa</button>
              <button class="btn btn-danger btn-sm" @click="confirmDelete(sach._id)"><i class="fas fa-trash"></i> Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Modal Thêm Sách -->
      <div v-if="showAddModal" class="modal fade show" tabindex="-1" style="display: block;">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Thêm Sách</h5>
              <button type="button" class="btn-close" @click="showAddModal = false"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="addSach">
                <div class="mb-1">
                  <label for="tenSach" class="form-label">Mã Sách:</label>
                  <input type="text" class="form-control" id="maSach" v-model="newSach.MaSach" required>
                </div>
                <div class="mb-1">
                  <label for="tenSach" class="form-label">Tên Sách:</label>
                  <input type="text" class="form-control" id="tenSach" v-model="newSach.TenSach" required>
                </div>
                <div class="mb-1">
                  <label for="tacGia" class="form-label">Tác Giả:</label>
                  <input type="text" class="form-control" id="tacGia" v-model="newSach.TacGia" required>
                </div>
                <div class="mb-1">
                  <label for="donGia" class="form-label">Đơn Giá:</label>
                  <input type="number" class="form-control" id="donGia" v-model="newSach.DonGia" required>
                </div>
                <div class="mb-1">
                  <label for="soQuyen" class="form-label">Số Quyển:</label>
                  <input type="number" class="form-control" id="soQuyen" v-model="newSach.SoQuyen" required>
                </div>
                <div class="mb-1">
                  <label for="maNXB" class="form-label">Nhà Xuất Bản:</label>
                  <select class="form-control" id="maNXB" v-model="newSach.MaNXB" required>
                    <option v-for="nxb in nhaXuatBanList" :key="nxb._id" :value="nxb._id">{{ nxb.TenNXB }}</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="namXuatBan" class="form-label">Năm Xuất Bản</label>
                  <input type="number" class="form-control" id="namXuatBan" v-model="newSach.NamXuatBan" required>
                </div>
                <button type="submit" class="btn btn-primary">Thêm Sách</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <!-- Modal Chỉnh Sửa Sách -->
      <div v-if="showEditModal" class="modal fade show" tabindex="-1" style="display: block;">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Chỉnh Sửa Sách</h5>
              <button type="button" class="btn-close" @click="closeEditModal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="capnhatSach">
                <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
                <div class="mb-1">
                  <label for="editMaSach" class="form-label">Mã Sách:</label>
                  <input type="text" class="form-control" id="editMaSach" v-model="editSachData.MaSach" required>
                </div>
                <div class="mb-1">
                  <label for="editTenSach" class="form-label">Tên Sách:</label>
                  <input type="text" class="form-control" id="editTenSach" v-model="editSachData.TenSach" required>
                </div>
                <div class="mb-1">
                  <label for="editTacGia" class="form-label">Tác Giả:</label>
                  <input type="text" class="form-control" id="editTacGia" v-model="editSachData.TacGia" required>
                </div>
                <div class="mb-1">
                  <label for="editDonGia" class="form-label">Đơn Giá:</label>
                  <input type="number" class="form-control" id="editDonGia" v-model="editSachData.DonGia" required>
                </div>
                <div class="mb-1">
                  <label for="editSoQuyen" class="form-label">Số Quyển:</label>
                  <input type="number" class="form-control" id="editSoQuyen" v-model="editSachData.SoQuyen" required>
                </div>
                <div class="mb-1">
                  <label for="editMaNXB" class="form-label">Nhà Xuất Bản:</label>
                  <select class="form-control" id="editMaNXB" v-model="editSachData.MaNXB" required>
                    <option v-for="nxb in nhaXuatBanList" :key="nxb._id" :value="nxb._id">
                      {{ nxb.TenNXB }}
                    </option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="editNamXuatBan" class="form-label">Năm Xuất Bản:</label>
                  <input type="number" class="form-control" id="editNamXuatBan" v-model="editSachData.NamXuatBan" required>
                </div>
                <button type="submit" class="btn btn-primary text-center">Cập Nhật Sách</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { getAllSach, createSach, updateSach, deleteSach as apiDeleteSach, getAllNhaXuatBan } from '../services/api';
import InputSearch from '@/components/InputSearch.vue';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/auth';

const sachList = ref([]);
const loading = ref(true);
const searchQuery = ref('');
const nhaXuatBanList = ref([]);
const showAddModal = ref(false);
const showEditModal = ref(false);
const errorMessage = ref('');
const newSach = reactive({
  MaSach: '',
  TenSach: '',
  TacGia: '',
  DonGia: '',
  SoQuyen: '',
  MaNXB: '',
  NamXuatBan: ''
});
const editSachData = reactive({
  _id: '',
  MaSach: '',
  TenSach: '',
  TacGia: '',
  DonGia: '',
  SoQuyen: '',
  MaNXB: '',
  NamXuatBan: ''
});
const toast = useToast();
const authStore = useAuthStore();


const formatDonGia = (DonGia) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(DonGia);
};

const confirmDelete = (id) => {
  if (window.confirm("Bạn có chắc chắn muốn xóa sách này không?")) {
    deleteSach(id);
  }
};

const deleteSach = async (id) => {
  try {
    const response = await apiDeleteSach(id);
    if (response && response.success) {
      toast.success(`Đã xóa sách thành công`, {
        position: "top-right",
        timeout: 3000,
        toastClassName: "custom-toast"
      });
      // Cập nhật lại danh sách sách sau khi xóa thành công
      loadSach();
    } else {
      console.error("Lỗi API khi xóa sách:", response);
      toast.error("Lỗi không xác định khi xóa sách.", {
        position: "top-right",
        timeout: 3000,
        toastClassName: "custom-toast"
      });
    }
  } catch (error) {
    console.error("Lỗi xóa sách:", error.response ? error.response.data : error);
    toast.error("Có lỗi xảy ra khi xóa sách. Vui lòng thử lại.", {
      position: "top-right",
      timeout: 3000,
      toastClassName: "custom-toast"
    });
  }
};

const addSach = async () => {
  try {
    const response = await createSach(newSach);

    if (response && response.success) {
      toast.success(`Đã thêm sách thành công`, {
        position: "top-right",
        timeout: 3000,
        toastClassName: "custom-toast"
      });
      
      loadSach();
      showAddModal.value = false;
      
      newSach.MaSach = '';
      newSach.TenSach = '';
      newSach.TacGia = '';
      newSach.DonGia = '';
      newSach.SoQuyen = '';
      newSach.MaNXB = '';
      newSach.NamXuatBan = '';
    } else {
      console.error("Lỗi API khi thêm sách:", response);
      toast.error("Lỗi không xác định khi thêm sách.", {
        position: "top-right",
        timeout: 3000,
        toastClassName: "custom-toast"
      });
    }
  } catch (error) {
    console.error("Lỗi thêm sách:", error.response ? error.response.data : error);
    toast.error("Có lỗi xảy ra khi thêm sách. Vui lòng thử lại.", {
      position: "top-right",
      timeout: 3000,
      toastClassName: "custom-toast"
    });
  }
}; 

const filteredSach = computed(() => {
  let result = [...sachList.value];
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(sach => 
      sach.TenSach.toLowerCase().includes(query) || 
      sach.TacGia.toLowerCase().includes(query) || 
      sach.MaSach.toLowerCase().includes(query) ||  
      sach.MaNXB.TenNXB.toLowerCase().includes(query) ||
      sach.NamXuatBan.toString().includes(query) 
    );
  }
  return result;
});

const loadSach = async () => {
  loading.value = true;
  try {
    const response = await getAllSach();
    sachList.value = response.data;
  } catch (error) {
    console.error('Lỗi tải sách: ', error);
  } finally {
    loading.value = false;
  }
};

const loadNhaXuatBan = async () => {
  try {
    const response = await getAllNhaXuatBan();
    nhaXuatBanList.value = response.data;
  } catch (error) {
    console.error('Lỗi tải nhà xuất bản: ', error);
  }
};

const editSach = (sach) => {
  editSachData._id = sach._id;
  editSachData.MaSach = sach.MaSach;
  editSachData.TenSach = sach.TenSach;
  editSachData.TacGia = sach.TacGia;
  editSachData.DonGia = sach.DonGia;
  editSachData.SoQuyen = sach.SoQuyen;
  editSachData.MaNXB = sach.MaNXB._id;
  editSachData.NamXuatBan = sach.NamXuatBan;
  showEditModal.value = true;
};
const closeEditModal = () => {
  showEditModal.value = false;
  editSachData._id = '';
  editSachData.MaSach = '';
  editSachData.TenSach = '';
  editSachData.TacGia = '';
  editSachData.DonGia = '';
  editSachData.SoQuyen = '';
  editSachData.MaNXB = '';
  editSachData.NamXuatBan = '';
};

const capnhatSach = async () => {
  try {
    const sachData = {
      ...editSachData,
      MaNXB: String(editSachData.MaNXB), // Đảm bảo kiểu string
      DonGia: Number(editSachData.DonGia),
      SoQuyen: Number(editSachData.SoQuyen),
    };

    const response = await updateSach(editSachData._id, sachData);

    if (response && response.success) {
      toast.success("📚 Cập nhật sách thành công!", {
        position: "top-right",
        timeout: 3000,
        theme: "colored",
      });

      loadSach();
      showEditModal.value = false;
    }
  } catch (error) {
    console.error("Lỗi cập nhật sách:", error);

    let errorMsg = "⚠️ Lỗi không xác định, vui lòng thử lại!";
    
    if (error.response && error.response.data.error) {
      if (error.response.data.error.includes("Mã Sách đã tồn tại")) {
        errorMsg = "⚠️ Mã Sách đã tồn tại, vui lòng chọn mã khác!";
      } else {
        errorMsg = `⚠️ ${error.response.data.error}`;
      }
    }

    toast.error(errorMsg, {
      position: "top-right",
      timeout: 4000,
      theme: "colored",
    });
  }
};


onMounted(() => {
  loadSach();
  loadNhaXuatBan();
});
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

.search-bar {
  display: flex;
  justify-content: space-between;
}

.table-bordered th,
.table-bordered td {
  border: 1px solid #dee2e6; /* Thêm viền cho các ô trong bảng */
}

.search-input {
  width: 350px; /* Làm cho input nhỏ lại */
}

.modal {
  background: rgba(0, 0, 0, 0.5); /* Làm mờ nền khi modal mở */
}

.modal-dialog {
  max-width: 500px;
  margin: 1.75rem auto;
}

.modal-content {
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0.3rem;
  box-shadow: 0 3px 9px rgba(0, 0, 0, 0.5);
  outline: 0;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
}

.modal-title {
  margin-bottom: 0;
  line-height: 1.5;
}

.modal-body {
  position: relative;
  flex: 1 1 auto;
  padding: 1rem;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 1rem;
  border-top: 1px solid #dee2e6;
}
</style>