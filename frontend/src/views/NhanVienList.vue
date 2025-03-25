<template>
  <div class="main-content">
    <div class="container">
      <h2 class=" text-center">Danh Sách Nhân Viên</h2>
      <div class="search-bar mb-3 d-flex justify-content-between">
        <InputSearch class="search-input" v-model="searchQuery"/>
        <button class="btn btn-success mr-5" @click="showAddModal = true"><i class="fas fa-plus"></i> Thêm Nhân Viên</button>
      </div>
      <table class="table table-bordered table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Mã số NV</th>
            <th scope="col">Họ Tên</th>
            <th scope="col">Chức vụ</th>
            <th scope="col">Địa chỉ</th>
            <th scope="col">Số điện thoại</th>
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
          <tr v-else-if="filteredNhanVien.length === 0">
            <td colspan="8" class="px-6 py-4 text-center text-sm text-gray-500">
              Bạn không có quyền truy cập
            </td>
          </tr>
          <tr v-for="(nv,index) in filteredNhanVien" :key="nv._id">
            <th scope="row">{{ index + 1 }}</th>
            <td>{{ nv.MSNV }}</td>
            <td>{{ nv.HoTenNV }}</td>
            <td>{{ nv.ChucVu }}</td>
            <td>{{ nv.DiaChi}}</td>
            <td>{{ nv.SoDienThoai }}</td>
            <td>
              <button class="btn btn-primary btn-sm mr-2" @click="editNhanVien(nv)" ><i class="fas fa-edit"></i> Chỉnh Sửa</button>
              <button class="btn btn-danger btn-sm" @click="confirmDelete(nv._id)"><i class="fas fa-trash"></i> Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>

            <!-- Modal Thêm Nhân Viên -->
      <div v-if="showAddModal" class="modal fade show" tabindex="-1" style="display: block;">
        <div class="modal-dialog mb-3">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Thêm Nhân Viên</h5>
              <button type="button" class="btn-close" @click="showAddModal = false"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="addNhanVien">
                <div class="mb-1">
                  <label for="MSNV" class="form-label">Mã Số Nhân Viên:</label>
                  <input type="text" class="form-control" id="MSNV" v-model="newNhanVien.MSNV" required>
                </div>
                <div class="mb-1">
                  <label for="hoVaTen" class="form-label">Họ và Tên:</label>
                  <input type="text" class="form-control" id="hoVaTen" v-model="newNhanVien.HoTenNV" required>
                </div>
                <div class="mb-1">
                  <label for="chucVu" class="form-label">Chức Vụ:</label>
                  <select class="form-control" id="chucVu" v-model="newNhanVien.ChucVu" required>
                    <option value="" disabled>Chọn chức vụ</option>
                    <option value="Quan Tri Vien">Quản Trị Viên</option>
                    <option value="Thu Thu">Thủ Thư</option>
                  </select>
                </div>
                <div class="mb-1">
                  <label for="diaChi" class="form-label">Địa Chỉ:</label>
                  <input type="text" class="form-control" id="diaChi" v-model="newNhanVien.DiaChi" required>
                </div>
                <div class="mb-1">
                  <label for="soDienThoai" class="form-label">Số Điện Thoại:</label>
                  <input 
                  type="text" 
                  class="form-control mb-3" 
                  id="soDienThoai" v-model="newNhanVien.SoDienThoai" 
                  @input="validatePhoneNumber(newNhanVien.SoDienThoai, 'new')" 
                  required>
                  <div v-if="phoneError.new" class="text-danger">
                    Số điện thoại phải có đúng 10 chữ số.
                  </div>
                </div>
                <div class="text-center mt-3">
                  <button type="submit" class="btn btn-primary">Thêm Nhân Viên</button>
                </div>                    
              </form>
            </div>
          </div>
        </div>
      </div>
      <!-- Modal Chỉnh Sửa Nhân Viên -->
      <div v-if="showEditModal" class="modal fade show" tabindex="-1" style="display: block;">
        <div class="modal-dialog mb-3">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Chỉnh Sửa Nhân Viên</h5>
              <button type="button" class="btn-close" @click="closeEditModal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="capnhatNhanVien">
                <div class="mb-1">
                  <label for="MSNV" class="form-label">Mã Số Nhân Viên:</label>
                  <input type="text" class="form-control" id="MSNV" v-model="editNhanVienData.MSNV" required>
                </div>
                <div class="mb-1">
                  <label for="hoVaTen" class="form-label">Họ và Tên:</label>
                  <input type="text" class="form-control" id="hoVaTen" v-model="editNhanVienData.HoTenNV" required>
                </div>
                <div class="mb-1">
                  <label for="chucVu" class="form-label">Chức Vụ:</label>
                  <select class="form-control" id="chucVu" v-model="editNhanVienData.ChucVu" required>
                    <option value="" disabled>Chọn chức vụ</option>
                    <option value="Quan Tri Vien">Quản Trị Viên</option>
                    <option value="Thu Thu">Thủ Thư</option>
                  </select>
                </div>
                <div class="mb-1">
                  <label for="diaChi" class="form-label">Địa Chỉ:</label>
                  <input type="text" class="form-control" id="diaChi" v-model="editNhanVienData.DiaChi" required>
                </div>
                <div class="mb-1">
                  <label for="soDienThoai" class="form-label">Số Điện Thoại:</label>
                  <input 
                  type="text" 
                  class="form-control mb-3" 
                  id="soDienThoai" 
                  v-model="editNhanVienData.SoDienThoai" 
                  @input="validatePhoneNumber(editNhanVienData.SoDienThoai, 'edit')" 
                  required>
                  <div v-if="phoneError.edit" class="text-danger">
                    Số điện thoại phải có đúng 10 chữ số.
                  </div>
                </div>
                <div class="text-center mt-3">
                  <button type="submit" class="btn btn-primary">Cập Nhật Nhân Viên</button>
                </div>         
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
import { getAllNhanVien, createNhanVien, updateNhanVien, deleteNhanVien as apiDeleteNhanVien } from '../services/api';
import { useAuthStore } from '../stores/auth';
import { useToast } from 'vue-toastification';
import InputSearch from '@/components/InputSearch.vue';
import { format } from "date-fns"; 

const nhanVienList = ref([]);
const loading = ref(true);
const authStore = useAuthStore();
const searchQuery = ref('');
const toast = useToast();
const showAddModal = ref(false);
const showEditModal = ref(false);
const errorMessage = ref('');


const newNhanVien = reactive({
  MSNV: '',
  HoTenNV: '',
  ChucVu: '',
  DiaChi: '',
  SoDienThoai: ''
});

const editNhanVienData = reactive({
  _id: '',
  MSNV: '',
  HoTenNV: '',
  ChucVu: '',
  DiaChi: '',
  SoDienThoai: ''
});
const phoneError = reactive({
  new: false, // Lỗi cho modal thêm mới
  edit: false // Lỗi cho modal chỉnh sửa
});

const validatePhoneNumber = (phone, type) => {
  const phoneRegex = /^\d{10}$/; // Chỉ chấp nhận 10 chữ số
  phoneError[type] = !phoneRegex.test(phone);
};
const loadNhanVien  = async () => {
  loading.value = true;
  try {
    const response = await getAllNhanVien();
    nhanVienList.value = response.data;

  } catch (error) {
    console.error('Lỗi tải nhân viên: ', error);
  } finally {
    loading.value = false;
  }
};
const filteredNhanVien = computed(() => {
  let result = [...nhanVienList.value];
  
  if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(nhanVien => 
        nhanVien.MSNV.toLowerCase().includes(query) ||
        nhanVien.HoTenNV.toLowerCase().includes(query) ||
        nhanVien.ChucVu.toLowerCase().includes(query) ||
        nhanVien.DiaChi.toLowerCase().includes(query) ||
        nhanVien.SoDienThoai.toLowerCase().includes(query)
      );
    }
  return result;
});

const addNhanVien = async () => {
  validatePhoneNumber(newNhanVien.SoDienThoai, 'new');
  if (phoneError.new) {
    toast.error("Số điện thoại không hợp lệ. Vui lòng kiểm tra lại.", {
      position: "top-right",
      timeout: 3000,
      toastClassName: "custom-toast"
    });
    return;
  }
  try {
    const response = await createNhanVien(newNhanVien);

    if (response && response.success) {
      toast.success("🎉 Đã thêm nhân viên thành công!", {
        position: "top-right",
        timeout: 3000,
        toastClassName: "custom-toast",
      });

      loadNhanVien(); // Cập nhật danh sách nhân viên
      showAddModal.value = false; // Đóng modal thêm nhân viên

      // Reset lại dữ liệu nhập vào
      newNhanVien.MSNV = "";
      newNhanVien.HoTenNV = "";
      newNhanVien.ChucVu = "";
      newNhanVien.DiaChi = "";
      newNhanVien.SoDienThoai = "";
    } else {
      console.error("Lỗi API khi thêm nhân viên:", response);
      toast.error("⚠️ Lỗi! Mã nhân viên đã bị trùng hoặc thông tin không hợp lệ.", {
        position: "top-right",
        timeout: 3000,
        toastClassName: "custom-toast",
      });
    }
  } catch (error) {
    console.error("Lỗi thêm nhân viên:", error.response ? error.response.data : error);
    toast.error("❌ Có lỗi xảy ra khi thêm nhân viên. Vui lòng thử lại.", {
      position: "top-right",
      timeout: 3000,
      toastClassName: "custom-toast",
    });
  }
};

const editNhanVien = (nv) => {
  editNhanVienData._id = nv._id;
  editNhanVienData.MSNV = nv.MSNV;
  editNhanVienData.HoTenNV = nv.HoTenNV;
  editNhanVienData.ChucVu = nv.ChucVu;
  editNhanVienData.DiaChi = nv.DiaChi;
  editNhanVienData.SoDienThoai = nv.SoDienThoai;
  
  showEditModal.value = true;
};
const closeEditModal = () => {
  showEditModal.value = false;
  
  _id = '';
  MSNV = '';
  HoTenNV = ''; 
  ChucVu = '';
  DiaChi = '';
  SoDienThoai = '';
};
const capnhatNhanVien = async () => {
  validatePhoneNumber(editNhanVienData.SoDienThoai, 'edit');
  if (phoneError.edit) {
    toast.error("Số điện thoại không hợp lệ. Vui lòng kiểm tra lại.", {
      position: "top-right",
      timeout: 3000,
      toastClassName: "custom-toast"
    });
    return;
  }
  try {
    const nhanVienData = {
      ...editNhanVienData,
      MSNV: editNhanVienData.MSNV.trim(),
      HoTenNV: editNhanVienData.HoTenNV.trim(),
      ChucVu: editNhanVienData.ChucVu.trim(),
      DiaChi: editNhanVienData.DiaChi.trim(),
      SoDienThoai: editNhanVienData.SoDienThoai.trim(),
    };

    const response = await updateNhanVien(editNhanVienData._id, nhanVienData);

    if (response && response.success) {
      toast.success("👨‍💼 Cập nhật nhân viên thành công!", {
        position: "top-right",
        timeout: 3000,
        theme: "colored",
      });

      loadNhanVien(); // Cập nhật danh sách nhân viên
      showEditModal.value = false; // Đóng modal chỉnh sửa
    }
  } catch (error) {
    console.error("Lỗi cập nhật nhân viên:", error);

    let errorMsg = "⚠️ Lỗi không xác định, vui lòng thử lại!";
    if (error.response && error.response.data.error) {
      errorMsg = error.response.data.error;
    }

    toast.error(errorMsg, {
      position: "top-right",
      timeout: 4000,
      theme: "colored",
    });
  }
};
const confirmDelete = (id) => {
  if (window.confirm("Bạn có chắc chắn muốn xóa nhân viên này không?")) {
    deleteNhanVien(id);
  }
};

const deleteNhanVien = async (id) => {
  try {
    const response = await apiDeleteNhanVien(id);
    
    if (response?.success) {
      toast.success("Đã xóa nhân viên thành công", {
        position: "top-right",
        timeout: 3000,
        toastClassName: "custom-toast"
      });
    } else {
      throw new Error(response?.message || "Lỗi không xác định");
    }
  } catch (error) {
    console.error("Lỗi xóa nhân viên:", error);
    toast.error(error.response?.data?.message || "Không thể xóa vì có sách thuộc nhà xuất bản đó", {
      position: "top-right",
      timeout: 3000,
      toastClassName: "custom-toast"
    });
  } finally {
    // Dù có lỗi hay không, vẫn cập nhật danh sách
    loadNhanVien();
  }
};



onMounted(() => {
  loadNhanVien();
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