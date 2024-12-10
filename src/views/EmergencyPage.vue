<template>
  <ion-page>
    <!-- Header -->
    <ion-header>
      <ion-toolbar>
        <ion-title class="header-title">GAWAT DARURAT</ion-title>
      </ion-toolbar>
    </ion-header>

    <!-- Content -->
    <ion-content class="ion-padding">
      <!-- Gambar -->
      <div class="banner-wrapper">
        <ion-img src="emergency.jpg" alt="Emergency" class="emergency-image"></ion-img>
      </div>
      
      <!-- Emergency cards -->  
      <div class="emergency-list">
        <ion-card class="emergency-card">
          <ion-img src="rumahsakit.jpg" alt="Hospital Image" class="emergency-images"></ion-img>
          <div class="emergency-details">
            <h3>Nama RS</h3>
            <div class="phone-hospital">
              <ion-icon class="icons" :icon="icons.call" size="medium"></ion-icon>
              <a href="javascript:void(0)" @click="showCallAlert('02818904888')" style="color: blue; text-decoration: underline;">
                0281 8904888
              </a>
            </div>
          </div>
        </ion-card>
      </div>

      <!-- Alert -->
      <ion-alert
        :is-open="isAlertOpen"
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
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonImg, IonCard, IonIcon, IonAlert } from '@ionic/vue';
import { call } from 'ionicons/icons';

export default defineComponent({
  name: 'EmergencyPage',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonImg,
    IonCard,
    IonIcon,
    IonAlert
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

    // Fungsi untuk menghasilkan array buttons secara dinamis
    const getAlertButtons = () => [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          isAlertOpen.value = false;
        }
      },
      {
        text: 'Call',
        handler: () => {
          window.open(`tel:${alertPhoneNumber.value}`, '_self');
        }
      }
    ];

    return {
      icons: {
        call
      },
      isAlertOpen,
      alertMessage,
      alertPhoneNumber,
      showCallAlert,
      getAlertButtons
    };
  }
});
</script>

<style scoped>
.phone-hospital {
  display: flex;
  align-items: center;
  gap: 8px;
}

.emergency-list {
  margin: 16px;
}

.emergency-card {
  display: flex;
  align-items: center;
  margin: 16px 0;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.emergency-images {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 12px;
}

.emergency-details {
  flex: 1;
}

/* Gaya Header */
.header-title {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  color: #3b82f6;
}

/* Gambar Emergency */
.emergency-image {
  width: 100%;
  margin: 0;
}
</style>
