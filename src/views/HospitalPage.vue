<template>
  <ion-page>
    <!-- Header -->
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <a class="back-button" @click="goBack">
            Back
          </a>
        </ion-buttons>
        <ion-title>Hospitals</ion-title>
      </ion-toolbar>
    </ion-header>

    <!-- Content -->
    <ion-content style="--background: #e1eee9;">
      <!-- Image Banner -->
      <div class="banner">
        <img class="banner-image" src="@/assets/Hospitals-banner.png" alt="Banner" />
      </div>

      <!-- Recommendation Section -->
      <div>
        <p style="font-size: 25px; font-weight: bold; margin-left: 25px; margin-bottom: 5px;">
          Rekomendasi Rumah Sakit
        </p>
        <p style="font-size: 18px; font-weight: normal; margin-left: 27px; margin-top: 10px;">
          Rumah sakit terbaik di Purbalingga
        </p>
      </div>

      <!-- List of Hospitals -->
      <div class="hospital-list">
        <ion-card v-for="hospital in hospitals" :key="hospital.id" class="hospital-card">
          
          <div class="hospital-details">
            <h3 style="font-weight: bolder;">{{ hospital.name }}</h3>
            <p>{{ hospital.address }}</p>
          </div>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router"; // Import useRouter
import { collection, getDocs } from "firebase/firestore"; // Firestore API
import { db } from "@/firebase"; // Firestore database instance
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonContent,
  IonCard,
  IonImg,
} from "@ionic/vue";

export default {
  name: "Hospitals",
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonTitle,
    IonContent,
    IonCard,
    IonImg,
  },
  setup() {
    const hospitals = ref([]); // Store fetched hospital data
    const router = useRouter(); // Instance router

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

    // Method for going back to the previous page
    const goBack = () => {
      router.back(); // Navigasi ke halaman sebelumnya
    };

    onMounted(() => {
      fetchHospitals();
    });

    return {
      hospitals,
      goBack, // Return goBack method
    };
  },
};
</script>


<style scoped>
ion-searchbar {
  --border-radius: 20px;
  --background: white;
  --color: black;
  border-radius: 20px;
  margin: 0;
  padding: 0;
  cursor: pointer;
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

ion-title {
  color: #418d4e; 
}

.banner {
  margin: 20px;
  overflow: hidden;
}

.banner-image {
  border-radius: 30px;
  width: 100%;
  height: auto;
  object-fit: cover;                      
}

ion-page {
  justify-content: center;
  align-items: center;
  display: flex;
}
</style>
