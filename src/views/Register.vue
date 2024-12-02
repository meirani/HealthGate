<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button icon="arrow-back-outline" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>REGISTRASI</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="container">
        <img src="@/assets/register-illustration.png" alt="Ilustrasi Registrasi" class="illustration" />

        <ion-label position="stacked">Username</ion-label>
        <ion-item class="custom-item">
          <ion-input :value="username" @ionInput="username = $event.target.value" placeholder="Masukkan username"
            required>
          </ion-input>
        </ion-item>



        <ion-label position="stacked">Email</ion-label>
        <ion-item class="custom-item">
          <ion-input :value="email" @ionInput="email = $event.target.value" type="email" placeholder="Masukkan email"
            required>
          </ion-input>
        </ion-item>

        <ion-label position="stacked">Password</ion-label>
        <ion-item class="custom-item">
          <ion-input :value="password" @ionInput="password = $event.target.value" type="password"
            placeholder="Masukkan password" required>
          </ion-input>
        </ion-item>

        <ion-label position="stacked">Konfirmasi Password</ion-label>
        <ion-item class="custom-item">
          <ion-input :value="confirmPassword" @ionInput="confirmPassword = $event.target.value" type="password"
            placeholder="Masukkan konfirmasi password" required>
          </ion-input>
        </ion-item>

        <ion-button expand="block" @click="register" class="register-button">Registrasi</ion-button>

        <p class="register-link">
          Sudah punya akun?
          <a @click="goToLogin">Login</a>
        </p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import "@/assets/css/formstyle.css";
import { registerUser } from "../services/auth";

export default {
  data() {
    return {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
  },
  methods: {
    async register() {
      if (!this.username.trim() || !this.email.trim() || !this.password.trim() || !this.confirmPassword.trim()) {
        alert("Semua kolom wajib diisi!");
        return;
      }

      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(this.email.trim())) {
        alert("Masukkan email yang valid!");
        return;
      }

      if (this.password.length < 6) {
        alert("Password minimal 6 karakter!");
        return;
      }

      if (this.password !== this.confirmPassword) {
        alert("Password dan Confirm Password harus sama!");
        return;
      }

      try {
        const message = await registerUser(this.email, this.password, this.username);
        alert(message);
        this.$router.push("/login");
      } catch (error) {
        alert(error.message);
      }
    },
    goToLogin() {
      this.$router.push("/login");
    },
  },
};
</script>
