<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>
          <img src="@/assets/logo.png" alt="HealthGate Logo" style="height: 40px; vertical-align: middle;">
          HealthGate
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <!-- Banner -->
      <ion-img src="https://via.placeholder.com/500x200" alt="Banner"></ion-img>

      <!-- Kategori -->
      <ion-grid>
        <ion-row>
          <!-- Card Rumah Sakit -->
          <ion-col size="4">
            <router-link to="/hospitals">
              <ion-card>
                <ion-icon name="heart-outline" size="large"></ion-icon>
                <ion-card-content>Rumah Sakit</ion-card-content>
              </ion-card>
            </router-link>
          </ion-col>

          <!-- Card Gawat Darurat -->
          <ion-col size="4">
            <router-link to="/emergency">
              <ion-card>
                <ion-icon name="eye-outline" size="large"></ion-icon>
                <ion-card-content>Gawat Darurat</ion-card-content>
              </ion-card>
            </router-link>
          </ion-col>

          <!-- Card Daftar Poli -->
          <ion-col size="4">
            <router-link to="/selecthospital">
              <ion-card>
                <ion-icon name="body-outline" size="large"></ion-icon>
                <ion-card-content>Daftar</ion-card-content>
              </ion-card>
            </router-link>
          </ion-col>

          <!-- Card UserCard -->
          <ion-col size="4">
            <router-link to="/user-card">
              <ion-card>
                <ion-icon name="list-outline" size="large"></ion-icon>
                <ion-card-content>Kartu Antrean</ion-card-content>
              </ion-card>
            </router-link>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonImg,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonIcon,
  IonCardContent,
} from '@ionic/vue';

export default {
  name: 'HomePage',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonImg,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonIcon,
    IonCardContent,
  },
};
</script>

<style scoped>
ion-card {
  text-align: center;
  margin: 5px;
  height: 100px;
  cursor: pointer;
}

ion-card-content {
  font-size: 14px;
  font-weight: bold;
  color: #555;
}

ion-img {
  margin-bottom: 20px;
}

ion-icon {
  color: #555;
}
</style>
