<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                  <ion-buttons slot="start">
          <a class="back-button" @click="goBack">
            Back
          </a >
        </ion-buttons>
                <ion-title>Queue Card</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content style="--background: #e1eee9;">
            
                <h2 class="page-title" style="color: black; text-align: left; margin-left: 15px;">Your Registration Info</h2>
                <div class="info-box">
                    <img src="@/assets/logo.png" alt="Logo" style="width: 100px; display: block; margin: 0 auto; margin-bottom: 20px;">
                    <p><strong>NIK:</strong> {{ data.nik }}</p>
                    <p><strong>Nama:</strong> {{ data.name }}</p>
                    <p><strong>Rumah Sakit:</strong> {{ data.hospitalName }}</p>
                    <p><strong>Poli:</strong> {{ data.poliName }}</p>
                    <p><strong>Dokter:</strong> {{ data.doctorName }}</p>
                    <p><strong>Jadwal:</strong> {{ data.schedule }}</p>
                    <p><strong>Waktu Pembuatan:</strong> {{ formattedCreatedAt }}</p>
                    <p><strong>Username:</strong> {{ data.username }}</p>
                </div>
    
        </ion-content>
    </ion-page>
</template>

<script>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,  IonButton } from "@ionic/vue";

import { useRouter } from "vue-router";

export default {
    name: "QueueCard",
    components: { 
        IonPage, 
        IonHeader, 
        IonToolbar, 
        IonTitle, 
        IonContent,
        IonButton,
        IonButtons,
    },
    data() {
        return {
            data: {
                nik: "",
                name: "",
                hospitalName: "",
                poliName: "",
                doctorName: "",
                schedule: "",
                createdAt: null,
                username: "",
            },
        };
    },
    methods: {
        goBack() {
            this.$router.back();
        },
    },
    computed: {
        formattedCreatedAt() {
            if (this.data.createdAt) {
                const date = typeof this.data.createdAt.toDate === "function"
                    ? this.data.createdAt.toDate() // Jika Timestamp Firestore
                    : new Date(this.data.createdAt); // Jika string ISO

                return date.toLocaleString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                });
            }
            return "Tidak diketahui";
        },
    },
    mounted() {
        const params = this.$route.query;
        this.data = { ...params };
        if (params.createdAt) {
            this.data.createdAt = new Date(params.createdAt); // Konversi ke objek Date jika diperlukan
        }
    },
};
</script>

<style scoped>
ion-content {
    margin-bottom: 500px;
    --padding-bottom: 60px;
}

.page-title {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    color: #006FAE;
    margin-bottom: 16px;
}

.info-box {
    background: #f8f9fa;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin: 20px;
}
</style>