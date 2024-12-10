<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Pilih Poli</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
            <div class="container">
                <!-- <img src="@/assets/poli-page.jpg" alt="Ilustrasi Poli" class="illustration" /> -->

                <!-- <h1 class="page-title">Pilih Poli</h1> -->
                <div v-if="loading" class="text-center text-gray-600">Memuat data...</div>
                <div v-else>
                    <div v-if="polyclinics.length === 0" class="text-center text-gray-600">
                        Tidak ada poli yang tersedia untuk rumah sakit ini.
                    </div>
                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div v-for="poli in polyclinics" :key="poli.id" class="card">
                            <h2 class="poli-name">{{ poli.name }}</h2>
                            <ion-button @click="goToDoctorSchedule(poli.id)" class="schedule-button" expand="block">
                                Lihat Jadwal Dokter
                            </ion-button>
                        </div>
                    </div>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<script>
import { getFirestore, doc, collection, getDocs } from "firebase/firestore";

export default {
    name: "PoliPage",
    data() {
        return {
            polyclinics: [],
            loading: true,
        };
    },
    methods: {
        async fetchPolyclinics() {
            try {
                const db = getFirestore();
                const hospitalId = this.$route.params.hospitalId; // Mengambil hospitalId dari URL

                // Mengakses subkoleksi `polyclinics` dari dokumen rumah sakit
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
        goToDoctorSchedule(poliId) {
            this.$router.push({ name: "DoctorSchedule", params: { poliId } });
        },
    },
    mounted() {
        this.fetchPolyclinics();
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

.illustration {
    display: block;
    margin: 0 auto 20px;
    width: 100%;
    height: auto;
}

.page-title {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    color: #006FAE;
    margin-bottom: 16px;
}

.card {
    background-color: #f8f9fa;
    border-radius: 10px;
    padding: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s;
}

.card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
    margin-top: 10px;
}

.schedule-button:hover {
    background-color: #004f75;
    transition: background-color 0.3s;
}
</style>