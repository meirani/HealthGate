<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                  <ion-buttons slot="start">
          <a class="back-button" @click="goBack">
            Back
          </a >
        </ion-buttons>
                <ion-title>Doctors Schedule</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding" style="--background: #e1eee9">
            
                <div v-if="loading" class="text-center text-gray-600">Memuat data...</div>
                <div v-else>
                   
                    <div v-if="doctorSchedules.length === 0" class="text-center text-gray-600">
                        Tidak ada jadwal dokter yang tersedia untuk poli ini.
                    </div>
                    <div>
                        <h2 style="font-weight: bold; margin-top: 1px; ">Choose your preferred Doctor</h2>
                    </div>
                    <div class="card-doctor">
                        <div v-for="schedule in doctorSchedules" :key="schedule.id" class="card cursor-pointer">
                            <div @click="goToAppointmentPage(schedule.id)">
                                <h2 class="doctor-name">{{ schedule.name }}</h2>
                                <p class="schedule-info">{{ schedule.schedule }}</p>
                            </div>

                            <!-- Tombol CRUD admin -->
                            <ion-buttons v-if="isAdmin" slot="end" class="admin-buttons">
                                <ion-button @click="editDoctorSchedule(schedule)" color="warning">
                                     <img class="ud-icon" src="@/assets/edit-icon.png" alt="">
                                </ion-button>
                                <ion-button @click="deleteDoctorSchedule(schedule.id)"
                                    color="danger">
                                     <img class="ud-icon" src="@/assets/delete-icon.png" alt="">
                                </ion-button>
                            </ion-buttons>
                        </div>
                    </div>
                </div>

                

                 <!-- Ruang Scroll Tambahan -->
                    <div class="scroll-padding"></div>

                     

                     <button v-if="isAdmin" @click="goToAddDoctorSchedule" expand="block" class="add-button">
                        <img class="icon-add" src="@/assets/add-icon.png"></img>
                    </button>
        
        </ion-content>
    </ion-page>
</template>

<script>
import { getFirestore, doc, collection, getDocs, deleteDoc, getDoc } from "firebase/firestore";
import { auth } from "../firebase";
import { IonPage, IonHeader, IonToolbar, IonButtons, IonTitle, IonContent, IonButton } from "@ionic/vue";
import { useRouter } from "vue-router";
export default {
    components: {
        IonPage,
        IonHeader,
        IonToolbar,
        IonButtons,
        IonTitle,
        IonContent,
        IonButton,
    },

    data() {
        return {
            doctorSchedules: [],
            loading: true,
            isAdmin: false,
        };
    },
    methods: {
        goBack() {
            this.$router.back();
        },
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
.card-doctor {
    margin-bottom: 40px;
}

.add-button {
     position: fixed;
  bottom: 30px; /* Sesuaikan agar di atas bottom tab bar */
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000; /* Pastikan ini lebih besar agar tombol tetap di atas elemen lain */
  width: 60px;
    height: 60px;
    border-radius: 25%;
    background-color: #038d92;
    box-shadow: inset;
}

.ud-icon {
    width: 30px;
    height: 30px;
}

.icon-add {
    height: 40px;
    width: 40px;
}

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
