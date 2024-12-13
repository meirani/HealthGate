<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Pilih Poli</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
            <div class="container">
                <div v-if="loading" class="text-center text-gray-600">Memuat data...</div>
                <div v-else>
                    <!-- Tombol Tambah Poli hanya untuk Admin -->
                    <ion-button v-if="isAdmin" @click="goToAddPoli" expand="block" class="add-button">
                        Tambah Poli
                    </ion-button>
                    <div v-if="polyclinics.length === 0" class="text-center text-gray-600">
                        Tidak ada poli yang tersedia untuk rumah sakit ini.
                    </div>
                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div v-for="poli in polyclinics" :key="poli.id" class="card">
                            <h2 class="poli-name">{{ poli.name }}</h2>
                            <ion-button @click="goToDoctorSchedule(poli.id)" class="schedule-button" expand="block">
                                Lihat Jadwal Dokter
                            </ion-button>
                            <!-- Tombol Edit dan Delete hanya untuk Admin -->
                            <ion-buttons v-if="isAdmin" slot="end" class="admin-buttons">
                                <ion-button @click="editPoli(poli)" color="warning">Edit</ion-button>
                                <ion-button @click="deletePoli(poli.id)" color="danger">Delete</ion-button>
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
    name: "PoliPage",
    data() {
        return {
            polyclinics: [],
            loading: true,
            isAdmin: false,
        };
    },
    methods: {
        async fetchPolyclinics() {
            try {
                const db = getFirestore();
                const hospitalId = this.$route.params.hospitalId; // Mengambil hospitalId dari URL
                const hospitalRef = doc(db, "hospitals", hospitalId);
                const polyclinicsRef = collection(hospitalRef, "polyclinics");
                const querySnapshot = await getDocs(polyclinicsRef);
                this.polyclinics = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
            } catch (error) {
                console.error("Error fetching polyclinics:", error);
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
        goToAddPoli() {
            const hospitalId = this.$route.params.hospitalId;
            this.$router.push({ name: "AddPoli", params: { hospitalId } });
        },
        editPoli(poli) {
            const hospitalId = this.$route.params.hospitalId;
            this.$router.push({ name: "EditPoli", params: { hospitalId, poliId: poli.id } });
        },
        async deletePoli(poliId) {
            const hospitalId = this.$route.params.hospitalId;
            if (confirm("Apakah Anda yakin ingin menghapus poli ini?")) {
                try {
                    const db = getFirestore();
                    const poliRef = doc(db, "hospitals", hospitalId, "polyclinics", poliId);
                    await deleteDoc(poliRef);
                    this.fetchPolyclinics(); // Refresh data setelah penghapusan
                } catch (error) {
                    console.error("Error deleting poli:", error);
                }
            }
        },
        goToDoctorSchedule(poliId) {
            this.$router.push({ name: "DoctorSchedule", params: { poliId } });
        },
    },
    mounted() {
        this.fetchPolyclinics();
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
}

.poli-name {
    font-size: 18px;
    font-weight: bold;
    color: #006FAE;
    margin-bottom: 12px;
}

.schedule-button {
    background-color: #006FAE;
    color: white;
    border-radius: 20px;
    font-weight: bold;
}

.schedule-button:hover {
    background-color: #004f75;
    transition: background-color 0.3s;
}

.add-button {
    margin-bottom: 15px;
}

.admin-buttons ion-button {
    margin-top: 10px;
}
</style>
