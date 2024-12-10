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
import DoctorSchedule from "../views/DoctorSchedule.vue"; // Import halaman
import AppointmentPage from "../views/AppointmentPage.vue"; // Import halaman AppointmentPage
import QueueCard from "../views/QueueCard.vue"; // Import halaman QueueCard
import UserCard from "../views/UserCard.vue"; 

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", name: 'Login', component: Login },
  { path: "/register", component: Register },
  {
    path: "/home",
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: "/poli/:hospitalId", // Update rute ini
    name: "PoliPage", // Tambahkan nama rute ini
    component: Poli,
    meta: { requiresAuth: true },
  },
  {
    path: "/profile",
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: "/hospitals",
    component: Hospitals,
    meta: { requiresAuth: true },
  },
  {
    path: "/emergency",
    component: Emergency,
    meta: { requiresAuth: true },
  },
  {
    path: "/selecthospital",
    name: "SelectHospital",
    component: SelectHospital,
    meta: { requiresAuth: true },
  },
  {
    path: "/doctor-schedule/:hospitalId/:poliId",
    name: "DoctorSchedule", // Nama rute
    component: DoctorSchedule,
    meta: { requiresAuth: true }, // Proteksi autentikasi
  },
  {
    path: "/appointment/:hospitalId/:poliId/:doctorScheduleId", // Route untuk AppointmentPage
    name: "AppointmentPage", // Nama rute
    component: AppointmentPage, // Komponen AppointmentPage
    meta: { requiresAuth: true }, // Proteksi autentikasi
  },
  {
    path: "/queue-card",
    name: "QueueCard",
    component: QueueCard,
    meta: { requiresAuth: true },
  },  
  {
    path: "/user-card",
    name: "UserCard",
    component: UserCard,
    meta: { requiresAuth: true },
  },  
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const user = auth.currentUser;
  if (to.meta.requiresAuth && !user) {
    next("/login");
  } else {
    next();
  }
});

export default router;
