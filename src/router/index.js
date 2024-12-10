import { createRouter, createWebHistory } from "@ionic/vue-router";
import { auth } from "../firebase";

import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Home from "../views/HomePage.vue";
import Poli from "../views/PoliPage.vue"; // Import halaman PoliPage
import Profile from "../views/ProfilePage.vue"; // Import halaman ProfilePage
import Hospitals from "../views/HospitalPage.vue"; // Import halaman HospitalPage
import Emergency from "../views/EmergencyPage.vue"; // Import halaman EmergencyPage
import SelectHospital from "../views/SelectHospital.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", name: 'Login', component: Login },
  { path: "/register", component: Register },
  {
    path: "/home",
    component: Home,
    meta: { requiresAuth: true }, // Menandakan halaman ini membutuhkan autentikasi
  },
  {
    path: "/poli",
    component: Poli,
    meta: { requiresAuth: true }, // Hanya dapat diakses jika sudah login
  },
  {
    path: "/profile",
    component: Profile,
    meta: { requiresAuth: true }, // Hanya dapat diakses jika sudah login
  },
  {
    path: "/hospitals",
    component: Hospitals,
    meta: { requiresAuth: true }, // Hanya dapat diakses jika sudah login
  },
  {
    path: "/emergency",
    component: Emergency,
    meta: { requiresAuth: true }, // Hanya dapat diakses jika sudah login
  },
  {
    path: "/selecthospital",
    name: "SelectHospital", // Tambahkan nama rute ini
    component: SelectHospital,
    meta: { requiresAuth: true }, // Hanya dapat diakses jika sudah login
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Middleware untuk proteksi halaman
router.beforeEach((to, from, next) => {
  const user = auth.currentUser; // Mendapatkan user yang sedang login
  if (to.meta.requiresAuth && !user) {
    next("/login"); // Jika user belum login, arahkan ke halaman login
  } else {
    next(); // Lanjutkan navigasi
  }
});

export default router;
