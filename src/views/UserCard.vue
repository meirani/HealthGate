<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Kartu Antrean Saya</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
            <div class="container">
                <div v-if="loading" class="text-center text-gray-600">Memuat data...</div>
                <div v-else>
                    <div v-if="userAppointments.length === 0" class="text-center text-gray-600">
                        Tidak ada kartu antrean yang tersedia.
                    </div>
                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div v-for="appointment in userAppointments" :key="appointment.id" class="card cursor-pointer"
                            @click="goToQueueCard(appointment)">
                            <h2 class="hospital-name">{{ appointment.hospitalName }}</h2>
                            <p class="patient-name">{{ appointment.name }}</p>
                            <p class="schedule-info">{{ appointment.schedule }}</p>
                            <p class="created-at text-sm text-blue-500">
                                {{ formatRelativeTime(appointment.createdAt) }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<script>
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";

export default {
    name: "UserCard",
    data() {
        return {
            userAppointments: [],
            loading: true,
        };
    },
    methods: {
        async fetchUserAppointments() {
            try {
                const db = getFirestore();
                const auth = getAuth();

                if (!auth.currentUser) {
                    console.error("User is not logged in.");
                    this.loading = false;
                    return;
                }

                const uid = auth.currentUser.uid;

                const hospitalsRef = collection(db, "hospitals");
                const hospitalsSnapshot = await getDocs(hospitalsRef);

                if (hospitalsSnapshot.empty) {
                    this.userAppointments = [];
                    return;
                }

                const appointments = [];

                for (const hospitalDoc of hospitalsSnapshot.docs) {
                    const hospitalId = hospitalDoc.id;
                    const polyclinicsRef = collection(db, `hospitals/${hospitalId}/polyclinics`);
                    const polyclinicsSnapshot = await getDocs(polyclinicsRef);

                    for (const polyclinicDoc of polyclinicsSnapshot.docs) {
                        const poliId = polyclinicDoc.id;
                        const doctorSchedulesRef = collection(db, `hospitals/${hospitalId}/polyclinics/${poliId}/doctor_schedules`);
                        const doctorSchedulesSnapshot = await getDocs(doctorSchedulesRef);

                        for (const scheduleDoc of doctorSchedulesSnapshot.docs) {
                            const appointmentsRef = collection(db, `hospitals/${hospitalId}/polyclinics/${poliId}/doctor_schedules/${scheduleDoc.id}/appointments`);
                            const q = query(appointmentsRef, where("userId", "==", uid));
                            const querySnapshot = await getDocs(q);

                            querySnapshot.forEach((doc) => {
                                const scheduleData = scheduleDoc.data();
                                appointments.push({
                                    id: doc.id,
                                    ...doc.data(),
                                    hospitalName: hospitalDoc.data().name,
                                    poliName: polyclinicDoc.data().name,
                                    doctorName: scheduleData.name,
                                    schedule: scheduleData.schedule || "Jadwal tidak tersedia",
                                });
                            });
                        }
                    }
                }

                this.userAppointments = appointments;
            } catch (error) {
                console.error("Error fetching user appointments:", error);
            } finally {
                this.loading = false;
            }
        },
        goToQueueCard(appointment) {
            const createdAt = appointment.createdAt.toDate();

            this.$router.push({
                name: "QueueCard",
                query: {
                    nik: appointment.nik,
                    name: appointment.name,
                    hospitalName: appointment.hospitalName,
                    poliName: appointment.poliName,
                    doctorName: appointment.doctorName,
                    schedule: appointment.schedule,
                    createdAt: createdAt.toISOString(),
                    username: appointment.username || "Anonim",
                },
            });
        },
        formatDateTime(dateString) {
            try {
                const date = new Date(dateString);
                return new Intl.DateTimeFormat("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                }).format(date);
            } catch {
                return "Tanggal tidak valid";
            }
        },
        formatRelativeTime(timestamp) {
            try {
                // Konversi Firestore Timestamp ke Date sebelum memformat
                const date = timestamp.toDate();
                return formatDistanceToNow(date, {
                    addSuffix: true,
                    locale: enUS, // Bahasa Inggris
                });
            } catch {
                return "Invalid time";
            }
        },
    },
    mounted() {
        this.fetchUserAppointments();
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

.hospital-name {
    font-size: 18px;
    font-weight: bold;
    color: #006FAE;
    margin-bottom: 8px;
}

.patient-name,
.schedule-info {
    color: #333;
    font-size: 14px;
}
</style>
