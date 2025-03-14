import apiClient from './api';

class NhanVienService {
  constructor(baseUrl = "/nhanvien") {
    this.api = apiClient;
    this.baseUrl = baseUrl;
  }

  async getAll() {
    return (await this.api.get(this.baseUrl)).data;
  }

  async create(data) {
    return (await this.api.post(this.baseUrl, data)).data;
  }

  async deleteAll() {
    return (await this.api.delete(this.baseUrl)).data;
  }

  async get(id) {
    return (await this.api.get(`${this.baseUrl}/${id}`)).data;
  }

  async update(id, data) {
    return (await this.api.put(`${this.baseUrl}/${id}`, data)).data;
  }

  async delete(id) {
    return (await this.api.delete(`${this.baseUrl}/${id}`)).data;
  }

  async login(credentials) {
    return (await this.api.post('/auth/login', credentials)).data;
  }

  async getCurrentUser() {
    return (await this.api.get('/auth/me')).data;
  }

  async changePassword(id, data) {
    return (await this.api.put(`${this.baseUrl}/${id}/change-password`, data)).data;
  }
}

export default new NhanVienService();