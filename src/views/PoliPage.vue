<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
          <a class="back-button" @click="goBack">
            Back
          </a >
        </ion-buttons>
                <ion-title>Choose Poli</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding" style="--background: #e1eee9;">
                <div v-if="loading" class="text-center text-gray-600">Memuat data...</div>
                <div v-else>
                   

                    <div v-if="polyclinics.length === 0" class="text-center text-gray-600">
                        Tidak ada poli yang tersedia untuk rumah sakit ini.
                    </div>

                    <div>
                        <h2 style="font-weight: bold; margin-top: 1px; ">Choose your preferred Poli</h2>
                    </div>
                    <div class="card-poli">
                        <div v-for="poli in polyclinics" :key="poli.id" class="card">
                            <h2 class="poli-name">{{ poli.name }}</h2>
                            <ion-button @click="goToDoctorSchedule(poli.id)" class="schedule-button" expand="block">
                                Doctor Schedule
                            </ion-button>
                            <!-- Tombol Edit dan Delete hanya untuk Admin -->
                            <ion-buttons v-if="isAdmin" slot="end" class="admin-buttons">
                                <ion-button @click="editPoli(poli)" color="warning">
                                     <img class="ud-icon" src="@/assets/edit-icon.png" alt="">
                                </ion-button>
                                <ion-button @click="deletePoli(poli.id)" color="danger">
                                     <img class="ud-icon" src="@/assets/delete-icon.png" alt="">
                                </ion-button>
                            </ion-buttons>

                            
                            
                        </div>
                    </div>
                </div>
                  <!-- Ruang Scroll Tambahan -->
                    <div class="scroll-padding"></div>

                     

                     <button v-if="isAdmin" @click="goToAddPoli" expand="block" class="add-button">
                        <img class="icon-add" src="@/assets/add-icon.png"></img>
                    </button>
        </ion-content>
    </ion-page>
</template>

<script>
import { getFirestore, doc, collection, getDocs, deleteDoc, getDoc } from "firebase/firestore";
import { auth } from "../firebase";
import { IonPage, IonHeader, IonToolbar, IonButtons, IonTitle, IonContent, IonButton } from "@ionic/vue";
import { useRouter } from "vue-router";

export default {
    name: "PoliPage",
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
            polyclinics: [],
            loading: true,
            isAdmin: false,
        };
    },
    methods: {
        goBack() {
            this.$router.back();
        },
        async fetchPolyclinics() {
            try {
                const db = getFirestore();
                const hospitalId = this.$route.params.hospitalId; // Mengambil hospitalId dari URL
                const hospitalRef = doc(db, "hospitals", hospitalId);
                const polyclinicsRef = collection(hospitalRef, "polyclinics");
                const querySnapshot = await getDocs(polyclinicsRef);
                this.polyclinics = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
            } catch (error) {
                console.error("Error fetching polyclinics:", error);
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
        goToAddPoli() {
            const hospitalId = this.$route.params.hospitalId;
            this.$router.push({ name: "AddPoli", params: { hospitalId } });
        },
        editPoli(poli) {
            const hospitalId = this.$route.params.hospitalId;
            this.$router.push({ name: "EditPoli", params: { hospitalId, poliId: poli.id } });
        },
        async deletePoli(poliId) {
            const hospitalId = this.$route.params.hospitalId;
            if (confirm("Apakah Anda yakin ingin menghapus poli ini?")) {
                try {
                    const db = getFirestore();
                    const poliRef = doc(db, "hospitals", hospitalId, "polyclinics", poliId);
                    await deleteDoc(poliRef);
                    this.fetchPolyclinics(); // Refresh data setelah penghapusan
                } catch (error) {
                    console.error("Error deleting poli:", error);
                }
            }
        },
        goToDoctorSchedule(poliId) {
            this.$router.push({ name: "DoctorSchedule", params: { poliId } });
        },
    },
    mounted() {
        this.fetchPolyclinics();
        this.checkAdminRole();
    },
};
</script>

<style scoped>
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

.ud-icon {
    width: 30px;
    height: 30px;
}

.icon-add {
    height: 40px;
    width: 40px;
}

.container {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin: 20px auto;
    max-width: 800px;
}

.card {
    background-color: #f8f9fa;
    border-radius: 10px;
    padding: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 10px;
}

.poli-name {
    font-size: 18px;
    font-weight: bold;
    color: #006FAE;
    margin-bottom: 12px;
}

.schedule-button {
    background-color: #006FAE;
    color: white;
    border-radius: 20px;
    font-weight: bold;
}

.schedule-button:hover {
    background-color: #004f75;
    transition: background-color 0.3s;
}

.add-button {
    margin-bottom: 15px;
}

.admin-buttons ion-button {
    margin-top: 10px;
}

.scroll-padding {
  height: 300px; /* Menambahkan ruang ekstra 500px di bawah konten */
}
</style>
