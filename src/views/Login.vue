<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button icon="arrow-back-outline" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Log in</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding" style="--background: #e1eee9">
      <img src="@/assets/login.png" alt="Ilustrasi Login" class="illustration" />

      <ion-label position="stacked" class="label">Email</ion-label>
      <ion-item class="custom-item" style="--focus-border-color: #038d92;">
        <ion-input 
          :value="email" 
          @ionInput="email = $event.target.value" 
          type="email" 
          placeholder="Enter your email"
          required>
        </ion-input>
      </ion-item>

      <ion-label position="stacked" class="label">Password</ion-label>
      <ion-item class="custom-item" style="--focus-border-color: #038d92;">
        <ion-input 
          :value="password" 
          @ionInput="password = $event.target.value" 
          type="password" 
          placeholder="Enter your password"
          required>
        </ion-input>
      </ion-item>

      <ion-button expand="block" @click="login" class="login-button">Login</ion-button>

      <p class="register-link">
        Don't have account?
        <a @click="goToRegister">Register</a>
      </p>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton } from "@ionic/vue";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default {
  name: "Login",
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
  },
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async login() {
      if (!this.email.trim() || !this.password.trim()) {
        alert("Email dan password tidak boleh kosong!");
        return;
      }

      try {
        const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
        const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
        const role = userDoc.data().role;

        alert("Login berhasil!");

        if (role === "admin") {
          this.$router.push("/admin"); // Arahkan ke halaman Admin
        } else {
          this.$router.push("/home"); // Arahkan ke halaman Home
        }
      } catch (error) {
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);
        alert(error.message);
      }
    },
    goToRegister() {
      this.$router.push("/register");
    },
  },
};
</script>

<style scoped>
.illustration {
  max-width: 300px;
  margin-top: 50px;
}

.label {
  font-weight: bold;
}

.custom-item {
  
  --focus-border-color: #038d92; /* Default focus color */
  border: var(--border-width) solid var(--border-color);
  border-radius: 10px;
  
}

.custom-item ion-input {
  background: transparent;
}

.custom-item:focus-within {
  --border-color: var(--focus-border-color);
}

.login-button {
  margin-top: 20px;
}

.register-link {
  text-align: center;
  margin-top: 10px;
}
</style>
