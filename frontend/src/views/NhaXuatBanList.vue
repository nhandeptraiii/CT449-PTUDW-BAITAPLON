<template>
  <div class="main-content">
    <div class="container">
      <h2 class="mb-3 text-center">Danh Sách Nhà Xuất Bản</h2>
      <div class="search-bar mb-3 d-flex justify-content-between">
        <InputSearch class="search-input" v-model="searchQuery"/>
        <button class="btn btn-success mr-5" @click="showAddModal = true"><i class="fas fa-plus"></i> Thêm Nhà Xuất Bản</button>
      </div>
      <table class="table table-bordered table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Mã Nhà Xuất Bản</th>
            <th scope="col">Tên Nhà Xuất Bản</th>
            <th scope="col">Địa Chỉ</th>
            <th scope="col">Số Sách</th>
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
          <tr v-else-if="filteredNhaXuatBan.length === 0">
            <td colspan="8" class="px-6 py-4 text-center text-sm text-gray-500">
              Không tìm thấy nhà xuất bản nào
            </td>
          </tr>
          <tr v-for="(nxb,index) in filteredNhaXuatBan" :key="nxb._id">
            <th scope="row">{{ index + 1 }}</th>
            <td>{{ nxb.MaNXB }}</td>
            <td>{{ nxb.TenNXB }}</td>
            <td>{{ nxb.DiaChi }}</td>
            <td>{{ nxb.booksQuantity }}</td>
            <td>
              <button class="btn btn-primary btn-sm mr-2" @click="editNXB(nxb)"><i class="fas fa-edit"></i> Chỉnh Sửa</button>
              <button class="btn btn-danger btn-sm" @click="confirmDelete(nxb._id)"><i class="fas fa-trash"></i> Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Modal Thêm Nhà Xuất Bản -->
      <div v-if="showAddModal" class="modal fade show" tabindex="-1" style="display: block;">
        <div class="modal-dialog mt-5">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Thêm Nhà Xuất Bản</h5>
              <button type="button" class="btn-close" @click="showAddModal = false"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="addNXB">
                <div class="mb-1">
                  <label for="maNXB" class="form-label">Mã Nhà Xuất Bản:</label>
                  <input type="text" class="form-control" id="maNXB" v-model="newNXB.MaNXB" required>
                </div>
                <div class="mb-1">
                  <label for="tenNXB" class="form-label">Tên Nhà Xuất Bản:</label>
                  <input type="text" class="form-control" id="tenNXB" v-model="newNXB.TenNXB" required>
                </div>
                <div class="mb-1">
                  <label for="diaChi" class="form-label">Địa Chỉ:</label>
                  <input type="text" class="form-control mb-3" id="diaChi" v-model="newNXB.DiaChi" required>
                </div>
                <button type="submit" class="btn btn-primary">Thêm Nhà Xuất Bản</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <!-- Modal Chỉnh Sửa Nhà Xuất Bản -->
      <div v-if="showEditModal" class="modal fade show" tabindex="-1" style="display: block;">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Chỉnh Sửa Nhà Xuất Bản</h5>
              <button type="button" class="btn-close" @click="closeEditModal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="capnhatNXB">
                <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
                <div class="mb-1">
                  <label for="editMaNXB" class="form-label">Mã Nhà Xuất Bản:</label>
                  <input type="text" class="form-control" id="editMaNXB" v-model="editNXBData.MaNXB" required>
                </div>
                <div class="mb-1">
                  <label for="editTenNXB" class="form-label">Tên Nhà Xuất Bản:</label>
                  <input type="text" class="form-control" id="editTenNXB" v-model="editNXBData.TenNXB" required>
                </div>
                <div class="mb-1">
                  <label for="editDiaChi" class="form-label">Địa Chỉ:</label>
                  <input type="text" class="form-control mb-3" id="editDiaChi" v-model="editNXBData.DiaChi" required>
                </div>     
                <button type="submit" class="btn btn-primary text-center">Cập Nhật Nhà Xuất Bản</button>
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
import { getAllNhaXuatBan, createNhaXuatBan, updateNhaXuatBan, deleteNhaXuatBan as apiDeleteNhaXuatBan, getNhaXuatBanBooks } from '../services/api';
import { useAuthStore } from '../stores/auth';
import { useToast } from 'vue-toastification';
import InputSearch from '@/components/InputSearch.vue';


const nhaXuatBanList = ref([]);
const loading = ref(true);
const authStore = useAuthStore();
const searchQuery = ref('');
const toast = useToast();
const showAddModal = ref(false);
const showEditModal = ref(false);
const errorMessage = ref('');

const newNXB = reactive({
  MaNXB: '',
  TenNXB: '',
  DiaChi: '',
});
const editNXBData = reactive({
  _id: '',
  MaNXB: '',
  TenNXB: '',
  DiaChi: ''
});
const addNXB = async () => {
  try {
    const response = await createNhaXuatBan(newNXB);

    if (response && response.success) {
      toast.success(`Đã thêm nhà xuất bản thành công`, {
        position: "top-right",
        timeout: 3000,
        toastClassName: "custom-toast"
      });
      
      loadNhaXuatBan();
      showAddModal.value = false;
      
      newNXB.MaNXB = '';
      newNXB.TenNXB = '';
      newNXB.DiaChi = '';
      
    } else {
      console.error("Lỗi API khi thêm nhà xuất bản:", response);
      toast.error("Lỗi không xác định khi thêm nhà xuất bản.", {
        position: "top-right",
        timeout: 3000,
        toastClassName: "custom-toast"
      });
    }
  } catch (error) {
    console.error("Lỗi thêm nhà xuất bản:", error.response ? error.response.data : error);
    toast.error("Có lỗi xảy ra khi thêm nhà xuất bản. Vui lòng thử lại.", {
      position: "top-right",
      timeout: 3000,
      toastClassName: "custom-toast"
    });
  }
}; 
const editNXB = (nxb) => {
  editNXBData._id = nxb._id;
  editNXBData.MaNXB = nxb.MaNXB;
  editNXBData.TenNXB = nxb.TenNXB;
  editNXBData.DiaChi = nxb.DiaChi;

  showEditModal.value = true;
};
const closeEditModal = () => {
  showEditModal.value = false;
  
  editNXBData._id = '';
  editNXBData.MaNXB = '';
  editNXBData.TenNXB = '';
  editNXBData.DiaChi = '';
};

const capnhatNXB = async () => {
   try {
    const nhaXuatBanData = {
      ...editNXBData,
      MaNXB: String(editNXBData.MaNXB).trim(), // Đảm bảo kiểu String
      TenNXB: String(editNXBData.TenNXB).trim(),
      DiaChi: String(editNXBData.DiaChi).trim(),
    };

    const response = await updateNhaXuatBan(editNXBData._id, nhaXuatBanData);

    if (response && response.success) {
      toast.success("🏢 Cập nhật nhà xuất bản thành công!", {
        position: "top-right",
        timeout: 3000,
        theme: "colored",
      });

      loadNhaXuatBan(); // Cập nhật danh sách sau khi chỉnh sửa
      showEditModal.value = false; // Đóng modal chỉnh sửa
    }
  } catch (error) {
    console.error("Lỗi cập nhật nhà xuất bản:", error);

    let errorMsg = "⚠️ Lỗi không xác định, vui lòng thử lại!";
    
    if (error.response && error.response.data.error) {
      if (error.response.data.error.includes("đã tồn tại")) {
        errorMsg = "⚠️ Mã Nhà Xuất Bản đã tồn tại, vui lòng chọn mã khác!";
      } else {
        errorMsg = "⚠️ Mã Nhà Xuất Bản đã tồn tại, vui lòng chọn mã khác!";
      }
    }

    toast.error(errorMsg, {
      position: "top-right",
      timeout: 4000,
      theme: "colored",
    });
  }
};

const confirmDelete = (id) => {
  if (window.confirm("Bạn có chắc chắn muốn xóa nhà xuất bản này không?")) {
    deleteNXB(id);
  }
};

const deleteNXB = async (id) => {
  try {
    const response = await apiDeleteNhaXuatBan(id);
    
    if (response?.success) {
      toast.success("Đã xóa nhà xuất bản thành công", {
        position: "top-right",
        timeout: 3000,
        toastClassName: "custom-toast"
      });
    } else {
      throw new Error(response?.message || "Lỗi không xác định");
    }
  } catch (error) {
    console.error("Lỗi xóa nhà xuất bản:", error);
    toast.error(error.response?.data?.message || "Không thể xóa vì có sách thuộc nhà xuất bản đó", {
      position: "top-right",
      timeout: 3000,
      toastClassName: "custom-toast"
    });
  } finally {
    // Dù có lỗi hay không, vẫn cập nhật danh sách
    loadNhaXuatBan();
  }
};

const filteredNhaXuatBan = computed(() => {
  let result = [...nhaXuatBanList.value];
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(nxb => 
      nxb.TenNXB.toLowerCase().includes(query) ||
      nxb.DiaChi.toLowerCase().includes(query) ||
      nxb.MaNXB.toLowerCase().includes(query)
    );
  }
  return result;
});
const loadNhaXuatBan = async () => {
  loading.value = true;
  try {
    const response = await getAllNhaXuatBan();
    nhaXuatBanList.value = response.data;
    for (let i = 0; i < nhaXuatBanList.value.length; i++) {
      const response = await getNhaXuatBanBooks(nhaXuatBanList.value[i]._id);
      const sachList = response.data;
      const newNhaXuatBan = { ...nhaXuatBanList.value[i], booksQuantity: sachList.length};
      nhaXuatBanList.value[i] = newNhaXuatBan;
    }
  } catch (error) {
    console.error('Lỗi tải sách: ', error);
  } finally {
    loading.value = false;
  }
};




onMounted(() => {
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
</style>