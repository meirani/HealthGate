<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Profile</ion-title>
            </ion-toolbar>
        </ion-header>
<<<<<<< Updated upstream

        <ion-content class="profile-content">
            <ion-card>
=======
        <ion-content >
            <ion-card class="container">
>>>>>>> Stashed changes
                <div class="profile-header">
                    <h2 class="profile-title">Your Profile</h2>
                    <ion-avatar class="avatar">
                        <img src="https://via.placeholder.com/150" alt="User Avatar">
                    </ion-avatar>
                    <ion-button color="primary" v-if="!isEditing" @click="toggleEdit">Edit Profile</ion-button>
                </div>

                <div class="profile-info">
                    <!-- View Mode -->
                    <div v-if="!isEditing">
                        <ion-item>
                            <ion-label class="info-label">Nama Pengguna:</ion-label>
                            <span class="info-value">{{ username }}</span>
                        </ion-item>
                        <ion-item>
                            <ion-label class="info-label">Email:</ion-label>
                            <span class="info-value">{{ email }}</span>
                        </ion-item>
                    </div>
<<<<<<< Updated upstream

                    <!-- Edit Mode -->
                    <div v-if="isEditing">
                        <ion-item>
                            <ion-label position="stacked">Nama Pengguna</ion-label>
                            <ion-input v-model="username" :value="username"
                                placeholder="Masukkan nama pengguna"></ion-input>
                        </ion-item>
                        <ion-item>
                            <ion-label position="stacked">Email</ion-label>
                            <ion-input type="email" v-model="email" :value="email"
                                placeholder="Masukkan email"></ion-input>
                        </ion-item>
                        <ion-item>
                            <ion-label position="stacked">Password Baru</ion-label>
                            <ion-input type="password" v-model="password"
                                placeholder="Masukkan password baru"></ion-input>
                        </ion-item>
                        <ion-item>
                            <ion-label position="stacked">Konfirmasi Password Baru</ion-label>
                            <ion-input type="password" v-model="confirmPassword"
                                placeholder="Konfirmasi password baru"></ion-input>
                        </ion-item>
=======
                    <div class="input-group">
                        <ion-label >Nama Pengguna</ion-label>
                        <ion-input v-model="username" class="profile-input" aria-disabled="false">windah</ion-input>
                    </div>
                    <div class="input-group">
                        <ion-label >Email</ion-label>
                        <ion-input v-model="email" class="profile-input" aria-disabled="false">windah@gmail.com</ion-input>
>>>>>>> Stashed changes
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="profile-actions">
                    <ion-button expand="block" color="primary" v-if="isEditing" @click="saveProfile">Simpan</ion-button>
                    <ion-button expand="block" color="medium" v-if="isEditing" @click="cancelEdit">Batal</ion-button>
                    <ion-button expand="block" color="danger" v-if="!isEditing" @click="logout">Logout</ion-button>
                </div>
            </ion-card>
        </ion-content>
    </ion-page>
</template>

<script>
import { auth } from "../firebase";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { updateEmail, updatePassword, signOut } from "firebase/auth";

export default {
    name: "ProfilePage",
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
.profile-content {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px;
    background-color: #f8f9fa;
}

ion-card {
    width: 100%;
    max-width: 400px;
    padding: 16px;
    border-radius: 12px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

<<<<<<< Updated upstream
.profile-header {
    text-align: center;
    margin-bottom: 20px;
}
=======
ion-label {
    text-align: left;
    font-size: 15px;
     color: #333;
    
}

.container {
    background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
  margin: 20px auto;
  max-width: 300px;
  margin-bottom: 100px;
}

/* .profile-header {
    text-align: center;
    margin-bottom: 16px;
} */
>>>>>>> Stashed changes

.avatar {
    margin: 10px auto;
    width: 100px;
    height: 100px;
}

.profile-info ion-item {
    margin-bottom: 15px;
}

<<<<<<< Updated upstream
.info-label {
    font-weight: bold;
    font-size: 14px;
    color: #333;
}

.info-value {
=======

ion-input {
    
    width: 100%;
    height: 20px;
     --padding-start: 10px; /* Inner padding on the left */
  --padding-end: 10px; /* Inner padding on the right */
  --padding-top: 5px; /* Inner padding on the top */
  --padding-bottom: 5px;
    padding: 10px;
    margin-right: 10px;
    margin-bottom: 16px;
}

.profile-input {
    --padding-start: 10px; /* Geser teks placeholder dari kiri */
    --padding-end: 10px;
    font-size: medium;
    color: black;
    padding-left: 10px; /* Jarak dari kiri */
    padding-right: 10px; /* Tambahkan jika ingin jarak kanan */
    padding-top: 5px; /* Jarak dari atas */
    padding-bottom: 5px; /* Jarak dari bawah */
    border-radius: 4px;
    border: 1px solid #ddd;
    text-align: left;
    line-height: 40px;
   
}

.profile-actions {
    margin-top: 16px;
}

.button-logout {
    height: 40px;
>>>>>>> Stashed changes
    font-size: 16px;
    color: #555;
}

.profile-actions ion-button {
    margin-top: 10px;
}

.profile-content {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh; /* Mengisi seluruh tinggi viewport */
    padding: 16px;
    background-color: #f8f9fa;
    box-sizing: border-box; /* Memastikan padding dihitung dalam ukuran elemen */
}

ion-card {
    width: 100%;
    max-width: 400px; 
    padding: 16px;
    border-radius: 12px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    background: #fff; 
}

.avatar-edit {
    flex-direction: column; 
    gap: 8px; }

</style>
