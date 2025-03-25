<template>
  <div class="main-content">
    <div class="container">
      <h2 class=" text-center">Danh Sách Mượn Sách</h2>
      <div class="search-bar mb-3 d-flex justify-content-between">
        <InputSearch class="search-input" v-model="searchQuery"/>
        <button class="btn btn-success mr-5" @click="showAddModal = true"><i class="fas fa-plus"></i>  Thêm Phiếu Mượn Sách</button>
      </div>
      <table class="table table-bordered table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Mã Sách</th>
            <th scope="col">Tên Sách</th>
            <th scope="col">Tác Giả</th>
            <th scope="col">Mã Đọc Giả</th>
            <th scope="col">Họ Tên Đọc Giả</th>
            <th scope="col">MSNV Tạo Phiếu</th>
            <th scope="col">Ngày Mượn</th>
            <th scope="col">Ngày Trả</th>
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
          <tr v-else-if="filteredMuonSach.length === 0">
            <td colspan="8" class="px-6 py-4 text-center text-sm text-gray-500">
              Không tìm thấy phiếu mượn nào
            </td>
          </tr>
          <tr v-for="(muonSach,index) in filteredMuonSach" :key="muonSach._id">
            <th scope="row">{{ index + 1 }}</th>
            <td>{{ muonSach.MaSach.MaSach }}</td>
            <td>{{ muonSach.MaSach.TenSach }}</td>
            <td>{{ muonSach.MaSach.TacGia }}</td>
            <td>{{ muonSach.MaDocGia.MaDocGia }}</td>
            <td>{{ muonSach.MaDocGia.HoLot + " " + muonSach.MaDocGia.Ten }}</td>
            <td>{{ muonSach.MSNV.MSNV }}</td>
            <td>{{ formatDate(muonSach.NgayMuon) }}</td>
            <td>{{ muonSach.NgayTra ? formatDate(muonSach.NgayTra) : (isOverdue(muonSach.NgayMuon) ? "Quá hạn" :  "Đang mượn") }}</td>
            <td>
              <button class="btn btn-primary btn-sm mr-2" @click="editMuonSach(muonSach)"><i class="fas fa-edit"></i> Chỉnh Sửa</button>
              <button class="btn btn-danger btn-sm" @click="confirmDelete(muonSach._id)" ><i class="fas fa-trash"></i> Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Modal Thêm Phiếu Mượn Sách -->
      <div v-if="showAddModal" class="modal fade show" tabindex="-1" style="display: block;">
        <div class="modal-dialog mb-3">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Mượn Sách</h5>
              <button type="button" class="btn-close" @click="showAddModal = false"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="addMuonSach">
                <div class="mb-1">
                  <label for="maSach" class="form-label">Mã Sách:</label>
                  <select class="form-control" id="maSach" v-model="newMuonSach.MaSach" required>
                    <option v-for="sach in sachList" :key="sach._id" :value="sach.MaSach">
                      {{ sach.MaSach + " - " + sach.TenSach }}
                    </option>
                  </select>
                </div>
                <div class="mb-1">
                  <label for="maDocGia" class="form-label">Mã Độc Giả:</label>
                  <select class="form-control" id="maDocGia" v-model="newMuonSach.MaDocGia" required>
                    <option v-for="docGia in docGiaList" :key="docGia._id" :value="docGia.MaDocGia">
                      {{ docGia.MaDocGia + " - " + docGia.HoLot + " " + docGia.Ten }}
                    </option>
                  </select>
                </div>
                <div class="mb-1">
                  <label for="ngayMuon" class="form-label">Ngày Mượn:</label>
                  <input type="text" class="form-control" id="ngayMuon" v-model="newMuonSach.NgayMuon" required>
                </div>
                <div class="text-center mt-2">
                  <button type="submit" class="btn btn-primary mt-3">Thêm Phiếu Mượn</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <!-- Modal Chỉnh Sửa Mượn Sách -->
      <div v-if="showEditModal" class="modal fade show" tabindex="-1" style="display: block;">
        <div class="modal-dialog mb-3">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Trả Sách</h5>
              <button type="button" class="btn-close" @click="closeEditModal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="capnhatMuonSach">
                <div class="mb-1">
                  <label for="maSach" class="form-label">Mã Sách:</label>
                  <input type="text" class="form-control" id="maSach" v-model="editMuonSachData.MaSach" disabled>
                </div>
                <div class="mb-1">
                  <label for="maDocGia" class="form-label">Mã Đọc Giả:</label>
                  <input type="text" class="form-control" id="maDocGia" v-model="editMuonSachData.MaDocGia" disabled>
                </div>
                <div class="mb-1">
                  <label for="ngayMuon" class="form-label">Ngày Mượn:</label>
                  <input type="text" class="form-control" id="ngayMuon" v-model="editMuonSachData.NgayMuon" disabled>
                </div>
                <div class="mb-1">
                  <label for="ngayMuon" class="form-label">Ngày Trả:</label>
                  <input type="text" class="form-control" id="ngayMuon" v-model="editMuonSachData.NgayTra" required >
                </div>
                <div class="text-center mt-2">
                  <button type="submit" class="btn btn-primary mt-3">Trả Sách</button>
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
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { getAllMuonSach, createMuonSach, returnBook, getAllDocGia, getAllSach, deleteMuonSach as apiDeleteMuonSach } from '../services/api';
import { useAuthStore } from '../stores/auth';
import { useToast } from 'vue-toastification';
import InputSearch from '@/components/InputSearch.vue';
import { format } from "date-fns"; 

// State
const muonSachList = ref([]);
const docGiaList = ref([]);
const sachList = ref([]);

const loading = ref(true);

const toast = useToast();
const searchQuery = ref('');

const showAddModal = ref(false);
const showEditModal = ref(false);

const newMuonSach = reactive({
  MaSach: '',
  MaDocGia: '',
  NgayMuon: ''
});

const editMuonSachData = reactive({
  _id: '',
  MaSach: '',
  MaDocGia: '',
  NgayMuon: '',
  NgayTra: ''
});

const closeEditModal = () => {
  showEditModal.value = false;
  _id = '';
  MaSach = '';
  MaDocGia = '';
  NgayMuon = '';
  NgayTra = '';
};

const loadMuonSach = async () => {
  loading.value = true;
  try {
    const response = await getAllMuonSach();
    muonSachList.value = response.data;
    for (const muonSach of muonSachList.value) {
      muonSach.TrangThai = muonSach.NgayTra ? formatDate(muonSach.NgayTra) : isOverdue(muonSach.NgayMuon) ? "Quá hạn" : "Đang mượn"
    }
  } catch (error) {
    console.error('Lỗi tải phiếu mượn sách: ', error);
  } finally {
    loading.value = false;
  }
};
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
const loadSach = async () => {
  loading.value = true;
  try {
    const response = await getAllSach({avaiable: true});
    sachList.value = response.data;
  } catch (error) {
    console.error('Lỗi tải sách: ', error);
  } finally {
    loading.value = false;
  }
};
const filteredMuonSach = computed(() => {
  let result = [...muonSachList.value];
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(muonSach => 
      muonSach.MaSach.MaSach.toLowerCase().includes(query) || 
      muonSach.MaSach.TenSach.toLowerCase().includes(query) ||
      muonSach.MaDocGia.MaDocGia.toLowerCase().includes(query) ||
      muonSach.MaDocGia.HoLot.toLowerCase().includes(query) ||
      muonSach.MaDocGia.Ten.toLowerCase().includes(query) ||
      muonSach.TrangThai.toLowerCase().includes(query)
    );
  }
  return result;
});
const addMuonSach = async () => {
  try {
    // Kiểm tra định dạng ngày mượn (DD-MM-YYYY hoặc DD/MM/YYYY)
    const dateRegex = /^\d{2}[-/]\d{2}[-/]\d{4}$/;
    if (!dateRegex.test(newMuonSach.NgayMuon)) {
      toast.error("⚠️ Ngày mượn không hợp lệ! Vui lòng nhập theo định dạng DD-MM-YYYY hoặc DD/MM/YYYY.", {
        position: "top-right",
        timeout: 4000,
        theme: "colored"
      });
      return;
    }
    
    // Chuyển đổi ngày mượn thành định dạng chuẩn (YYYY-MM-DD)
    const [day, month, year] = newMuonSach.NgayMuon.split(/[-/]/);
    const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    
    // Kiểm tra sách có bị trùng lặp không
    const isDuplicate = muonSachList.value.some((muonSach) => {
      const existingMaDocGia = typeof muonSach.MaDocGia === 'object' ? muonSach.MaDocGia.MaDocGia : muonSach.MaDocGia;
      const existingMaSach = typeof muonSach.MaSach === 'object' ? muonSach.MaSach.MaSach : muonSach.MaSach;
      const existingNgayMuon = new Date(muonSach.NgayMuon).toISOString().split("T")[0];
      
      return (
        existingMaDocGia === newMuonSach.MaDocGia &&
        existingMaSach === newMuonSach.MaSach &&
        existingNgayMuon === formattedDate
      );
    });
    if (isDuplicate) {
      toast.error("⚠️ Phiếu mượn đã tồn tại! Không thể mượn sách trùng lặp.", {
        position: "top-right",
        timeout: 4000,
        theme: "colored"
      });
      return;
    }
    
    // Cập nhật ngày mượn thành định dạng chuẩn trước khi gửi
    newMuonSach.NgayMuon = formattedDate;
    
    // Gọi API để thêm phiếu mượn
    const response = await createMuonSach(newMuonSach);
    
    if (response.success) {
      toast.success("📚 Mượn sách thành công!", {
        position: "top-right",
        timeout: 3000,
        theme: "colored"
      });

      // Tải lại danh sách mượn sách
      loadMuonSach();
      showAddModal.value = false;

      // Reset dữ liệu form
      newMuonSach.MaSach = "";
      newMuonSach.MaDocGia = "";
      newMuonSach.NgayMuon = "";
    } else {
      toast.error(response.message || "Lỗi không xác định khi mượn sách!", {
        position: "top-right",
        timeout: 4000,
        theme: "colored"
      });
    }
  } catch (error) {
    console.error("Lỗi từ server:", error.response ? error.response.data : error);
    
    let errorMsg = "❌ Không thể mượn sách.";
    if (error.response && error.response.data && error.response.data.message) {
      const serverMsg = error.response.data.message;
      if (serverMsg === "Sách đã hết, không thể mượn") {
        errorMsg = "❌ Không thể mượn! Sách này đã hết số lượng.";
      } else if (serverMsg === "Ngày mượn không hợp lệ") {
        errorMsg = "⚠️ Ngày mượn không hợp lệ! Vui lòng nhập đúng định dạng DD-MM-YYYY hoặc DD/MM/YYYY.";
      } else {
        errorMsg = `⚠️ ${serverMsg}`;
      }
    }
    toast.error(errorMsg, {
      position: "top-right",
      timeout: 4000,
      theme: "colored"
    });
  }
};
// Hàm cập nhật phiếu mượn
const capnhatMuonSach = async () => {
  try {
    if (!editMuonSachData._id) {
      toast.error("⚠️ Không tìm thấy ID phiếu mượn. Vui lòng thử lại.", {
        position: "top-right",
        timeout: 4000,
        theme: "colored"
      });
      return;
    }
    // Chuyển đổi Ngày Mượn & Ngày Trả thành đối tượng Date
    const ngayMuon = new Date(editMuonSachData.NgayMuon);
    const ngayTra = new Date(editMuonSachData.NgayTra);

    // Loại bỏ giờ, phút, giây để lấy phần ngày (YYYY-MM-DD)
    const ngayMuonLocal = new Date(ngayMuon.getFullYear(), ngayMuon.getMonth(), ngayMuon.getDate());
    const ngayTraLocal = new Date(ngayTra.getFullYear(), ngayTra.getMonth(), ngayTra.getDate());

    // Kiểm tra nếu ngày trả nhỏ hơn ngày mượn
    if (ngayTraLocal < ngayMuonLocal) {
      toast.error("⚠️ Ngày trả không thể nhỏ hơn ngày mượn!", {
        position: "top-right",
        timeout: 4000,
        theme: "colored"
      });
      return;
    }
    // Định dạng lại ngày trả thành chuỗi "YYYY-MM-DD"
    const ngayTraFormatted = ngayTraLocal.toISOString().split("T")[0];
    console.log("Ngày trả đã format:", ngayTraFormatted);

    // Gọi API để cập nhật phiếu mượn với NgàyTrả đã định dạng
    const response = await returnBook(editMuonSachData._id, {
      NgayTra: editMuonSachData.NgayTra
    });

    if (response && response.success) {
      toast.success("✅ Cập nhật phiếu mượn thành công!", {
        position: "top-right",
        timeout: 3000,
        theme: "colored"
      });

      // Làm mới danh sách phiếu mượn và đóng modal chỉnh sửa
      loadMuonSach();
      showEditModal.value = false;
    } else {
      console.error("Lỗi API khi cập nhật:", response);
      toast.error("⚠️ Ngày trả không hợp lệ! Vui lòng nhập đúng định dạng DD-MM-YYYY hoặc DD/MM/YYYY.", {
        position: "top-right",
        timeout: 3000,
        theme: "colored"
      });
    }
  } catch (error) {
    console.error("Lỗi cập nhật phiếu mượn:", error.response ? error.response.data : error);

    let errorMsg = "❌ Không thể cập nhật phiếu mượn. Vui lòng thử lại.";
    if (error.response && error.response.data && error.response.data.message) {
      errorMsg = `⚠️ ${error.response.data.message}`;
    }

    toast.error(errorMsg, {
      position: "top-right",
      timeout: 4000,
      theme: "colored"
    });
  }
};
const editMuonSach = (muonSach) => {
  editMuonSachData._id = muonSach._id;
  editMuonSachData.MaSach = muonSach.MaSach.MaSach + " - " + muonSach.MaSach.TenSach;
  editMuonSachData.MaDocGia = muonSach.MaDocGia.MaDocGia + " - " + muonSach.MaDocGia.HoLot + " " + muonSach.MaDocGia.Ten;
  editMuonSachData.NgayMuon = muonSach.NgayMuon
  ? format(new Date(muonSach.NgayMuon), "yyyy-MM-dd")
  : "";
  editMuonSachData.NgayTra = muonSach.NgayTra
  ? format(new Date(muonSach.NgayTra), "yyyy-MM-dd")
  : "";

  showEditModal.value = true;
};

const confirmDelete = (id) => {
  if (window.confirm("Bạn có chắc chắn muốn xóa phiếu mượn này không?")) {
    deleteMuonSach(id);
  }
};

const deleteMuonSach = async (id) => {
  try {
    const response = await apiDeleteMuonSach(id);
    
    if (response?.success) {
      toast.success("Đã xóa phiếu mượn sách thành công", {
        position: "top-right",
        timeout: 3000,
        toastClassName: "custom-toast"
      });
    } else {
      throw new Error(response?.message || "Lỗi không xác định");
    }
  } catch (error) {
    console.error("Lỗi xóa phiếu muợn:", error);
    toast.error(error.response?.data?.message || "Không thể xóa phiếu mượn", {
      position: "top-right",
      timeout: 3000,
      toastClassName: "custom-toast"
    });
  } finally {
    // Dù có lỗi hay không, vẫn cập nhật danh sách
    loadMuonSach();
  }
};
const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
      .format(new Date(dateString))
      .replace(/\//g, '-'); ;
};

const isOverdue = (ngayMuon) => {
    // Chuyển ngayMuon sang Date nếu nó là chuỗi
    const ngayMuonDate = new Date(ngayMuon);
    if (isNaN(ngayMuonDate.getTime())) return false; // Kiểm tra nếu ngày không hợp lệ

    // Lấy ngày hiện tại trừ 30 ngày
    const ngayQuaHan = new Date();
    ngayQuaHan.setDate(ngayQuaHan.getDate() - 30); // Lùi lại 30 ngày

    return ngayMuonDate < ngayQuaHan; // Nếu ngày mượn nhỏ hơn ngày quá hạn thì đã quá hạn
};
// Hàm kiểm tra ngày mượn & ngày trả hợp lệ


onMounted(() => {
  loadSach();
  loadDocGia();
  loadMuonSach();
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