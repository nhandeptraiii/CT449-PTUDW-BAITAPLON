<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading state -->
    <div v-if="!authStore.isNhanVienLoaded" class="flex items-center justify-center min-h-screen">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <template v-else>
      <div v-if="authStore.nhanVien == null" class="h-screen">
        <div class="container max-w-screen-lg">
          <Login/>
        </div>
      </div>
      <div v-else class="flex h-screen">
        <AppHeader/>
        <div class="flex-1 overflow-auto">
          <div class="">
            <router-view />
          </div>
        </div>
      </div>

    </template>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from './stores/auth'; 

import AppHeader from './components/AppHeader.vue';
import Login from './views/Login.vue';


const authStore = useAuthStore();
// const currentAdminMenu = ref(''); // Định nghĩa currentAdminMenu

onMounted(async () => {
  if (!authStore.isNhanVienLoaded) {
    await authStore.fetchCurrentNhanVien();
  }
});
</script>
