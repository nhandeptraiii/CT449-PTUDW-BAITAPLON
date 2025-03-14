import { createWebHistory, createRouter } from "vue-router";
// import DocGiaList from '../view/DocGiaList.vue';
// import NhanVienList from '../view/NhanVienList.vue';
// import NhaXuatBanList from '../view/NhaXuatBanList.vue';
// import MuonSachList from '../view/MuonSachList.vue';
// import SachList from '../view/SachList.vue';
import Login from '../view/Login.vue';



const routes = [
    // {
    //   path: '/',
    //   name: 'Home',
    //   component: SachList
    // },
    // {
    //   path: '/sach',
    //   name: 'Sach',
    //   component: SachList
    // },
    // {
    //   path: '/docgia',
    //   name: 'DocGia',
    //   component: DocGiaList
    // },
    // {
    //   path: '/nhanvien',
    //   name: 'NhanVien',
    //   component: NhanVienList
    // },
    // {
    //   path: '/nhaxuatban',
    //   name: 'NhaXuatBan',
    //   component: NhaXuatBanList
    // },
    // {
    //   path: '/muonsach',
    //   name: 'MuonSach',
    //   component: MuonSachList
    // },
    {
      path: '/',
      name: 'Login',
      component: Login
    }
  ]

  const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;