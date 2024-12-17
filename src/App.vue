<template>
  <ion-app>
    <ion-tabs>
      <!-- Konten utama -->
      <ion-router-outlet :key="$route.fullPath" style="color:#418d4e;"></ion-router-outlet>

      <!-- Tab Bar di Footer -->
      <ion-tab-bar v-if="showTabBar" slot="bottom">
        <ion-tab-button tab="home" href="/home">
          <ion-icon :icon="icons.home"></ion-icon>
          <ion-label class="label-tab-bar">Home</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="poli" href="/selecthospital">
          <ion-icon :icon="icons.list"></ion-icon>
          <ion-label class="label-tab-bar">Register</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="profile" href="/profile">
          <ion-icon :icon="icons.person"></ion-icon>
          <ion-label class="label-tab-bar">Profile</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-app>
</template>

<script>
import { defineComponent } from "vue";
import {
  IonApp,
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from "@ionic/vue";
import { home, list, person } from "ionicons/icons";

export default defineComponent({
  name: "App",
  components: {
    IonApp,
    IonTabs,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel,
  },
  data() {
    return {
      icons: {
        home,
        list,
        person,
      },
    };
  },
  computed: {
    showTabBar() {
      return this.$route.name !== "Login";
    },
  },
});
</script>

<style scoped>
/* Warna background untuk tab bar */
ion-tab-bar {
  background-color: #ffffff;
  border-top: 1px solid #e0e0e0;
  height: 60px;
  vertical-align: middle;
}

/* Styling label tab bar */
.label-tab-bar {
  font-size: 0.8rem;
}

/* Warna hijau saat hover */
ion-tab-button:hover {
 
  --color-selected: #4caf50; /* Warna hijau untuk elemen yang dipilih */
}

ion-tab-button:hover ion-label,
ion-tab-button:hover ion-icon {
  color: #4caf50; /* Warna hijau untuk teks dan ikon saat hover */
}

ion-title {
  color: #4caf50; /* Ubah warna teks menjadi hijau */
}
</style>
