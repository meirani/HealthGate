<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button icon="arrow-back-outline" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>
          Register
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding" style="--background: #e1eee9">
      <img src="@/assets/register-page.png" alt="Ilustrasi Registrasi" class="illustration" />

      <ion-label position="stacked">Username</ion-label>
      <ion-item class="custom-item" style="--focus-border-color: #038d92;">
        <ion-input 
          :value="username" 
          @ionInput="username = $event.target.value" 
          placeholder="Enter username" 
          required>
        </ion-input>
      </ion-item>

      <ion-label position="stacked">Email</ion-label>
      <ion-item class="custom-item" style="--focus-border-color: #038d92;">
        <ion-input 
          :value="email" 
          @ionInput="email = $event.target.value" 
          type="email" 
          placeholder="Enter email" 
          required>
        </ion-input>
      </ion-item>

      <ion-label position="stacked">Password</ion-label>
      <ion-item class="custom-item" style="--focus-border-color: #038d92;">
        <ion-input 
          :value="password" 
          @ionInput="password = $event.target.value" 
          type="password" 
          placeholder="Enter password" 
          required>
        </ion-input>
      </ion-item>

      <ion-label position="stacked">Konfirmasi Password</ion-label>
      <ion-item class="custom-item" style="--focus-border-color: #038d92;">
        <ion-input 
          :value="confirmPassword" 
          @ionInput="confirmPassword = $event.target.value" 
          type="password" 
          placeholder="Confirm password" 
          required>
        </ion-input>
      </ion-item>

      <ion-button expand="block" @click="register" class="register-button">Register</ion-button>

      <p class="register-link">
        Already have account?
        <a @click="goToLogin">Login</a>
      </p>
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

<style scoped>
.illustration {
  max-width: 300px;
  margin-top: 50px;
}

.custom-item {
  --border-width: 2px;
  --border-color: lightgrey; /* Default border color */
  --focus-border-color: #2196f3; /* Default focus color */
  --hover-border-color: #4caf50; /* Default hover color */
  border: var(--border-width) solid var(--border-color);
  border-radius: 10px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.custom-item ion-input {
  background: transparent;
}

.custom-item:focus-within {
  --border-color: var(--focus-border-color);

}

.custom-item:hover {
 
}

.register-button {
  margin-top: 20px;
}

.register-link {
  text-align: center;
  margin-top: 10px;
}
</style>
