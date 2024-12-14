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
      <ion-img src="homepage.jpg" alt="Banner"></ion-img>

      <!-- Kategori -->
      <ion-grid>
        <ion-row>
          <!-- Card Rumah Sakit -->
          <ion-col size="12">
            <router-link to="/hospitals">
              <ion-card class="gradient-blue">
                <ion-icon name="heart-outline" size="large"></ion-icon>
                <ion-card-content>Rumah Sakit</ion-card-content>
              </ion-card>
            </router-link>
          </ion-col>

          <!-- Card Gawat Darurat -->
          <ion-col size="12">
            <router-link to="/emergency">
              <ion-card class="gradient-purple">
                <ion-icon name="eye-outline" size="large"></ion-icon>
                <ion-card-content>Gawat Darurat</ion-card-content>
              </ion-card>
            </router-link>
          </ion-col>

          <!-- Card Daftar Poli -->
          <ion-col size="12">
            <router-link to="/selecthospital">
              <ion-card class="gradient-green">
                <ion-icon name="body-outline" size="large"></ion-icon>
                <ion-card-content>Daftar</ion-card-content>
              </ion-card>
            </router-link>
          </ion-col>

          <!-- Card UserCard -->
          <ion-col size="12">
            <router-link to="/user-card">
              <ion-card class="gradient-orange">
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  padding: 15px;
  height: 70px;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.gradient-blue {
  background: linear-gradient(45deg, #4facfe, #00f2fe);
  color: #fff;
}

.gradient-purple {
  background: linear-gradient(45deg, #a18cd1, #fbc2eb);
  color: #fff;
}

.gradient-green {
  background: linear-gradient(45deg, #43e97b, #38f9d7);
  color: #fff;
}

.gradient-orange {
  background: linear-gradient(45deg, #f7971e, #ffd200);
  color: #fff;
}

router-link {
  text-decoration: none;
}

ion-icon {
  font-size: 30px;
  margin-right: 15px;
  color: #fff;
}

ion-card-content {
  font-size: 16px;
  font-weight: bold;
  text-align: left;
  color: #fff;
  text-decoration: none;
}
</style>
