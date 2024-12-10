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
                <ion-icon class="icons" :icon="icons.heart" size="large"></ion-icon>
                <ion-card-content>Rumah Sakit</ion-card-content>
              </ion-card>
            </router-link>
          </ion-col>

          <!-- Card Gawat Darurat -->
          <ion-col size="4">
            <router-link to="/emergency">
              <ion-card>
                <ion-icon class="icons" :icon="icons.medkit" size="large"></ion-icon>
                <ion-card-content>Gawat Darurat</ion-card-content>
              </ion-card>
            </router-link>
          </ion-col>

          <!-- Card Daftar Poli -->
          <ion-col size="4">
            <router-link to="/poli">
              <ion-card>
                <ion-icon class="icons" :icon="icons.list" size="large"></ion-icon>
                <ion-card-content>Daftar Poli</ion-card-content>
              </ion-card>
            </router-link>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import { heart, list, medkit} from 'ionicons/icons';

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

export default defineComponent({
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
  data(){
    return {
      icons: {
        heart,
        list,
        medkit
      }
    }
  }
});
</script>

<style scoped>
ion-card {
  text-align: center;
  margin: 5px;
  height: 120px;
  cursor: pointer;
}

ion-card-content {
  font-size: 14px;
  font-weight: bold;
  color: #555;
  margin-top: 5px;
}

ion-img {
  margin-bottom: 20px;
}

ion-icon {
  color: #555;
  margin-bottom: 0px;
}

.icons {
  margin-top: 10px;
  
  size: 30px;
}
</style>
