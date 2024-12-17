<template>
  <ion-page>
    <!-- Header -->
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <a class="back-button" @click="goBack">
            Back
          </a >
        </ion-buttons>
        <ion-title class="header-title">Emergency</ion-title>
      </ion-toolbar>
    </ion-header>

    <!-- Content -->
    <ion-content class="ion-padding" style="--background: #e1eee9;">
      <!-- Gambar -->
      <div class="banner">
        <img src="@/assets/emergency-banner.png" alt="Emergency" class="banner-image" />
      </div>

      <!-- Kartu Gawat Darurat -->
      <ion-card class="emergency-card">
        <img src="@/assets/ambulance.jpg" alt="Ambulance Image" class="emergency-image" />
        <ion-card-content>
          <h3 class="emergency-title">GAWAT DARURAT</h3>
          <p class="emergency-description">Dapatkan bantuan darurat medis dari Health Gate</p>
          <div class="call-section">
            <ion-icon :icon="call" class="call-icon"></ion-icon>
            <a href="javascript:void(0)" @click="showCallAlert('911')" style="color: blue; text-decoration: none; font-size: 25px; font-weight: 20px; ">911</a>
          </div>
        </ion-card-content>
      </ion-card>

      <!-- Alert -->
      <ion-alert
        :isOpen="isAlertOpen"
        header="Call"
        :message="alertMessage"
        :buttons="getAlertButtons()"
        @didDismiss="isAlertOpen = false"
      ></ion-alert>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, ref } from 'vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonIcon,
  IonButton,
  IonButtons,
  IonAlert,
} from '@ionic/vue';
import { call } from 'ionicons/icons';

export default defineComponent({
  name: 'EmergencyPage',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardContent,
    IonIcon,
    IonButton,
    IonButtons,
    IonAlert,
  },
  setup() {
    const isAlertOpen = ref(false);
    const alertMessage = ref('');
    const alertPhoneNumber = ref('');

    const showCallAlert = (phoneNumber) => {
      alertMessage.value = `Call ${phoneNumber}?`;
      alertPhoneNumber.value = phoneNumber;
      isAlertOpen.value = true;
    };

    const getAlertButtons = () => [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          isAlertOpen.value = false;
        },
      },
      {
        text: 'Call',
        handler: () => {
          window.open(`tel:${alertPhoneNumber.value}`, '_self');
        },
      },
    ];

    const goBack = () => {
      window.history.back();
    };

    return {
      call,
      isAlertOpen,
      alertMessage,
      alertPhoneNumber,
      showCallAlert,
      getAlertButtons,
      goBack,
    };
  },
});
</script>

<style scoped>
/* Header */
.header-title {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  color: #3b82f6;
}

.back-button {
  color: #3b82f6;
  font-size: 16px;
  background-color: transparent ;
}

/* Gambar Banner */
.banner {
  overflow: hidden;
  margin-bottom: 10px;
}

.banner-image {
  border-radius: 20px;
  width: 100%;
  height: auto;
  object-fit: cover;
}

/* Kartu Darurat */
.emergency-card {
  margin: 20px auto;
  padding: 16px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
}

.emergency-image {
  width: 300px;
  height: 300px;
  object-fit: contain;
  margin-bottom: 12px;
  border-radius: 20px;
}

.emergency-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin: 0;
}

.emergency-description {
  font-size: 14px;
  text-align: center;
  color: #666;
  margin: 8px 0 16px;
}

.call-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.call-icon {
  font-size: 20px;
  color: #3b82f6;
}
</style>
