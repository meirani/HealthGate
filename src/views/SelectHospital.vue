<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Pilih Rumah Sakit</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
            <div class="container">
                <div v-if="loading" class="text-center text-gray-600">Memuat data...</div>
                <div v-else>
                    <ion-button v-if="isAdmin" @click="goToAddHospital" expand="block" class="add-button">
                        Tambah Rumah Sakit
                    </ion-button>
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
                        <!-- Tombol Edit dan Delete untuk admin -->
                        <ion-buttons v-if="isAdmin" slot="end" class="admin-buttons">
                            <ion-button @click="editHospital(hospital)" color="warning">Edit</ion-button>
                            <ion-button @click="deleteHospital(hospital.id)" color="danger">Delete</ion-button>
                        </ion-buttons>
                    </div>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<script>
import { getFirestore, collection, getDocs, doc, getDoc, deleteDoc } from "firebase/firestore";
import { auth } from "../firebase";

export default {
    name: "SelectHospital",
    data() {
        return {
            hospitals: [],
            loading: true,
            isAdmin: false,
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
        async checkAdminRole() {
            const user = auth.currentUser;
            console.log("User data from auth:", user); // Debug auth data
            if (user) {
                const db = getFirestore();
                const userDoc = await getDoc(doc(db, "users", user.uid));
                console.log("User document from Firestore:", userDoc.data()); // Debug Firestore data
                this.isAdmin = userDoc.exists() && userDoc.data().role === "admin";
            }
        },
        goToAddHospital() {
            this.$router.push({ name: "AddHospital" });
        },
        editHospital(hospital) {
            this.$router.push({ name: "EditHospital", params: { hospitalId: hospital.id } });
        },
        async deleteHospital(hospitalId) {
            if (confirm("Apakah Anda yakin ingin menghapus rumah sakit ini?")) {
                try {
                    const db = getFirestore();
                    await deleteDoc(doc(db, "hospitals", hospitalId));
                    this.fetchHospitals(); // Refresh data setelah penghapusan
                } catch (error) {
                    console.error("Error deleting hospital:", error);
                }
            }
        },
        goToPoliPage(hospitalId) {
            this.$router.push({ name: "PoliPage", params: { hospitalId } });
        },
    },
    mounted() {
        this.fetchHospitals();
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