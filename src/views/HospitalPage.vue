<template>
    <ion-page>
        <!-- Header -->
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button></ion-back-button>
                </ion-buttons>
                <ion-title>RUMAH SAKIT</ion-title>
            </ion-toolbar>
        </ion-header>

        <!-- Content -->
        <ion-content>
            <!-- Image Banner -->
            <ion-img src="rumahsakit.jpg" alt="Banner" class="banner"></ion-img>

            <!-- Search Bar -->
             <div class="border-searchbar">
                <ion-searchbar class="searchbar" placeholder="Cari rumah sakit terbaik"></ion-searchbar>
             </div>
            

            <!-- Recommendation Section -->
            <div class="recommendation-section">
                <h2>Rekomendasi Rumah Sakit</h2>
            </div>
            <p class="text-recommendation">Rumah sakit terbaik di Purbalingga</p>

            <!-- List of Hospitals -->
            <div class="hospital-list">
                <ion-card v-for="hospital in hospitals" :key="hospital.id" class="hospital-card">
                    <ion-img :src="hospital.image" alt="Hospital Image" class="hospital-image"></ion-img>
                    <div class="hospital-details">
                        <h3>{{ hospital.name }}</h3>
                        <p>{{ hospital.address }}</p>
                    </div>
                </ion-card>
            </div>
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
    IonImg,
    IonButton,
    IonSearchbar,
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
        IonImg,
        IonButton,
        IonSearchbar,
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
ion-searchbar {
    --border-radius: 20px;
  /* --inner-padding-start: 10px; */
  /* --inner-padding-end: 10px; */
  --background: white;
  --color: black;
  border-radius: 20px;
  margin: 0;
  padding: 0;
  cursor: pointer;
}

.border-searchbar {
    border: 1px solid #3b82f6;
    border-radius: 20px;
    margin: 16px;
    padding: 0;
    display: flex;
}

.banner {
    width: 100%;
    margin:  0;
}

.recommendation-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 16px;
}

.text-recommendation {
    margin: 0 16px;
    color: #666;
    font-size: 14px;
}

.hospital-list {
    margin: 16px;
}

.hospital-card {
    display: flex;
    align-items: center;
    margin: 16px 0;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
}

.hospital-image {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
    margin-right: 12px;
}

.hospital-details {
    flex: 1;
}

.hospital-details h3 {
    margin: 0 0 8px;
    font-size: 16px;
    color: #333;
}

.hospital-details p {
    margin: 0 0 12px;
    color: #666;
    font-size: 14px;
}
</style>
