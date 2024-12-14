<template>
  <ion-app>
    <ion-tabs>
      <!-- Konten utama -->
      <ion-router-outlet :key="$route.fullPath"></ion-router-outlet>

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
/* Jangan gunakan posisi fixed di sini */
ion-tab-bar {
  background-color: #ffffff;
  border-top: 1px solid #e0e0e0;
}

.label-tab-bar {
  font-size: 0.8rem;
}
</style>
