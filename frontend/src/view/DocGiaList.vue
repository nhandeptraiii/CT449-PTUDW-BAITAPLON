<template>
  <div>
    <h1>Danh sách sách</h1>
    <ul>
      <li v-for="book in books" :key="book._id">
        {{ book.TenSach }} - {{ book.TacGia }}
      </li>
    </ul>
  </div>
</template>

<script>
import apiClient from '../services/api';

export default {
  data() {
    return {
      books: []
    };
  },
  created() {
    this.fetchBooks();
  },
  methods: {
    async fetchBooks() {
      try {
        const response = await apiClient.get('/sach');
        this.books = response.data.data;
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    }
  }
};
</script>

<style scoped>
/* Thêm CSS tùy chỉnh của bạn ở đây */
</style>