<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <a class="back-button" @click="goBack"> Back </a>
                </ion-buttons>
                <ion-title>Make Appointment</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding" style="--background: #e1eee9;">
            <h2 class="page-title" style="color: black;">Your Chosen Information</h2>
            <div class="info-box">
                <p><strong>Rumah Sakit:</strong> {{ hospitalName }}</p>
                <p><strong>Poli:</strong> {{ poliName }}</p>
                <p><strong>Dokter:</strong> {{ doctorName }}</p>
                <p><strong>Jadwal:</strong> {{ doctorSchedule }}</p>
            </div>

            <h2 class="page-title" style="color: black;">Form Pendaftaran Pasien</h2>
            <form @submit.prevent="submitAppointment">
                <ion-label position="stacked" style="font-weight: bold;">NIK</ion-label>
                <ion-item class="custom-item">
                    <ion-input v-model="appointment.nik" type="text" placeholder="Masukkan NIK" required></ion-input>
                </ion-item>

                <ion-label position="stacked" style="font-weight: bold;">Nama Lengkap</ion-label>
                <ion-item class="custom-item">
                    <ion-input v-model="appointment.name" type="text" placeholder="Masukkan Nama Lengkap" required></ion-input>
                </ion-item>

                <ion-label position="stacked" style="font-weight: bold;">Tempat Lahir</ion-label>
                <ion-item class="custom-item">
                    <ion-input v-model="appointment.birthPlace" type="text" placeholder="Masukkan Tempat Lahir" required></ion-input>
                </ion-item>

                <ion-label position="stacked" style="font-weight: bold;">Tanggal Lahir</ion-label>
                <ion-item class="custom-item">
                    <ion-input v-model="appointment.birthDate" type="date" placeholder="Pilih Tanggal Lahir" required></ion-input>
                </ion-item>

                <ion-label position="stacked" style="font-weight: bold;">Alamat</ion-label>
                <ion-item class="custom-item">
                    <ion-textarea v-model="appointment.address" placeholder="Masukkan Alamat" required></ion-textarea>
                </ion-item>

                <ion-label position="stacked" style="font-weight: bold;">Nomor Telepon</ion-label>
                <ion-item class="custom-item">
                    <ion-input v-model="appointment.phone" type="tel" placeholder="Masukkan Nomor Telepon" required></ion-input>
                </ion-item>

                <ion-button expand="block" class="submit-button" type="submit">Buat Janji</ion-button>
            </form>

              <!-- Ruang Scroll Tambahan -->
                    <div class="scroll-padding"></div>
        </ion-content>
    </ion-page>
</template>

<script>
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonButton,
} from "@ionic/vue";
import { getFirestore, doc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/firebase";

export default {
    name: "AppointmentPage",
    components: {
        IonPage,
        IonHeader,
        IonToolbar,
        IonButtons,
        IonBackButton,
        IonTitle,
        IonContent,
        IonItem,
        IonLabel,
        IonInput,
        IonTextarea,
        IonButton,
    },
    data() {
        return {
            hospitalName: "",
            poliName: "",
            doctorName: "",
            doctorSchedule: "",
            appointment: {
                nik: "",
                name: "",
                birthPlace: "",
                birthDate: "",
                address: "",
                phone: "",
            },
        };
    },
    methods: {
        goBack() {
            this.$router.back();
        },
        async fetchSelectedInfo() {
            const { hospitalId, poliId, doctorScheduleId } = this.$route.params;

            if (!hospitalId || !poliId || !doctorScheduleId) {
                console.error("Missing parameters for fetching data.");
                return;
            }

            try {
                const hospitalDoc = await getDoc(doc(db, "hospitals", hospitalId));
                this.hospitalName = hospitalDoc.exists() ? hospitalDoc.data().name : "Tidak Diketahui";

                const poliDoc = await getDoc(doc(db, "hospitals", hospitalId, "polyclinics", poliId));
                this.poliName = poliDoc.exists() ? poliDoc.data().name : "Tidak Diketahui";

                const doctorScheduleDoc = await getDoc(
                    doc(db, "hospitals", hospitalId, "polyclinics", poliId, "doctor_schedules", doctorScheduleId)
                );

                if (doctorScheduleDoc.exists()) {
                    const data = doctorScheduleDoc.data();
                    this.doctorName = data.name || "Tidak Diketahui"; // Gunakan field `name`
                    this.doctorSchedule = data.schedule || "Tidak Diketahui"; // Gunakan field `schedule`
                } else {
                    console.warn("Doctor schedule document not found.");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }

            console.log(`Fetching doctor schedule from: hospitals/${hospitalId}/polyclinics/${poliId}/doctor_schedules/${doctorScheduleId}`);
        },

        async submitAppointment() {
            const { hospitalId, poliId, doctorScheduleId } = this.$route.params;

            if (!this.appointment.nik || !this.appointment.name || !this.appointment.phone) {
                alert("Harap lengkapi semua data sebelum mengirimkan formulir.");
                return;
            }

            try {
                const username = await this.fetchUsername();
                const userId = auth.currentUser ? auth.currentUser.uid : "Anonim";

                const appointmentRef = collection(
                    doc(db, "hospitals", hospitalId, "polyclinics", poliId, "doctor_schedules", doctorScheduleId),
                    "appointments"
                );

                await addDoc(appointmentRef, {
                    ...this.appointment,
                    createdAt: serverTimestamp(),
                    username,
                    userId,
                });

                this.$router.push({
                    name: "QueueCard",
                    query: {
                        nik: this.appointment.nik,
                        name: this.appointment.name,
                        hospitalName: this.hospitalName,
                        poliName: this.poliName,
                        doctorName: this.doctorName,
                        schedule: this.doctorSchedule,
                        createdAt: new Date().toISOString(),
                        username,
                    },
                });
            } catch (error) {
                console.error("Error creating appointment:", error);
                alert("Gagal membuat janji temu.");
            }
        },

        async fetchUsername() {
            const currentUser = auth.currentUser;

            if (currentUser && currentUser.email) {
                try {
                    const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                    return userDoc.exists() ? userDoc.data().username || "Anonim" : "Anonim";
                } catch (error) {
                    console.error("Error fetching username:", error);
                }
            }
            return "Anonim";
        },
    },
    mounted() {
        this.fetchSelectedInfo();
    },
};
    

</script>

<style scoped>
.page-title {
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    color: #006FAE;
    margin-bottom: 16px;
}

.info-box {
    background: #f8f9fa;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
}

.custom-item {
    --border-width: 2px;
    --border-color: lightgrey; /* Default border color */
    --focus-border-color: #038d92; /* Focus border color */
    --hover-border-color: #038d92; /* Hover border color */
    border: var(--border-width) solid var(--border-color);
    border-radius: 10px;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.custom-item:focus-within {
    border-color: var(--focus-border-color);
}

.custom-item:hover {
    border-color: var(--hover-border-color);
    box-shadow: 0 0 5px rgba(3, 141, 146, 0.5);
}

.submit-button {
    --background: #006FAE;
    --border-radius: 20px;
    color: white;
    font-weight: bold;
    text-transform: none;
}

.ion-padding {
    margin: 10px;
}

.scroll-padding {
  height: 300px; /* Menambahkan ruang ekstra 500px di bawah konten */
}
</style>
