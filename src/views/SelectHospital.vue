<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Pilih Rumah Sakit</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
            <div class="container">
                <!-- <img src="@/assets/select-hospital.jpg" alt="Ilustrasi Rumah Sakit" class="illustration" /> -->

                <div v-if="loading" class="text-center text-gray-600">Memuat data...</div>
                <div v-else>
                    <div v-if="hospitals.length === 0" class="text-center text-gray-600">
                        Tidak ada rumah sakit tersedia.
                    </div>
                    <div v-for="hospital in hospitals" :key="hospital.id" class="card mb-4">
                        <h2 class="hospital-name">{{ hospital.name }}</h2>
                        <p class="hospital-address">{{ hospital.address }}</p>
                        <p class="hospital-description">{{ hospital.deskripsi }}</p>
                        <p class="hospital-contact">Kontak: {{ hospital.contact }}</p>
                        <ion-button @click="goToPoliPage(hospital.id)" class="select-button" expand="block">
                            Daftar
                        </ion-button>
                    </div>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<script>
import { getFirestore, collection, getDocs } from "firebase/firestore";

export default {
    name: "SelectHospital",
    data() {
        return {
            hospitals: [],
            loading: true,
        };
    },
    methods: {
        async fetchHospitals() {
            try {
                const db = getFirestore();
                const querySnapshot = await getDocs(collection(db, "hospitals"));
                this.hospitals = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
            } catch (error) {
                console.error("Error fetching hospitals:", error);
            } finally {
                this.loading = false;
            }
        },
        goToPoliPage(hospitalId) {
            this.$router.push({ name: "PoliPage", params: { hospitalId } });
        },
    },
    mounted() {
        this.fetchHospitals();
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
    max-width: 600px;
}

.illustration {
    display: block;
    margin: 0 auto 20px;
    width: 100%;
    height: auto;
}

.card {
    background-color: #f8f9fa;
    border-radius: 10px;
    padding: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
}

.hospital-name {
    font-size: 20px;
    font-weight: bold;
    color: #006FAE;
    margin-bottom: 10px;
}

.hospital-address,
.hospital-description,
.hospital-contact {
    font-size: 14px;
    color: #333;
    margin-bottom: 8px;
}

.select-button {
    background-color: #006FAE;
    color: white;
    border-radius: 20px;
    font-weight: bold;
    margin-top: 15px;
}

.select-button:hover {
    background-color: #004f75;
    transition: background-color 0.3s;
}
</style>