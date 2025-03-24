<template>
  <div class="main-content">
    <div class="container">
      <h2 class="mb-3 text-center">Danh Sách Đọc Giả</h2>
      <div class="search-bar mb-3 d-flex justify-content-between">
        <InputSearch class="search-input" v-model="searchQuery"/>
        <button class="btn btn-success mr-5" @click="showAddModal = true"><i class="fas fa-plus"></i> Thêm Đọc Giả</button>
      </div>
      <table class="table table-bordered table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Mã Đọc Giả</th>
            <th scope="col">Tên Đọc Giả</th>
            <th scope="col">Họ Lót</th>
            <th scope="col">Ngày Sinh</th>
            <th scope="col">Giới Tính</th>
            <th scope="col">Số Điện Thoại</th>
            <th scope="col">Địa Chỉ</th>
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
          <tr v-else-if="filteredDocGia.length === 0">
            <td colspan="8" class="px-6 py-4 text-center text-sm text-gray-500">
              Không tìm thấy đọc giả nào
            </td>
          </tr>
          <tr v-for="(docGia,index) in filteredDocGia" :key="docGia._id">
            <th scope="row">{{ index + 1 }}</th>
            <td>{{ docGia.MaDocGia }}</td>
            <td>{{ docGia.Ten }}</td>
            <td>{{ docGia.HoLot }}</td>
            <td>{{ formatDate(docGia.NgaySinh) }}</td>
            <td>{{ docGia.Phai }}</td>
            <td>{{ docGia.DienThoai }}</td>
            <td>{{ docGia.DiaChi }}</td>
            <td>
              <button class="btn btn-primary btn-sm mr-2" @click="editDocGia(docGia)" ><i class="fas fa-edit"></i> Chỉnh Sửa</button>
              <button class="btn btn-danger btn-sm" @click="confirmDelete(docGia._id)"><i class="fas fa-trash"></i> Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Modal Thêm Đọc Giả -->
      <div v-if="showAddModal" class="modal fade show" tabindex="-1" style="display: block;">
        <div class="modal-dialog mb-3">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Thêm Đọc Giả</h5>
              <button type="button" class="btn-close" @click="showAddModal = false"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="addDocGia">
                <div class="mb-1">
                  <label for="maDocGia" class="form-label">Mã Đọc Giả:</label>
                  <input type="text" class="form-control" id="maDocGia" v-model="newDocGia.MaDocGia" required>
                </div>
                <div class="mb-1">
                  <label for="hoLot" class="form-label">Họ Lót:</label>
                  <input type="text" class="form-control" id="hoLot" v-model="newDocGia.HoLot" required>
                </div>
                <div class="mb-1">
                  <label for="ten" class="form-label">Tên Đọc Giả:</label>
                  <input type="text" class="form-control" id="ten" v-model="newDocGia.Ten" required>
                </div>
                <div class="mb-1">
                  <label for="ngaySinh" class="form-label">Ngày Sinh:</label>
                  <input type="text" class="form-control" id="ngaySinh" v-model="newDocGia.NgaySinh" required>
                </div>
                <div class="mb-1">
                  <label for="gioiTinh" class="form-label">Giới Tính:</label>
                  <select class="form-control" id="gioiTinh" v-model="newDocGia.Phai" required>
                    <option value="" disabled>Chọn giới tính</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
                <div class="mb-1">
                  <label for="dienThoai" class="form-label">Số Điện Thoại:</label>
                  <input type="text" class="form-control" id="dienThoai" v-model="newDocGia.DienThoai" required>
                </div>
                <div class="mb-1">
                  <label for="diaChi" class="form-label">Địa Chỉ:</label>
                  <input type="text" class="form-control mb-3" id="diaChi" v-model="newDocGia.DiaChi" required>
                </div>
                <button type="submit" class="btn btn-primary">Thêm Đọc Giả</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <!-- Modal Chỉnh Sửa Đọc Giả -->
      <div v-if="showEditModal" class="modal fade show" tabindex="-1" style="display: block;">
        <div class="modal-dialog mb-3">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Chỉnh Sửa Đọc Giả</h5>
              <button type="button" class="btn-close" @click="closeEditModal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="capnhatDocGia">
                <div class="mb-1">
                  <label for="maDocGia" class="form-label">Mã Đọc Giả:</label>
                  <input type="text" class="form-control" id="maDocGia" v-model="editDocGiaData.MaDocGia" required>
                </div>
                <div class="mb-1">
                  <label for="hoLot" class="form-label">Họ Lót:</label>
                  <input type="text" class="form-control" id="hoLot" v-model="editDocGiaData.HoLot" required>
                </div>
                <div class="mb-1">
                  <label for="ten" class="form-label">Tên Đọc Giả:</label>
                  <input type="text" class="form-control" id="ten" v-model="editDocGiaData.Ten" required>
                </div>
                <div class="mb-1">
                  <label for="ngaySinh" class="form-label">Ngày Sinh:</label>
                  <input type="text " class="form-control" id="ngaySinh" v-model="editDocGiaData.NgaySinh" required>
                </div>
                <div class="mb-1">
                  <label for="gioiTinh" class="form-label">Giới Tính:</label>
                  <select class="form-control" id="gioiTinh" v-model="editDocGiaData.Phai" required>
                    <option value="" disabled>Chọn giới tính</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
                <div class="mb-1">
                  <label for="dienThoai" class="form-label">Số Điện Thoại:</label>
                  <input type="text" class="form-control" id="dienThoai" v-model="editDocGiaData.DienThoai" required>
                </div>
                <div class="mb-1">
                  <label for="diaChi" class="form-label">Địa Chỉ:</label>
                  <input type="text" class="form-control mb-3" id="diaChi" v-model="editDocGiaData.DiaChi" required>
                </div>
                <button type="submit" class="btn btn-primary">Cập Nhật Đọc Giả</button>
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
import { getAllDocGia, createDocGia, updateDocGia, deleteDocGia as apiDeleteDocGia } from '../services/api';
import { useAuthStore } from '../stores/auth';
import { useToast } from 'vue-toastification';
import InputSearch from '@/components/InputSearch.vue';
import { format } from "date-fns"; 


const docGiaList = ref([]);
const loading = ref(true);
const authStore = useAuthStore();
const searchQuery = ref('');
const toast = useToast();
const showAddModal = ref(false);
const showEditModal = ref(false);
const errorMessage = ref('');

const newDocGia = reactive({
  MaDocGia: '',
  HoLot: '',
  Ten: '',
  NgaySinh: '',
  Phai: '',
  DienThoai: '',
  DiaChi: ''
});
const editDocGiaData = reactive({
  _id: '',
  MaDocGia: '',
  HoLot: '',
  Ten: '',
  NgaySinh: '',
  Phai: '',
  DienThoai: '',
  DiaChi: ''
});

const loadDocGia = async () => {
  loading.value = true;
  try {
    const response = await getAllDocGia();
    docGiaList.value = response.data;

  } catch (error) {
    console.error('Lỗi tải đọc giả: ', error);
  } finally {
    loading.value = false;
  }
};
const addDocGia = async () => {
  try {
    if (newDocGia.NgaySinh.includes('-')) {
      const [day, month, year] = newDocGia.NgaySinh.split('-');
      newDocGia.NgaySinh = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    } else if (newDocGia.NgaySinh.includes('/')) {
      const [day, month, year] = newDocGia.NgaySinh.split('/');
      newDocGia.NgaySinh = `${year}-${month}-${day}`;
    }
    const response = await createDocGia(newDocGia);

    if (response && response.success) {
      toast.success(`Đã thêm đọc giả thành công`, {
        position: "top-right",
        timeout: 3000,
        toastClassName: "custom-toast"
      });
      
      loadDocGia();
      showAddModal.value = false;
      
      newDocGia.MaDocGia = '';
      newDocGia.HoLot = '';
      newDocGia.Ten = '';
      newDocGia.NgaySinh = '';
      newDocGia.Phai = '';
      newDocGia.DienThoai = '';
      newDocGia.DiaChi = '';
      
    } else {
      console.error("Lỗi API khi thêm đọc giả:", response);
      toast.error("Lỗi! Mã đọc giả đã bị trùng hoặc ngày sinh không hợp lệ.", {
        position: "top-right",
        timeout: 3000,
        toastClassName: "custom-toast"
      });
    }
  } catch (error) {
    console.error("Lỗi thêm đọc giả:", error.response ? error.response.data : error);
    toast.error("Có lỗi xảy ra khi thêm đọc giả. Vui lòng thử lại.", {
      position: "top-right",
      timeout: 3000,
      toastClassName: "custom-toast"
    });
  }
}; 
const editDocGia = (docGia) => {
  editDocGiaData._id = docGia._id;
  editDocGiaData.MaDocGia = docGia.MaDocGia;
  editDocGiaData.HoLot = docGia.HoLot;
  editDocGiaData.Ten = docGia.Ten;
  editDocGiaData.NgaySinh = docGia.NgaySinh
  ? format(new Date(docGia.NgaySinh), "yyyy-MM-dd")
  : "";
  editDocGiaData.Phai = docGia.Phai;
  editDocGiaData.DienThoai = docGia.DienThoai;
  editDocGiaData.DiaChi = docGia.DiaChi;

  showEditModal.value = true;
};
const closeEditModal = () => {
  showEditModal.value = false;
  
  _id = '';
  MaDocGia = '';
  HoLot = '';
  Ten = '';
  NgaySinh = '';
  Phai = '';
  DienThoai = '';
  DiaChi = '';
};

const capnhatDocGia = async () => {
  try {
    const docGiaData = {
      ...editDocGiaData,
      NgaySinh: editDocGiaData.NgaySinh ? editDocGiaData.NgaySinh.trim() : null, // Giữ nguyên định dạng từ user
    };

    const response = await updateDocGia(editDocGiaData._id, docGiaData);

    if (response && response.success) {
      toast.success("📚 Cập nhật độc giả thành công!", { position: "top-right", timeout: 3000, theme: "colored" });
      loadDocGia();
      showEditModal.value = false;
    }
  } catch (error) {
    console.error("Lỗi cập nhật độc giả:", error);
    let errorMsg = "⚠️ Lỗi không xác định, vui lòng thử lại!";
    if (error.response && error.response.data.error) {
      errorMsg = error.response.data.error;
    }
    toast.error(errorMsg, { position: "top-right", timeout: 4000, theme: "colored" });
  }
};


const confirmDelete = (id) => {
  if (window.confirm("Bạn có chắc chắn muốn xóa đọc giả này không?")) {
    deleteDocGia(id);
  }
};

const deleteDocGia = async (id) => {
  try {
    const response = await apiDeleteDocGia(id);
    
    if (response?.success) {
      toast.success("Đã xóa đọc giả thành công", {
        position: "top-right",
        timeout: 3000,
        toastClassName: "custom-toast"
      });
    } else {
      throw new Error(response?.message || "Lỗi không xác định");
    }
  } catch (error) {
    console.error("Lỗi xóa đọc giả:", error);
    toast.error(error.response?.data?.message || "Không thể đọc giả", {
      position: "top-right",
      timeout: 3000,
      toastClassName: "custom-toast"
    });
  } finally {
    // Dù có lỗi hay không, vẫn cập nhật danh sách
    loadDocGia();
  }
};

const filteredDocGia = computed(() => {
  let result = [...docGiaList.value];
  
  if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(docGia => 
        docGia.HoLot.toLowerCase().includes(query) ||
        docGia.Ten.toLowerCase().includes(query) ||
        docGia.DienThoai.toLowerCase().includes(query)
      );
    }
  return result;
});

const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
      .format(new Date(dateString))
      .replace(/\//g, '-'); ;
};

onMounted(() => {
  loadDocGia();
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
.modal-header {
  padding: 10px 10px; /* Giảm padding trên/dưới để thu nhỏ chiều cao */
}
.search-input {
  width: 350px; /* Làm cho input nhỏ lại */
}
</style>