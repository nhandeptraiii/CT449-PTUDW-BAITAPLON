import apiClient from './api';

class AuthService {
  constructor(baseUrl = "/auth") {
    this.api = apiClient;
    this.baseUrl = baseUrl;
  }

  async login(user) {
    return (await this.api.post(`${this.baseUrl}/login`, user)).data;
  }

  async getCurrentUser() {
    return (await this.api.get(`${this.baseUrl}/me`)).data;
  }

  async changePassword(id, data) {
    return (await this.api.put(`/nhanvien/${id}/change-password`, data)).data;
  }
}

export default new AuthService();