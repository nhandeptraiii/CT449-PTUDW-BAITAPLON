import { createWebHistory, createRouter } from "vue-router";
import { useAuthStore } from '../stores/auth'
import Dashboard from '../views/Dashboard.vue';
import DocGiaList from '../views/DocGiaList.vue';
import NhanVienList from '../views/NhanVienList.vue';
import NhaXuatBanList from '../views/NhaXuatBanList.vue';
import MuonSachList from '../views/MuonSachList.vue';
import SachList from '../views/SachList.vue';
import Login from '../views/Login.vue';



const routes = [
    {
      path: '/',
      name: 'Home',
      component: Dashboard
    },
    {
      path: '/sach',
      name: 'Sach',
      component: SachList
    },
    {
      path: '/docgia',
      name: 'DocGia',
      component: DocGiaList
    },
    {
      path: '/nhanvien',
      name: 'NhanVien',
      component: NhanVienList
    },
    {
      path: '/nhaxuatban',
      name: 'NhaXuatBan',
      component: NhaXuatBanList
    },
    {
      path: '/muonsach',
      name: 'MuonSach',
      component: MuonSachList
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]

  const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  if (!authStore.isNhanVienLoaded) {
    try {
      await authStore.fetchCurrentNhanVien()
    } catch (error) {
      console.error("Error fetching user:", error)
      authStore.logout()
    }
  }

  if (to.meta.requiresAuth && !authStore.nhanVien) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }
  next()
})


export default router