import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// export default apiClient;
// Thêm interceptor để tự động thêm token vào header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
    export const login = async (credentials) => {
    try{
        const response = await api.post('/auth/login', credentials);
        return response;
    } catch (error) {
        console.error('Login error:', error);
    }
    return false
    };

    export const getMe = async () => {
    const response = await api.get('/auth/me');
    return response.data;
    };

    // Nhan Vien API
export const createNhanVien = async (nhanVienData) => {
  try {
    const response = await api.post('/nhanvien', nhanVienData);
    return response.data;
  } catch (error) {
    console.error('Lỗi tạo nhân viên:', error);
    return null;
  }
};

export const getAllNhanVien = async () => {
  const response = await api.get('/nhanvien');
  return response.data;
};

export const getNhanVienById = async (id) => {
  const response = await api.get(`/nhanvien/${id}`);
  return response.data;
};

export const updateNhanVien = async (id, nhanVienData) => {
  const response = await api.put(`/nhanvien/${id}`, nhanVienData);
  return response.data;
};

export const deleteNhanVien = async (id) => {
  try {
    const response = await api.delete(`/nhanvien/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi xóa nhân viên với ID ${id}:`, error);
    return null;
  }
};


// Sach API
export const createSach = async (sachData) => {
  try {
    const response = await api.post('/sach', sachData);
    return response.data;
  } catch (error) {
    console.error('Lỗi tạo sách:', error);
    return null;
  }
};

export const getAllSach = async () => {
  const response = await api.get('/sach');
  return response.data;
};

export const getSachById = async (id) => {
  const response = await api.get(`/sach/${id}`);
  return response.data;
};

export const updateSach = async (id, sachData) => {
  const response = await api.put(`/sach/${id}`, sachData);
  return response.data;
};

export const deleteSach = async (id) => {
  try {
    const response = await api.delete(`/sach/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi xóa sách với ID ${id}:`, error);
    return null;
  }
};

export const getSachBorrowHistory = async (id) => {
  const response = await api.get(`/sach/${id}/borrowings`);
  return response.data;
};

export const getSachAvailability = async (id) => {
  const response = await api.get(`/sach/${id}/availability`);
  return response.data;
};

// Nha Xuat Ban API
export const createNhaXuatBan = async (nhaXuatBanData) => {
  try {
    const response = await api.post('/nhaxuatban', nhaXuatBanData);
    return response.data;
  } catch (error) {
    console.error('Lỗi tạo nxb:', error);
    return null;
  }
};

export const getAllNhaXuatBan = async () => {
  const response = await api.get('/nhaxuatban');
  return response.data;
};

export const getNhaXuatBanById = async (id) => {
  const response = await api.get(`/nhaxuatban/${id}`);
  return response.data;
};

export const updateNhaXuatBan = async (id, nhaXuatBanData) => {
  const response = await api.put(`/nhaxuatban/${id}`, nhaXuatBanData);
  return response.data;
};

export const deleteNhaXuatBan = async (id) => {
  try {
    const response = await api.delete(`/nhaxuatban/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi xóa nhà xuất bản với ID ${id}:`, error);
    return null;
  }
};

export const getNhaXuatBanBooks = async (id) => {
  const response = await api.get(`/nhaxuatban/${id}/books`);
  return response.data;
};



// Doc Gia API
export const createDocGia = async (docGiaData) => {
  try {
    const response = await api.post('/docgia', docGiaData);
    return response.data;
  } catch (error) {
    console.error('Lỗi tạo độc giả:', error);
    return null;
  }
};

export const getAllDocGia = async () => {
  const response = await api.get('/docgia');
  return response.data;
};

export const getDocGiaById = async (id) => {
  const response = await api.get(`/docgia/${id}`);
  return response.data;
};

export const updateDocGia = async (id, docGiaData) => {
  const response = await api.put(`/docgia/${id}`, docGiaData);
  return response.data;
};

export const deleteDocGia = async (id) => {
  try {
    const response = await api.delete(`/docgia/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi xóa sách với ID ${id}:`, error);
    return null;
  }
};

export const getDocGiaBorrowHistory = async (id) => {
  const response = await api.get(`/docgia/${id}/borrowings`);
  return response.data;
};

// Muon Sach API
export const createMuonSach = async (muonSachData) => {
  try {
    const response = await api.post('/muonsach', muonSachData);
    return response.data;
  } catch (error) {
    console.error('Lỗi tạo phiếu mượn sách:', error);
    return null;
  }
};

export const getAllMuonSach = async () => {
  const response = await api.get('/muonsach');
  return response.data;
};

export const getMuonSachById = async (id) => {
  const response = await api.get(`/muonsach/${id}`);
  return response.data;
};

export const updateMuonSach = async (muonSachData) => {
  const response = await api.put(`/muonsach/${id}`, muonSachData);
  return response.data;
};

export const returnBook = async () => {
  const response = await api.put(`/muonsach/${id}/return`);
  return response.data;
};

export const getBorrowingBooks = async () => {
  const response = await api.get('muonsach/borrowing');
  return response.data;
};
export const getOverdueBooks = async () => {
  const response = await api.get('muonsach/overdue');
  return response.data;
};

export const getBorrowingStatistics = async () => {
  const response = await api.get('muonsach/statistics');
  return response.data;
};