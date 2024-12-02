<template>
    <ion-page>
        <!-- Header -->
        <ion-header>
            <ion-toolbar color="primary">
                <ion-buttons slot="start">
                    <ion-back-button></ion-back-button>
                </ion-buttons>
                <ion-title>RUMAH SAKIT</ion-title>
            </ion-toolbar>
        </ion-header>

        <!-- Content -->
        <ion-content>
            <!-- Search Bar -->
            <ion-searchbar class="searchbar" placeholder="Cari rumah sakit terbaik"></ion-searchbar>

            <!-- Recommendation Section -->
            <div class="recommendation-section">
                <h2>Rekomendasi Rumah Sakit</h2><br>
                <ion-button fill="clear" size="small" class="lihat-semua">Lihat Semua</ion-button>
            </div>
            <div class="text-recommendation">
                <p>Rumah sakit terbaik di Purbalingga</p>
            </div>

            <!-- List of Hospitals -->
            <ion-card v-for="hospital in hospitals" :key="hospital.id">
                <ion-card-header>
                    <ion-card-title>{{ hospital.name }}</ion-card-title>
                    <ion-card-subtitle>{{ hospital.contact }}</ion-card-subtitle>
                </ion-card-header>
                <ion-card-content>
                    <p>{{ hospital.address }}</p>
                    <p>{{ hospital.deskripsi }}</p>
                    <ion-button size="small" color="primary">Daftar</ion-button>
                </ion-card-content>
            </ion-card>
        </ion-content>
    </ion-page>
</template>


<script>
import { ref, onMounted } from "vue";
import { collection, getDocs } from "firebase/firestore"; // Firestore API
import { db } from "@/firebase"; // Firestore database instance
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCardContent,
    IonButton,
} from "@ionic/vue";

export default {
    name: "Hospitals",
    components: {
        IonPage,
        IonHeader,
        IonToolbar,
        IonButtons,
        IonBackButton,
        IonTitle,
        IonContent,
        IonCard,
        IonCardHeader,
        IonCardSubtitle,
        IonCardTitle,
        IonCardContent,
        IonButton,
    },
    setup() {
        const hospitals = ref([]); // Store fetched hospital data

        // Fetch data from Firestore
        const fetchHospitals = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "hospitals"));
                hospitals.value = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
            } catch (error) {
                console.error("Error fetching hospital data: ", error);
            }
        };

        onMounted(() => {
            fetchHospitals();
        });

        return {
            hospitals,
        };
    },
};
</script>

<style scoped>
.searchbar {
    width: 90%;
    margin: 16px 16px 0 16px;
}

.recommendation-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 16px;
}

.text-recommendation {
    margin: 0 16px;
}

ion-card {
    margin: 16px;
}
</style>
