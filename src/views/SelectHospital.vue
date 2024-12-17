<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
          <a class="back-button" @click="goBack">
            Back
          </a >
        </ion-buttons>
                <ion-title>Choose Hospital</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding"  style="--background: #e1eee9;">
             <!-- Image Banner -->
            <div class="banner">
                <img class="banner-image" src="@/assets/choose-hospital-banner.png" alt="Banner"></img>
            </div>
                <div v-if="loading" class="text-center text-gray-600">Memuat data...</div>
                <div v-else>
                    <div v-if="hospitals.length === 0" class="text-center text-gray-600">
                        Tidak ada rumah sakit tersedia.
                    </div>
                    <div>
                      <h2 style="font-weight: bold; margin-top: 1px; ">Choose your preferred Hospital</h2>
                    </div>
                    <div v-for="hospital in hospitals" :key="hospital.id" class="card mb-4">
                         <h2 class="hospital-name">{{ hospital.name }}</h2>

                       <div class="card-info">
                        <img class="icon-card" src="@/assets/address-icon.png" alt="Hospital Icon" />
                        <span class="hospital-address">{{ hospital.address }}</span>
                    </div>

                    <div class="card-info">
                        <img class="icon-card" src="@/assets/icon-hospital-des.png" alt="Hospital Icon" />
                        <span class="hospital-address">{{ hospital.deskripsi }}</span>
                    </div>

                       
                        <div class="card-info">
                            <img class="icon-card" src="@/assets/phone-icon.png" alt="Hospital Icon" />
                            <span class="hospital-address">Kontak: {{ hospital.contact }}</span>
                        </div>
                        
                        <ion-button @click="goToPoliPage(hospital.id)" class="select-button" expand="block">
                            Choose
                        </ion-button>
                        <!-- Tombol Edit dan Delete untuk admin -->
                        <ion-buttons v-if="isAdmin" slot="end" class="admin-buttons">
                            <ion-button @click="editHospital(hospital)" color="warning">
                                <img class="ud-icon" src="@/assets/edit-icon.png" alt="">
                            </ion-button>
                            <ion-button @click="deleteHospital(hospital.id)" color="danger">
                                <img class="ud-icon" src="@/assets/delete-icon.png" alt="">
                            </ion-button>
                        </ion-buttons>
                    </div>
                </div>

                        <!-- Ruang Scroll Tambahan -->
                    <div class="scroll-padding"></div>

                <button v-if="isAdmin" @click="goToAddHospital" expand="block" class="add-button">
                        <img class="icon-add" src="@/assets/add-icon.png"></img>
                    </button>
        </ion-content>
    </ion-page>
</template>



<script>
import { getFirestore, collection, getDocs, doc, getDoc, deleteDoc } from "firebase/firestore";
import { auth } from "../firebase";
import { IonPage, IonHeader, IonToolbar, IonButtons, IonTitle, IonContent, IonButton } from "@ionic/vue";
import { useRouter } from "vue-router";

export default {
  name: "SelectHospital",
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonTitle,
    IonContent,
    IonButton,
  },
  data() {
    return {
      hospitals: [],
      loading: true,
      isAdmin: false,
    };
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    async fetchHospitals() {
      try {
        const db = getFirestore();
        const querySnapshot = await getDocs(collection(db, "hospitals"));
        this.hospitals = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      } finally {
        this.loading = false;
      }
    },
    async checkAdminRole() {
      const user = auth.currentUser;
      if (user) {
        const db = getFirestore();
        const userDoc = await getDoc(doc(db, "users", user.uid));
        this.isAdmin = userDoc.exists() && userDoc.data().role === "admin";
      }
    },
    goToAddHospital() {
      this.$router.push({ name: "AddHospital" });
    },
    editHospital(hospital) {
      this.$router.push({ name: "EditHospital", params: { hospitalId: hospital.id } });
    },
    async deleteHospital(hospitalId) {
      if (confirm("Apakah Anda yakin ingin menghapus rumah sakit ini?")) {
        try {
          const db = getFirestore();
          await deleteDoc(doc(db, "hospitals", hospitalId));
          this.fetchHospitals();
        } catch (error) {
          console.error("Error deleting hospital:", error);
        }
      }
    },
    goToPoliPage(hospitalId) {
      this.$router.push({ name: "PoliPage", params: { hospitalId } });
    },
  },
  mounted() {
    this.fetchHospitals();
    this.checkAdminRole();
  },
};
</script>



<style scoped>
.card-info {
     display: flex;
    align-items: center; /* Membuat ikon dan teks sejajar secara vertikal */
    gap: 8px; /* Memberi jarak antara ikon dan teks */
    margin-left: 0; /* Menghapus margin sebelumnya jika perlu */
    margin-bottom: 10px;
}

.icon-card {
    width: 18px; /* Ukuran ikon lebih kecil agar proporsional */
    height: 18px;
    object-fit: contain; /* Memastikan ikon tetap proporsional */

}

.container {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin: 20px auto;
    max-width: 600px;
}

.illustration {
    display: block;
    margin: 0 auto 20px;
    width: 100%;
    height: auto;
}

.card {
    background-color: #f8f9fa;
    border-radius: 10px;
    padding: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
}

.hospital-name {
    font-size: 20px;
    font-weight: bold;
    color: black;
    margin-bottom: 10px;
}

.hospital-address,
.hospital-description,
.hospital-contact {
    font-size: 14px;
    color: #333;
    margin: 0px;
}

.ud-icon {
    width: 30px;
    height: 30px;
}

.select-button {
    background-color: #006FAE;
    color: white;
    border-radius: 20px;
    font-weight: bold;
    margin-top: 15px;
    width: 100px;
    height: 30px;
}

.select-button:hover {
    background-color: #004f75;
    transition: background-color 0.3s;
}

.add-button {
     position: fixed;
  bottom: 30px; /* Sesuaikan agar di atas bottom tab bar */
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000; /* Pastikan ini lebih besar agar tombol tetap di atas elemen lain */
  width: 60px;
    height: 60px;
    border-radius: 25%;
    background-color: #038d92;
    box-shadow: inset;
}

.icon-add {
    height: 40px;
    width: 40px;
}

.banner-image {
    margin-bottom: 20px;
    border-radius: 10px;
}

.scroll-padding {
  height: 300px; /* Menambahkan ruang ekstra 500px di bawah konten */
}
</style>