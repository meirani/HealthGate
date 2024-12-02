<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Pilih Rumah Sakit</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-list v-if="hospitalList.length">
                <ion-item v-for="hospital in hospitalList" :key="hospital.id">
                    <ion-label>
                        <h2>{{ hospital.name }}</h2>
                        <p>{{ hospital.address }}</p>
                        <p>Kontak: {{ hospital.contact }}</p>
                    </ion-label>
                </ion-item>
            </ion-list>
            <div v-else class="no-data">
                <p>Tidak ada rumah sakit yang tersedia untuk poli dan tanggal yang dipilih.</p>
            </div>
            <ion-button expand="block" @click="goBack">
                Kembali
            </ion-button>
        </ion-content>
    </ion-page>
</template>

<script>
import { defineComponent } from "vue";
import { alertController } from "@ionic/vue";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { db } from "@/firebase";

export default defineComponent({
    name: "SelectHospital",
    data() {
        return {
            hospitalList: [],
        };
    },
    async mounted() {
        const selectedDate = this.$route.query.date;
        const selectedPoli = this.$route.query.poli;

        console.log("Selected Date:", selectedDate);
        console.log("Selected Poli:", selectedPoli);

        if (!selectedDate || !selectedPoli) {
            const alert = await alertController.create({
                header: "Error",
                message: "Data tanggal atau poli tidak ditemukan. Silakan kembali dan pilih ulang.",
                buttons: ["OK"],
            });
            await alert.present();
            return;
        }

        try {
            const date = new Date(selectedDate);
            const startOfDay = Timestamp.fromDate(new Date(date.setHours(0, 0, 0, 0)));
            const endOfDay = Timestamp.fromDate(new Date(date.setHours(23, 59, 59, 999)));

            const scheduleQuery = query(
                collection(db, "doctor_schedules"),
                where("poli_id", "==", selectedPoli),
                where("tgl_praktek", ">=", startOfDay),
                where("tgl_praktek", "<=", endOfDay)
            );

            const scheduleSnapshot = await getDocs(scheduleQuery);

            const hospitalIds = new Set(
                scheduleSnapshot.docs.map((doc) => doc.data().id_hospital)
            );

            if (hospitalIds.size > 0) {
                const hospitals = [];
                for (const hospitalId of hospitalIds) {
                    const hospitalRef = collection(db, "hospitals");
                    const hospitalQuery = query(
                        hospitalRef,
                        where("__name__", "==", hospitalId)
                    );

                    const hospitalSnapshot = await getDocs(hospitalQuery);
                    hospitalSnapshot.forEach((doc) => {
                        hospitals.push({
                            id: doc.id,
                            ...doc.data(),
                        });
                    });
                }

                this.hospitalList = hospitals;
            }
        } catch (error) {
            console.error("Error fetching hospitals:", error);
            const alert = await alertController.create({
                header: "Error",
                message: "Terjadi kesalahan saat mengambil data rumah sakit.",
                buttons: ["OK"],
            });
            await alert.present();
        }
    },
    methods: {
        goBack() {
            this.$router.go(-1);
        },
    },
});
</script>

<style scoped>
.no-data {
    text-align: center;
    margin-top: 20px;
    color: #666;
}
</style>
