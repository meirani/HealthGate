<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                  <ion-buttons slot="start">
          <a class="back-button" @click="goBack">
            Back
          </a >
        </ion-buttons>
                <ion-title>{{ isEdit ? "Update Doctor Schedule" : "Add Doctor Schedule" }}</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding" style="--background: #e1eee9;">
            <div class="container">
                <ion-item>
                    <ion-label position="stacked">Nama Dokter</ion-label>
                    <ion-input :value="schedule.name" placeholder="Masukkan nama dokter"
                        @ionInput="schedule.name = $event.target.value"></ion-input>
                </ion-item>

                <ion-item>
                    <ion-label position="stacked">Jadwal</ion-label>
                    <ion-input :value="schedule.schedule" placeholder="Masukkan jadwal"
                        @ionInput="schedule.schedule = $event.target.value"></ion-input>
                </ion-item>

                <ion-button expand="block" @click="saveDoctorSchedule">
                    {{ isEdit ? "Update" : "Add" }}
                </ion-button>
            </div>
        </ion-content>
    </ion-page>
</template>

<script>
import { getFirestore, doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { IonPage, IonHeader, IonToolbar, IonButtons, IonTitle, IonContent, IonButton } from "@ionic/vue";
import { useRouter } from "vue-router";

export default {
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
            schedule: { name: "", schedule: "" },
            isEdit: false,
        };
    },
    async mounted() {
        const { hospitalId, poliId, doctorScheduleId } = this.$route.params;
        if (doctorScheduleId) {
            this.isEdit = true;
            const db = getFirestore();
            const scheduleRef = doc(db, "hospitals", hospitalId, "polyclinics", poliId, "doctor_schedules", doctorScheduleId);
            const docSnap = await getDoc(scheduleRef);
            if (docSnap.exists()) {
                this.schedule = docSnap.data();
            }
        }
    },
    methods: {
        goBack() {
            this.$router.back();
        },
        async saveDoctorSchedule() {
            const db = getFirestore();
            const { hospitalId, poliId, doctorScheduleId } = this.$route.params;

            let scheduleId;
            if (this.isEdit) {
                // Jika edit, gunakan ID yang sudah ada
                scheduleId = doctorScheduleId;
            } else {
                // Jika tambah, cari ID berikutnya berdasarkan urutan numerik
                const scheduleRef = collection(db, "hospitals", hospitalId, "polyclinics", poliId, "doctor_schedules");
                const querySnapshot = await getDocs(scheduleRef);

                // Ekstrak ID yang sudah ada dan cari ID berikutnya
                const ids = querySnapshot.docs
                    .map((doc) => doc.id)
                    .filter((id) => id.startsWith("ds_"))
                    .map((id) => parseInt(id.split("_")[1]));

                const nextId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
                scheduleId = `ds_${nextId}`;
            }

            const scheduleRef = doc(db, "hospitals", hospitalId, "polyclinics", poliId, "doctor_schedules", scheduleId);

            await setDoc(scheduleRef, this.schedule, { merge: true });
            this.$router.push({ name: "DoctorSchedule", params: { hospitalId, poliId } });
        },
    },
};
</script>