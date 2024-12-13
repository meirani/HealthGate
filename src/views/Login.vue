<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button icon="arrow-back-outline" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>LOGIN</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="container">
        <img src="@/assets/login.jpg" alt="Ilustrasi Login" class="illustration" />

        <ion-label position="stacked">Email</ion-label>
        <ion-item class="custom-item">
          <ion-input :value="email" @ionInput="email = $event.target.value" type="email" placeholder="Masukkan email"
            required></ion-input>
        </ion-item>

        <ion-label position="stacked">Password</ion-label>
        <ion-item class="custom-item">
          <ion-input type="password" :value="password" @ionInput="password = $event.target.value"
            placeholder="Masukkan password" required></ion-input>
        </ion-item>

        <ion-button expand="block" @click="login" class="login-button">Login</ion-button>

        <!-- Link Register -->
        <p class="register-link">
          Belum punya akun?
          <a @click="goToRegister">Register</a>
        </p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton } from "@ionic/vue";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import "@/assets/css/formstyle.css";
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
        await signInWithEmailAndPassword(auth, this.email, this.password);
        alert("Login berhasil!");
        this.$router.push("/home"); // Arahkan ke halaman Home setelah login
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
};
</script>
