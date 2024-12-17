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
    <ion-content style="--background: #e1eee9;">
      <div>
        <p style="font-size: 30px; font-weight: bolder; margin-left: 15px;">
          Welcome <span class="info-value">{{ username }}</span> !
        </p>
      </div>
      <!-- Banner -->
       <div class="banner">
        <img class="banner-image" src="@/assets/homepage-banner.png" alt="Banner"></img>
       </div>
      
       <div>
        <p style="font-weight: bolder; font-size: 20px; margin-left: 20px; margin-bottom: 5px;  ">Choose your Services</p>
       </div>
      <!-- Kategori -->
      <ion-grid>
        <ion-row>
          <!-- Card Rumah Sakit -->
          <ion-col size="6">
            <router-link to="/hospitals">
              <div class="ion-card">
                <ion-card-content>
                  <img src="@/assets/hospital.png" alt="Ambulance" style="height: 70px; vertical-align: middle; width:70px;">
                 <p>Hospital</p> 
                </ion-card-content>
              </div>
            </router-link>
          </ion-col>

          <!-- Card Gawat Darurat -->
          <ion-col size="6">
            <router-link to="/emergency">
              <div class="ion-card">
                <ion-card-content>
                  <img src="@/assets/emergency.png" alt="Ambulance" style="height: 70px; vertical-align: middle; width:70px;">
                 <p>Emergency</p> 
                </ion-card-content>
              </div>
            </router-link>
          </ion-col>

          <!-- Card Daftar Poli -->
          <ion-col size="6">
            <router-link to="/selecthospital">
              <div class="ion-card">
                <ion-card-content>
                  <img src="@/assets/register.png" alt="Ambulance" style="height: 70px; vertical-align: middle; width:70px;">
                 <p>Registration</p> 
                </ion-card-content>
              </div>
            </router-link>
          </ion-col>

          <!-- Card UserCard -->
          <ion-col size="6">
            <router-link to="/user-card">
              <div  class="ion-card">
                <ion-card-content>
                  <img src="@/assets/queue.png" alt="Ambulance" style="height: 70px; vertical-align: middle; width:70px;">
                 <p>Queue</p> 
                </ion-card-content>
              </div>
            </router-link>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script>
import { auth } from "../firebase";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { updateEmail, updatePassword, signOut } from "firebase/auth";
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
  data() {
        return {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            isEditing: false,
            originalData: {}, // Untuk menyimpan data awal pengguna
        };
    },
    async mounted() {
        await this.fetchUserData();
    },
    methods: {
        async fetchUserData() {
            const user = auth.currentUser;
            console.log("Current User:", user); // Tambahkan log untuk melihat informasi pengguna
            if (!user) {
                alert("Pengguna tidak ditemukan. Silakan login ulang.");
                this.$router.push("/login");
                return;
            }

            try {
                const db = getFirestore();
                const userRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    console.log("Fetched User Data:", userData); // Log data yang diambil
                    this.username = userData.username || "";
                    this.email = userData.email || "";
                    this.originalData = { username: this.username, email: this.email };
                } else {
                    console.error("User document not found in Firestore.");
                    alert("Data pengguna tidak ditemukan di Firestore.");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                alert("Terjadi kesalahan saat memuat data pengguna.");
            }
        },
        toggleEdit() {
            console.log("Toggling Edit Mode: true");
            this.isEditing = true;
        },
        async saveProfile() {
            console.log("Save Profile - Input Data:", {
                username: this.username,
                email: this.email,
                password: this.password,
                confirmPassword: this.confirmPassword,
            });

            if (!this.username.trim() || !this.email.trim()) {
                alert("Nama pengguna dan email tidak boleh kosong!");
                return;
            }

            if (this.password || this.confirmPassword) {
                if (this.password !== this.confirmPassword) {
                    alert("Password baru dan konfirmasi password tidak cocok!");
                    return;
                }
                if (this.password.length < 6) {
                    alert("Password baru harus memiliki minimal 6 karakter!");
                    return;
                }
            }

            const user = auth.currentUser;
            console.log("Current Auth User:", user);
            if (!user) {
                alert("Pengguna tidak ditemukan. Silakan login ulang.");
                this.$router.push("/login");
                return;
            }

            try {
                const db = getFirestore();
                const userRef = doc(db, "users", user.uid);

                // Update Firestore data
                console.log("Updating Firestore Data...");
                await updateDoc(userRef, {
                    username: this.username,
                    email: this.email,
                });
                console.log("Firestore Update Success");

                // Update Firebase Authentication Email if changed
                if (user.email !== this.email) {
                    console.log("Updating Firebase Authentication Email...");
                    await updateEmail(user, this.email);
                    console.log("Email Update Success");
                }

                // Update Firebase Authentication Password if provided
                if (this.password) {
                    console.log("Updating Firebase Authentication Password...");
                    await updatePassword(user, this.password);
                    console.log("Password Update Success");
                }

                alert("Profil berhasil diperbarui.");
                this.isEditing = false;

                // Refresh data from Firestore
                await this.fetchUserData();
            } catch (error) {
                console.error("Error updating profile:", error);
                alert("Terjadi kesalahan saat memperbarui profil. Silakan coba lagi.");
            }
        },
        cancelEdit() {
            console.log("Cancelling Edit Mode: false");
            this.username = this.originalData.username;
            this.email = this.originalData.email;
            this.password = "";
            this.confirmPassword = "";
            this.isEditing = false;
        },
        async logout() {
            try {
                await signOut(auth);
                this.$router.push("/login");
            } catch (error) {
                console.error("Error logging out:", error);
                alert("Gagal logout: " + error.message);
            }
        },
    },
};

</script>

<style scoped>
.ion-card {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin: 10px;
  height: 100px;
  width: 150px;
  cursor: pointer;
  background-color: #83c6bb;
  border-radius: 20px;
}

ion-row {
  justify-content: center;
  align-items: center;
}

ion-col {
  display: flex;
  justify-content: center;
  align-items: center;
}

ion-card-content {
  font-size: 14px;
  font-weight: bold;
  color: #555;
  justify-content: center;
  align-items: center;
  text-decoration: none;
}

.banner {
  margin: 20px;
  /* border-radius: 15%; */
  overflow: hidden;

}

.banner-image {
  border-radius: 30px;
  width: 100%;
  height: auto;
  object-fit: cover;
  
}

ion-icon {
  color: #555;
}

ion-page {
  justify-content: center;
  align-items: center;
  display: flex;
}

ion-title {
  color: #418d4e; /* Ubah warna teks menjadi hijau */
}
</style>