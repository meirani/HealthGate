<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Jadwal Dokter</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
            <div class="container">
                <div v-if="loading" class="text-center text-gray-600">Memuat data...</div>
                <div v-else>
                    <ion-button v-if="isAdmin" @click="goToAddDoctorSchedule" expand="block" class="add-button">
                        Tambah Jadwal Dokter
                    </ion-button>
                    <div v-if="doctorSchedules.length === 0" class="text-center text-gray-600">
                        Tidak ada jadwal dokter yang tersedia untuk poli ini.
                    </div>
                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div v-for="schedule in doctorSchedules" :key="schedule.id" class="card cursor-pointer">
                            <div @click="goToAppointmentPage(schedule.id)">
                                <h2 class="doctor-name">{{ schedule.name }}</h2>
                                <p class="schedule-info">{{ schedule.schedule }}</p>
                            </div>
                            <!-- Tombol CRUD admin -->
                            <ion-buttons v-if="isAdmin" slot="end" class="admin-buttons">
                                <ion-button @click="editDoctorSchedule(schedule)" color="warning">Edit</ion-button>
                                <ion-button @click="deleteDoctorSchedule(schedule.id)"
                                    color="danger">Delete</ion-button>
                            </ion-buttons>
                        </div>
                    </div>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<script>
import { getFirestore, doc, collection, getDocs, deleteDoc, getDoc } from "firebase/firestore";
import { auth } from "../firebase";

export default {
    data() {
        return {
            doctorSchedules: [],
            loading: true,
            isAdmin: false,
        };
    },
    methods: {
        async fetchDoctorSchedules() {
            try {
                const db = getFirestore();
                const hospitalId = this.$route.params.hospitalId;
                const poliId = this.$route.params.poliId;

                const polyRef = doc(db, "hospitals", hospitalId, "polyclinics", poliId);
                const scheduleRef = collection(polyRef, "doctor_schedules");
                const querySnapshot = await getDocs(scheduleRef);

                this.doctorSchedules = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
            } catch (error) {
                console.error("Error fetching doctor schedules:", error);
            } finally {
                this.loading = false;
            }
        },
        async checkAdminRole() {
            const user = auth.currentUser;
            if (user) {
                const db = getFirestore();
                const userDoc = await getDoc(doc(db, "users", user.uid));
                this.isAdmin = userDoc.exists() && userDoc.data().role === "admin";
            }
        },
        goToAddDoctorSchedule() {
            const { hospitalId, poliId } = this.$route.params;
            this.$router.push({ name: "AddDoctorSchedule", params: { hospitalId, poliId } });
        },
        editDoctorSchedule(schedule) {
            const { hospitalId, poliId } = this.$route.params;
            this.$router.push({ name: "EditDoctorSchedule", params: { hospitalId, poliId, doctorScheduleId: schedule.id } });
        },
        async deleteDoctorSchedule(scheduleId) {
            if (confirm("Apakah Anda yakin ingin menghapus jadwal dokter ini?")) {
                try {
                    const db = getFirestore();
                    const { hospitalId, poliId } = this.$route.params;
                    const scheduleRef = doc(db, "hospitals", hospitalId, "polyclinics", poliId, "doctor_schedules", scheduleId);
                    await deleteDoc(scheduleRef);
                    this.fetchDoctorSchedules(); // Refresh data
                } catch (error) {
                    console.error("Error deleting doctor schedule:", error);
                }
            }
        },
        goToAppointmentPage(doctorScheduleId) {
            const { hospitalId, poliId } = this.$route.params;
            this.$router.push({
                name: "AppointmentPage",
                params: { hospitalId, poliId, doctorScheduleId },
            });
        },
    },
    mounted() {
        this.fetchDoctorSchedules();
        this.checkAdminRole();
    },
};
</script>

<style scoped>
.container {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin: 20px auto;
    max-width: 800px;
}

.card {
    background-color: #f8f9fa;
    border-radius: 10px;
    padding: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s, transform 0.2s;
}

.card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-3px);
}

.cursor-pointer {
    cursor: pointer;
}

.doctor-name {
    font-size: 18px;
    font-weight: bold;
    color: #006FAE;
    margin-bottom: 8px;
}

.schedule-info {
    color: #333;
    font-size: 14px;
}

.admin-buttons {
    display: flex;
    gap: 10px;
    margin-top: 10px;
}
</style>
