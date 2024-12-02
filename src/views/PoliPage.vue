<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Pilih Tanggal & Poli Klinik</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-list>
                <ion-item>
                    <ion-label>Tanggal</ion-label>
                    <ion-datetime display-format="DD MMM YYYY" v-model="selectedDate" @ionChange="onDateChange"
                        tabindex="0">
                    </ion-datetime>
                </ion-item>
                <ion-item>
                    <ion-label>Poli Klinik</ion-label>
                    <ion-select v-model="selectedPoli" placeholder="Pilih Poli" @ionChange="onPoliChange" tabindex="0">
                        <ion-select-option v-for="poli in poliklinikList" :key="poli.id" :value="poli.id" tabindex="0">
                            {{ poli.name }}
                        </ion-select-option>
                    </ion-select>
                </ion-item>
            </ion-list>
            <ion-button expand="block" @click="nextStep" tabindex="0">
                Lanjutkan
            </ion-button>
        </ion-content>
    </ion-page>
</template>

<script>
import { defineComponent } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase"; // Pastikan jalur ini sesuai dengan struktur proyek Anda
import { alertController } from "@ionic/vue";

export default defineComponent({
    name: "PoliPage",
    data() {
        return {
            selectedDate: "", // Tanggal yang dipilih pengguna
            selectedPoli: "", // Poli yang dipilih pengguna
            poliklinikList: [], // Daftar poli dari Firestore
        };
    },
    async mounted() {
        try {
            // Ambil data dari koleksi "polyclinics" di Firestore
            const snapshot = await getDocs(collection(db, "polyclinics"));
            this.poliklinikList = snapshot.docs.map((doc) => ({
                id: doc.id,
                name: doc.data().name, // Pastikan field "name" ada di Firestore
            }));
            console.log("Poliklinik List:", this.poliklinikList);
        } catch (error) {
            console.error("Error fetching polyclinics:", error);
        }
    },

    methods: {
        onDateChange(event) {
            console.log("Date Changed:", event.detail.value);
            this.selectedDate = event.detail.value;
        },
        onPoliChange(event) {
            console.log("Poli Changed:", event.detail.value);
            this.selectedPoli = event.detail.value;
        },
        async nextStep() {
            console.log("Selected Date (Final):", this.selectedDate);
            console.log("Selected Poli (Final):", this.selectedPoli);

            if (!this.selectedDate || !this.selectedPoli) {
                const alert = await alertController.create({
                    header: "Error",
                    message: "Silakan pilih tanggal dan poli terlebih dahulu.",
                    buttons: ["OK"],
                });
                await alert.present();
                return;
            }

            if (isNaN(Date.parse(this.selectedDate))) {
                const alert = await alertController.create({
                    header: "Error",
                    message: "Format tanggal tidak valid.",
                    buttons: ["OK"],
                });
                await alert.present();
                return;
            }

            const selectedDateObject = new Date(this.selectedDate);
            this.$router.push({
                name: "SelectHospital",
                query: {
                    date: selectedDateObject.toISOString(),
                    poli: this.selectedPoli,
                },
            }).catch((err) => {
                console.error("Navigation Error:", err);
            });
        },
    },
});
</script>

<style scoped>
/* Tambahkan gaya khusus jika diperlukan */
</style>
