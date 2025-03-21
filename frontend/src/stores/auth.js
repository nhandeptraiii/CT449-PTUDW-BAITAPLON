import { defineStore } from 'pinia';
import { login, getMe } from '../services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    nhanVien: null,
    isNhanVienLoaded: false,
    token: localStorage.getItem('token') || null,
  }),

  getters: {
    isLibrarian: (state) => state.nhanVien?.ChucVu === "Thu Thu",
    isAdmin: (state) => state.nhanVien?.ChucVu === "Quan Tri Vien",
  },

  actions: {
    async fetchCurrentNhanVien() {
      try {
        this.isNhanVienLoaded = false;

        if (!this.token) {
          this.nhanVien = null;
          this.isNhanVienLoaded = true;
          return;
        }
        const response = await getMe();
        this.nhanVien = response.data;  
      } catch (error) {
        console.error('Lỗi lấy thông tin nhân viên:', error);
        this.nhanVien = null;
        this.logout();
      } finally {
        this.isNhanVienLoaded = true;
      }
    },

    async login(credentials) {
      try {
        const response = await login(credentials);
        if (response?.data?.token) {
          this.token = response.data.token;
          localStorage.setItem('token', response.data.token);
          await this.fetchCurrentNhanVien();
          return true;
        }
      } catch (error) {
        console.error('Lỗi đăng nhập:', error);
      }
      return false;
    },

    async logout() {
      this.token = null;
      this.nhanVien = null;
      localStorage.removeItem('token');
    },
  },
});