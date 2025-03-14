import apiClient from './api';

class TheoDoiMuonSachService {
  constructor(baseUrl = "/muonsach") {
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

  async returnBook(id) {
    return (await this.api.put(`${this.baseUrl}/${id}/return`)).data;
  }

  async getBorrowingBooks() {
    return (await this.api.get(`${this.baseUrl}/borrowing`)).data;
  }

  async getOverdueBooks() {
    return (await this.api.get(`${this.baseUrl}/overdue`)).data;
  }

  async getBorrowingStatistics() {
    return (await this.api.get(`${this.baseUrl}/statistics`)).data;
  }
}

export default new TheoDoiMuonSachService();