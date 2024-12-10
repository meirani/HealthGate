import { createRouter, createWebHistory } from "@ionic/vue-router";
import { auth } from "../firebase";
import { getFirestore, doc, getDoc } from "firebase/firestore";

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
  {
    path: "/hospital/add",
    name: "AddHospital",
    component: () => import("../views/HospitalForm.vue"),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/hospital/edit/:hospitalId",
    name: "EditHospital",
    component: () => import("../views/HospitalForm.vue"),
    meta: { requiresAuth: true, requiresAdmin: true },
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

async function checkRole() {
  const db = getFirestore();
  const user = auth.currentUser;
  if (user) {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const userData = userDoc.data();
    return userData.role;
  }
  return null;
}

router.beforeEach(async (to, from, next) => {
  const user = auth.currentUser;

  if (to.meta.requiresAuth && !user) {
    next("/login");
  } else if (to.meta.requiresAdmin) {
    const role = await checkRole();
    if (role === "admin") {
      next();
    } else {
      alert("Anda tidak memiliki akses ke halaman ini.");
      next("/home");
    }
  } else {
    next();
  }
});


export default router;
