<template>
  <ion-app>
    <ion-tabs>
      <ion-router-outlet :key="$route.fullPath"></ion-router-outlet>
      <!-- Bottom Navigation Bar -->
      <ion-tab-bar v-if="showTabBar" slot="bottom" translucent>
        <ion-tab-button tab="home" href="/home">
          <ion-icon :icon="icons.home"></ion-icon>
          <ion-label class="label-tab-bar">Home</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="poli" href="/poli">
          <ion-icon :icon="icons.list"></ion-icon>
          <ion-label class="label-tab-bar">Poli</ion-label>
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
import { defineComponent, computed } from 'vue';
import { IonApp, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/vue';
import { home, list, person } from 'ionicons/icons';

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonTabs,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel
  },
  data() {
    return {
      icons: {
        home,
        list,
        person
      }
    };
  },
  computed: {
    showTabBar() {
      return this.$route.name !== 'Login';
    }
  }
});
</script>

<style>
ion-tab-bar {
  position: fixed;
  bottom: 0;
  width: 100%;
}

.label-tab-bar {
  font-size: 0.8rem;
}
</style>